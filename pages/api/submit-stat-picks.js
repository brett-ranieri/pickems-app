const client = require("./elephantsql.js");

export default async function submitPicks(req, res) {
	const allowedReqTypes = ["POST", "PUT"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		if (req.method === "POST") {

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
			console.log(results.rows)
			// moved return up into this if statement because it wants results.rows
			res.json(results.rows);
		} else if (req.method === "PUT") {

			// 2nd
			// here you need to be able to update more than one pick at once
			// the way this is set up you need to make these network calls in a loop becuas e ou cant pass an array via json_populate_recordset
			// to an update query that only works for insert queries

			// SO you need to write a delete query that is
			//await client.query(`
			//delete from public.stat_picks where user_id=$1 and game_id in (${paramCount})
			//`,
			//[updatedPicks[0].user_id, ...gameIdsToDelete])
			// (format that) - and you need to figure out two things,
			// paramCount which needs to look like EXAMPLE: '$2, $3, $4' if you're deleting 3 picks, for n number of picks,
			// you need to get that by mapping over updatedPicks and concatonating a string that looks like the example
			// THIS IS THE CODE TO GET PARAMCOUNT: const paramCount = updatedPicks.map((_, index) => '$' + (index + 2)).join(',')
			// and gameIdsToDelete which you need to get by mapping over updatedPicks and returning a simple array of game ids

			// then after your delete query you need to take the req.body and insert it into public.stat_picks as a json_populate_recordset
			// this is the same query as your post. if you wanna be a good developer, abstract the query as a string and just call it in both locations.
			// then return results.rows


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
