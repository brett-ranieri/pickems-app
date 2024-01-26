const client = require("./elephantsql.js");

export default async function submitPicks(req, res) {
	// console.log("request: ", req);
	const allowedReqTypes = ["POST", "PUT"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		if (req.method === "POST") {
			// console.log("request: ", req);
			console.log("posting");
			results = await client.query(
				`
        INSERT INTO public.stat_picks
          ( 
            user_id,
            chosen_team,
            game_id,
						week
          )
        SELECT
            user_id,
            chosen_team,
            game_id,
						week
        FROM
            json_populate_recordset(null::public.stat_picks, $1)
        RETURNING *
        `,
				[req.body]
			);
			// moved return up into this if statement because it wants results.rows
			res.json(results.rows);
		} else if (req.method === "PUT") {
			console.log(req.body);
			const updatedPicks = JSON.parse(req.body);
			// is it bad form to parse here and not stringify again before query?
			updatedPicks.forEach(async function (updatedPick) {
				console.log(updatedPick);
				results = await client.query(
					`update public.stat_picks set chosen_team = '${updatedPick.chosen_team}' where game_id = '${updatedPick.game_id}' and user_id = '${updatedPick.user_id}' returning *`
				);
			});
			// seperate return statement here because this wants just results
			res.json(results);
		}
	} catch (err) {
		console.log(err);
	}
}
