import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);

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
		const user = 7;
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === user;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setIsSubmitted(userPicks);
		} else {
			// setting both states to an empty array here appears to have
			// fixed intial render bug from last commit
			setPicks([]);
			setIsSubmitted([]);
		}
	};

	useEffect(() => {
		getTeams();
		getGames();
		getPicks();
	}, []);

	const clicked = async (id, gameId) => {
		const pick = {
			user_id: 7,
			chosen_team: id,
			game_id: gameId,
		};
		const tempPicks = picks?.filter((pick) => pick.game_id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	const handleSubmit = async () => {
		if (isSubmitted.length) {
			console.log("picks already made");
		} else {
			// post request to endpoint, body is stringified picks
			const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
				method: "POST",
				//by stringifying here, don't need to in the endpoint
				body: JSON.stringify(picks),
			});
			if (postPicksRes) {
				console.log("something happened");
				// moved into this if statement to ensure that post was successful
				// before setting picks to isSubmitted...did I do that right?
				setIsSubmitted(picks);
			}
		}
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
			{isSubmitted.length ? (
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
