import React, { useEffect, useState } from "react";

const TestPage = () => {
	const [games, setGames] = useState([]);
	const getTeams = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`);
		console.log(await teams.json());
	};

	const getGames = async () => {
		console.log("hello??");
		const games = await fetch(`http://localhost:3000/api/games`);
		let upcomingGames = await games.json();
		console.log(upcomingGames);
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

	function logResults() {
		console.log("submitted");
		let picksForm = document.getElementById("userPicks");
		picksForm.addEventListener("submit", (e) => {
			e.preventDefault();
		});
		let picks = [];

		console.log(picksForm);
	}

	useEffect(() => {
		console.log("running useeffect");
		// getTeams();
		getGames();
		// hitEspn();
	}, []);

	console.log(games);
	const renGameData = games.map(function (game) {
		return (
			<div key={game.id}>
				<input
					type='radio'
					id='home'
					key={game.home_id}
					name={game.id}
					value={game.home_id}
				/>
				<label for='home'>{game.home_team} vs. </label>
				<label for='away'>{game.away_team}</label>
				<input
					type='radio'
					id='away'
					key={game.away_id}
					name={game.id}
					value={game.away_id}
				/>
				<br />
				<br />
			</div>
		);
	});

	return (
		<>
			<p>Pickems App!</p>
			{/* <button onClick={() => getTeams()}>Click me!</button> */}
			<form
				action=''
				id='userPicks'
			>
				{renGameData}
				<button
					type='submit'
					onClick={() => logResults()}
				>
					Submit
				</button>
			</form>
		</>
	);
};

export default TestPage;
