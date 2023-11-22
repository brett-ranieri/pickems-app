const client = require("./elephantsql.js");

export default async function populateTeams(req, res) {
	console.log("populating...");
	// const allowedReqTypes = ["GET", "POST"];
	// if (!allowedReqTypes.includes(req.method)) {
	// 	// idk if 401 is right
	// 	return res.status(401).send({ title: "request type not allowed" });
	// }
	try {
		let apiUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
		let teams = [];
		let results;
		const reply = await fetch(apiUrl);
		let data = await reply.json();
		// console.log(data);
		let events = data.events;
		// let teamsOnBye = data.week.teamsOnBye;

		// map data
		events.forEach(function (event) {
			let competition = event.competitions;
			let competitors = competition[0].competitors;

			//get teams:
			let team1 = {
				id: competitors[0].team.id,
				intId: parseInt(competitors[0].team.id),
				displayName: competitors[0].team.displayName,
				color: competitors[0].team.color,
				alternateColor: competitors[0].team.alternateColor,
				logo: competitors[0].team.logo,
				name: competitors[0].team.name,
				abbreviation: competitors[0].team.abbreviation,
			};
			teams.push(team1);
			let team2 = {
				id: competitors[1].team.id,
				intId: parseInt(competitors[1].team.id),
				displayName: competitors[1].team.displayName,
				color: competitors[1].team.color,
				alternateColor: competitors[1].team.alternateColor,
				logo: competitors[1].team.logo,
				name: competitors[1].team.name,
				abbreviation: competitors[1].team.abbreviation,
			};
			teams.push(team2);
		});

		// get any teams on bye
		// teamsOnBye.forEach(function (team) {
		// 	let newTeam = {
		// 		id: team.id,
		// 		intId: parseInt(team.id),
		// 		displayName: team.displayName,
		// 		color: team.color,
		// 		alternateColor: team.alternateColor,
		// 		logo: team.logo,
		// 		name: team.name,
		// 		abbreviation: team.abbreviation,
		// 	};
		// 	teams.push(newTeam);
		// });
		// console.log(teams);

		//for each loop to add each team to database

		teams.forEach(async function (team) {
			results = await client.query(
				`insert into public.teams(alt_color, color, display_name, id, logo, name, abbrv) values('${team.alternateColor}', '${team.color}', '${team.displayName}', '${team.id}', '${team.logo}', '${team.name}', '${team.abbreviation}') returning *`
			);
		});

		res.json(results);
		console.log("completed");
		// console.log(results);
	} catch (err) {
		console.log(err);
	}
}
