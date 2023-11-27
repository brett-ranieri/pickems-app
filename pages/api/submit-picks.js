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
        INSERT INTO public.picks
          ( 
            user_id,
            chosen_team,
            game_id
          )
        SELECT
            user_id,
            chosen_team,
            game_id
        FROM
            json_populate_recordset(null::public.picks, $1)
        RETURNING *
        `,
				[req.body]
			);
		} else if (req.method === "PUT") {
		}

		// you said something about a diff syntaxt for
		// res.send at the end of the post method???
		res.json(results.rows);
	} catch (err) {
		console.log(err);
	}
}
