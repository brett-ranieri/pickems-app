import React, { useEffect, useState } from "react";
import { TeamCard } from "./team_card";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [buttonStyle, setButtonStyle] = useState("");
	const [picks, setPicks] = useState([]);

	const getGames = async () => {
		console.log("hello??");
		let results = await fetch(`http://localhost:3000/api/games`);
		let upcomingGames = await results.json();
		console.log(upcomingGames);
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		let teams = await results.json();
		setTeams(teams);
	};

	useEffect(() => {
		console.log("running useeffect");
		getTeams();
		getGames();
	}, []);

	const homeClicked = async (game) => {
		if (buttonStyle === "notSelected" || buttonStyle === "") {
			setButtonStyle("selected");
			console.log("one", game.home_id);
			let pick = {
				id: game.home_id,
				team: game.home_team,
			};
			setPicks([...picks, pick]);
		} else {
			console.log("two");
			setButtonStyle("notSelected");
		}
	};

	const awayClicked = async (game) => {
		if (buttonStyle === "notSelected" || buttonStyle === "") {
			console.log("one", game.away_id);
			setButtonStyle("selected");
			let pick = {
				id: game.away_id,
				team: game.away_team,
			};
			setPicks([...picks, pick]);
		} else {
			console.log("two");
			setButtonStyle("notSelected");
		}
	};

	const renGameData = games.map(function (game) {
		return (
			<div key={game.id}>
				<TeamCard
					teamId={game.home_id}
					teams={teams}
				/>
				<div>vs.</div>
				<TeamCard
					teamId={game.away_id}
					teams={teams}
				/>
				<br />
				<br />
			</div>
		);
	});

	function logResults() {
		console.log("submitted");
		console.log(picks);
		console.log(teams);
	}

	return (
		<>
			<p>This is the game view page</p>
			{/* <button onClick={() => getTeams()}>Click me!</button> */}

			{renGameData}
			<button
				type='submit'
				onClick={() => logResults()}
			>
				Submit
			</button>
		</>
	);
};

export default GameViewPage;
