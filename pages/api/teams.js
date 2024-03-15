const client = require("./elephantsql.js");

export default async function teams(req, res) {
	const allowedReqTypes = ["GET", "POST"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		if (req.method === "GET") {
			console.log("got got");
			results = await client.query("select * from public.teams");
		}

		// ******TEST FOR POST METHOD*************
		// look at test.jsx file for functionality of test post below

		// else if (req.method === "POST") {
		// 	// /scripts/populate-teams.js
		// 	// call once to populate teams in postman
		// 	// get teams from ESPN, run code to map them to array
		// 	// run for(of)Each loop on teams,  inside loop will be query
		// 	// values of query will be keys of object!

		// 	const body = JSON.parse(req.body);
		// 	// console.log(JSON.parse(req.body));
		// 	results = await client.query(
		// 		`insert into public.teams(alt_color, color, display_name, id, logo, name, abbrv) values('${body.color}', 'orange', 'Orlando Oranges', '90', 'http://fakewebsite.jpg', 'Citrus', 'OO') returning *`
		// 	);
		// }
		// *****************************************

		res.json(results.rows);
	} catch (err) {
		console.log(err);
	}
}
