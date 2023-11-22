const client = require("./elephantsql.js");

export default async function games(req, res) {
	// console.log("request: ", req);
	const allowedReqTypes = ["GET"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		results = await client.query("select * from public.games");

		res.json(results.rows);
		// console.log(results);
	} catch (err) {
		console.log(err);
	}
}
