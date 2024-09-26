const client = require("./elephantsql.js");

export default async function populateWinners(req, res) {
	console.log("winning...");
	try {
		let apiUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
		let games = [];
		let winners = [];
		let results;
		const reply = await fetch(apiUrl);
		let data = await reply.json();
		// console.log(data);
		let events = data.events;

		// map data
		events.forEach(function (event) {
			let competition = event.competitions;
			let competitors = competition[0].competitors;

			// // get games:
			let game = {
				id: event.id,
				week: event.week.number,
				homeTeam: competitors[0].team.displayName,
				homeId: competitors[0].id,
				homeWinner: competitors[0].winner,
				homeScore: competitors[0].score,
				awayTeam: competitors[1].team.displayName,
				awayId: competitors[1].id,
				awayWinner: competitors[1].winner,
				awayScore: competitors[1].score,
				date: event.date,
			};
			// console.log(game);
			games.push(game);
		});

		games.forEach(function (game) {
			let winner = [];
			if (game.homeWinner) {
				let gameWinner = {
					id: game.id,
					week: game.week,
					winner: game.homeId,
				};
				winner.push(gameWinner);
			}
			if (game.awayWinner) {
				let gameWinner = {
					id: game.id,
					week: game.week,
					winner: game.awayId,
				};
				winner.push(gameWinner);
			}
			winners.push(winner);
		});

		winners.forEach(async function (winner) {
			// console.log(winner);
			// console.log(winner[0].id);
			results = await client.query(
				// `insert into public.games(winner) values('${game.id}') where id = '${winner.id}' returning *`
				`update public.games set winner = '${winner[0].winner}' where id = '${winner[0].id}' returning *`
			);
			console.log("loop", results);
		});

		res.json(results);
		console.log("rows", results);
		console.log("completed");
		// console.log(results);

		// console.log("Games: ", games);
		// console.log("Winners: ", winners);
	} catch (err) {
		console.log(err);
	}
}
