import React, { useEffect, useState } from "react";
// moved TeamCard to new `/components/` folder, shouldn't be in the `pages` directory
// import automatically updated (thanks vs code!)
// also changed the name from `team_card` to `TeamCard` to fit React naming conventions
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	// const [buttonStyle, setButtonStyle] = useState("notSelected");
	const [picks, setPicks] = useState([]);

	const getGames = async () => {
		console.log("hello??");
		// if you're not changing a variable, _always_ declare as a `const`
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		console.log(upcomingGames);
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		const teams = await results.json();
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
		const pick = {
			choosenTeam: id,
			id: gameId,
		};
		console.log(pick);
		// have to do callback to spread prev state into current state update
		// you're not supposed to directly reference the state from inside the `setState`, like `...picks`
		// it can cause an infinite loop. so better to spread the `prev` state in the callback
		// setPicks((prev) => [...prev, pick]);
		// use filter to get array without winner just clicked, spread back into state and include new pick
		const tempPicks = picks?.filter((pick) => pick.id !== gameId);
		setPicks([...tempPicks, pick]);

		// } else {
		// 	console.log("two");
		// 	setButtonStyle("notSelected");
		// }
	};

	function logResults() {
		console.log("submitted");
		console.log(picks);
	}

	return (
		<>
			<p className='text-3xl font-bold mb-4'>This is the game view page</p>
			{/* // didn't need to declare this map outside the default return, can map right here inside {} */}
			{games.map((game) => (
				<div
					key={game.id}
					className='flex flex-row justify-around mb-6'
				>
					<TeamCard
						team={teams?.find((t) => t.id === game.home_id)}
						clicked={clicked}
						game={game}
						picks={picks}
					/>
					<div className='mt-4'>vs.</div>
					<TeamCard
						team={teams?.find((t) => t.id === game.away_id)}
						clicked={clicked}
						game={game}
						picks={picks}
					/>
				</div>
			))}
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
