import React, { useEffect, useState } from "react";

const TestPage = () => {
	const [games, setGames] = useState([]);
	const getTeams = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`);
		console.log(await teams.json());
	};

	const getGames = async () => {
		const games = await fetch(`http://localhost:3000/api/games`);
		let upcomingGames = await games.json();
		setGames(upcomingGames);
	};

	const hitEspn = async () => {
		let apiUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
		const reply = await fetch(apiUrl);
		let data = await reply.json();
		// console.log(data);
		let events = data.events;
		let teamsOnBye = data.week.teamsOnBye;
		console.log(events);
	};

	const postTeam = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`, {
			method: "POST",
			body: JSON.stringify({
				color: "yellow",
			}),
		});
		console.log(await teams.json());
	};

	useEffect(() => {
		// getTeams();
		getGames();
		// hitEspn();
	}, []);

	console.log(games);
	const renGameData = games.map(function (game) {
		return <p>{game.id}</p>;
	});

	return (
		<>
			<p>Hello world</p>
			{/* <button onClick={() => postTeam()}>Click me!</button> */}
			<p>{renGameData}</p>
		</>
	);
};

export default TestPage;
