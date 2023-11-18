var pg = require("pg");
//or native libpq bindings
//var pg = require('pg').native

var conString =
	"postgres://yssefelr:85_lczYZf6Pp6-LEO12RGlbY44vJrktd@bubble.db.elephantsql.com/yssefelr"; //Can be found in the Details page
var client = new pg.Client(conString);
client.connect(function (err) {
	if (err) {
		return console.error("could not connect to postgres", err);
	}
	client.query('SELECT NOW() AS "theTime"', function (err, result) {
		if (err) {
			return console.error("error running query", err);
		}
		console.log(result.rows[0].theTime);
		// >> output: 2018-08-23T14:02:57.117Z
		client.end();
	});
});

export default async function teams(req, res) {
	console.log("request: ", req);
	const allowedReqTypes = ["GET", "POST"];
	if (!allowedReqTypes.includes(req.method)) {
		// idk if 401 is right
		return res.status(401).send({ title: "request type not allowed" });
	}
	try {
		let results;
		if (req.method === "GET") {
			console.log("request: ", req);
			results = await client.query("select * from public.teams");
		} else if (req.method === "POST") {
			// /scripts/populate-teams.js
			// call once to populate teams in postman
			// get teams from ESPN, run code to map them to array
			// run for(of)Each loop on teams,  inside loop will be query
			// values of query will be keys of object!

			const body = JSON.parse(req.body);
			// console.log(JSON.parse(req.body));
			results = await client.query(
				`insert into public.teams(alt_color, color, display_name, id, logo, name, abbrv) values('${body.color}', 'orange', 'Orlando Oranges', '90', 'http://fakewebsite.jpg', 'Citrus', 'OO') returning *`
			);
		}

		res.json(results.rows);
		// console.log(results);
	} catch (err) {
		console.log(err);
	}
}
