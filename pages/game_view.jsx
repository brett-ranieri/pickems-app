import React, { useEffect, useState } from "react";

const GameViewPage = () => {
	const [games, setGames] = useState([]);
	const [buttonStyle, setButtonStyle] = useState("notSelected");

	const getGames = async () => {
		console.log("hello??");
		let results = await fetch(`http://localhost:3000/api/games`);
		let upcomingGames = await results.json();
		console.log(upcomingGames);
		setGames(upcomingGames);
	};

	useEffect(() => {
		console.log("running useeffect");
		// getTeams();
		getGames();
		// hitEspn();
	}, []);

	const clicked = async (game) => {
		if (buttonStyle === "notSelected") {
			setButtonStyle("selected");
			console.log(buttonStyle);
		} else {
			setButtonStyle("notSelected");
			console.log(buttonStyle);
		}
	};

	const renGameData = games.map(function (game) {
		return (
			<div key={game.id}>
				<div
					className={buttonStyle}
					onClick={clicked}
					key={game.home_id}
				>
					{game.home_team}
				</div>
				<div>vs.</div>
				<div
					className={buttonStyle}
					onClick={() => clicked(game)}
					key={game.away_id}
				>
					{game.away_team}
				</div>
				<br />
				<br />
			</div>
		);
	});

	function logResults() {
		console.log("submitted");
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
