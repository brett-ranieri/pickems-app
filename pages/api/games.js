const client = require("./elephantsql.js");

export default async function games(req, res) {
	// console.log("request: ", req);
	const { sent } = req.query;
	const allowedReqTypes = ["GET"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		console.log("before call");
		results = await client.query(`
		select 
		* 
		from 
		public.games
		${sent ? `where week = (select max(week) from public.games)` : ""}
		`);
		console.log("another change");
		// this is just a different syntax for the same thing, res.send vs res.json
		res.status(200).send(results.rows);
		// res.json(results.rows);
		// console.log(results);
	} catch (err) {
		console.log(err);
	}
	// finally {
	// 	client.end();
	// }
}
