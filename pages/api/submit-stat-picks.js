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
			console.log("posting", req.body);
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
			console.log(results.rows)
			// moved return up into this if statement because it wants results.rows
			res.json(results.rows);
		} else if (req.method === "PUT") {
			console.log('putting', req.body);
			const updatedPicks = JSON.parse(req.body);
			console.log('UPDATED PICKS!!! ', updatedPicks)
			const paramCount = updatedPicks.map((_, index) => '$' + (index + 2)).join(',')
			const gameIdsToDelete = updatedPicks.map(x => x.game_id)
			console.log(gameIdsToDelete)
			await client.query(`
				delete from public.stat_picks where user_id=$1 and game_id in (${paramCount})
				`, 
				[updatedPicks[0].user_id, ...gameIdsToDelete])
			console.log('after delete')
			// is it bad form to parse here and not stringify again before query?
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
			// let results = []
			// updatedPicks.forEach(async function (updatedPick) {
			// 	console.log(updatedPick);
			// 	const oneResult = await client.query(
			// 		`update public.stat_picks 
			// 		set chosen_team = $1
			// 		where game_id = $2
			// 		and user_id = $3
			// 		returning *`, 
			// 		[updatedPick.chosen_team, updatedPick.game_id, updatedPick.user_id]
			// 	);
			// 	results.push(oneResult.rows)
			// });
			console.log('HERE RIGHT HERE!!!', results)
			
			console.log(results.rows);

			// seperate return statement here because this wants just results
			res.json(results.rows);
		}
	} catch (err) {
		console.log(err);
	}
}
