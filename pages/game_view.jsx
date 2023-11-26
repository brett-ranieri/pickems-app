import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
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
		const pick = {
			choosenTeam: id,
			id: gameId,
		};
		console.log(pick);
		
		const tempPicks = picks?.filter((pick) => pick.id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	// you should call it handleSubmit
	// also you should do them all as arrow functions its 2023
	function logResults() {
		console.log("submitted");
		console.log(picks);
	}

	console.log(picks)

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
