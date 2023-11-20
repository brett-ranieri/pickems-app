import React, { useEffect } from "react";

const TestPage = () => {
	const getTeams = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`);
		console.log(await teams.json());
	};

	const hitEspn = async () => {
		let apiUrl = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
		const reply = await fetch(apiUrl);
		let data = await reply.json();
		// console.log(data);
		let events = data.events;
		let teamsOnBye = data.week.teamsOnBye;
		console.log(teamsOnBye);
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
		getTeams();
		hitEspn();
	}, []);

	return (
		<>
			<p>Hello world</p>;{/* <button onClick={() => postTeam()}>Click me!</button> */}
		</>
	);
};

export default TestPage;
