const client = require("./elephantsql.js");

export default async function statPicks(req, res) {
	const allowedReqTypes = ["GET"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		results = await client.query(
			`SELECT
			*
		FROM
			public.stat_picks 
		`
		);
		res.status(200).send(results.rows);
	} catch (err) {
		console.log(err);
	}
}
