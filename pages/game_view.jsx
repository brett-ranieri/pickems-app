import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const getGames = async () => {
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	const getPicks = async () => {
		const results = await fetch(`http://localhost:3000/api/picks`);
		const prevPicks = await results.json();
		console.log("PP: ", prevPicks);
		setPrevPicks(prevPicks);
	};

	const setPrevPicks = async (prevPicks) => {
		// manually setting user below
		const user = 2;
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === user;
		});
		if (userPicks.length) {
			console.log(user);
			console.log(userPicks);
			setPicks(userPicks);
			setIsSubmitted(true);
		} else {
			console.log("no picks yet");
		}
	};

	useEffect(() => {
		getTeams();
		getGames();
		getPicks();
	}, []);

	const clicked = async (id, gameId) => {
		const pick = {
			user_id: 5,
			chosen_team: id,
			game_id: gameId,
		};
		const tempPicks = picks?.filter((pick) => pick.game_id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	const handleSubmit = async () => {
		// should this actually be at the end of the fetch? only changing if submit was successful?
		setIsSubmitted(true);
		// post request to endpoint, body is stringified picks
		const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
			method: "POST",
			//by stringifying here, don't need to in the endpoint
			body: JSON.stringify(picks),
		});
		console.log(await postPicksRes.json());
	};

	return (
		<>
			<p className='text-3xl font-bold mb-4'>This is the game view page</p>
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
			{isSubmitted ? (
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
					type='submit'
					onClick={() => handleSubmit()}
				>
					Update
				</button>
			) : (
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
					type='submit'
					onClick={() => handleSubmit()}
				>
					Submit
				</button>
			)}
		</>
	);
};

export default GameViewPage;
