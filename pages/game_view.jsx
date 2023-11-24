import React, { useEffect, useState } from "react";
import { TeamCard } from "./team_card";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	// const [buttonStyle, setButtonStyle] = useState("notSelected");
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

	const clicked = async (id, gameId) => {
		// if (buttonStyle === "notSelected") {
		// 	setButtonStyle("selected");
		// 	console.log("one", game.home_id);
		let pick = {
			winner: id,
			id: gameId,
		};
		console.log(pick);
		setPicks([...picks, pick]);
		// } else {
		// 	console.log("two");
		// 	setButtonStyle("notSelected");
		// }
	};

	const renGameData = games.map(function (game) {
		return (
			<div key={game.id}>
				<TeamCard
					teamId={game.home_id}
					teams={teams}
					clicked={clicked}
					gameId={game.id}
				/>
				<div>vs.</div>
				<TeamCard
					teamId={game.away_id}
					teams={teams}
					clicked={clicked}
					gameId={game.id}
				/>
				<br />
				<br />
			</div>
		);
	});

	function logResults() {
		console.log("submitted");
		console.log(picks);
	}

	return (
		<>
			<p>This is the game view page</p>
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
