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
		console.log("before call");
		results = await client.query("select * from public.games");
		console.log("another change");
		res.json(results.rows);
		// console.log(results);
	} catch (err) {
		console.log(err);
	}
	// finally {
	// 	client.end();
	// }
}
