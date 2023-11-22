const client = require("./elephantsql.js");

export default async function populateGames(req, res) {
	console.log("gaming...");
	try {
		let apiUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
		let games = [];
		let results;
		const reply = await fetch(apiUrl);
		let data = await reply.json();
		// console.log(data);
		let events = data.events;
		let teamsOnBye = data.week.teamsOnBye;
		// console.log(teamsOnBye);

		// map data
		events.forEach(function (event) {
			let competition = event.competitions;
			let competitors = competition[0].competitors;

			// get games:
			let game = {
				id: event.id,
				week: event.week.number,
				homeTeam: competitors[0].team.displayName,
				homeId: competitors[0].id,
				awayTeam: competitors[1].team.displayName,
				awayId: competitors[1].id,
			};
			games.push(game);
		});

		games.forEach(async function (game) {
			results = await client.query(
				`insert into public.games(id, week, home_team, home_id, away_team, away_id) values('${game.id}', '${game.week}', '${game.homeTeam}', '${game.homeId}', '${game.awayTeam}', '${game.awayId}') returning *`
			);
		});

		res.json(results);
		console.log("completed");
		// console.log(results);

		console.log("Games: ", games);
	} catch (err) {
		console.log(err);
	}
}
