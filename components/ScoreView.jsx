import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import baseUrl from "../constants/baseUrl";

export const ScoreView = ({ user, handleViewChange }) => {
	const [games, setGames] = useState([]);
	// const [picks, setPicks] = useState([]);
	const [allPicks, setAllPicks] = useState([]);
	let allScores = [];

	console.log("SV:", user);
	console.log("logging out of SV", baseUrl);

	const getGames = async () => {
		const results = await fetch(`${baseUrl}/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getAllPicks = async () => {
		const results = await fetch(`${baseUrl}/api/picks`);
		const allPicks = await results.json();
		setAllPicks(allPicks);
	};

	// re-factored all previous functions to all run in a loop
	const getUserScore = async (user) => {
		let score = 0;
		const userPicks = allPicks.filter((pick) => {
			return pick.user_id === user.id;
		});
		const checkForWinner = (pick) => {
			if (pick.winner === pick.chosen_team) {
				score++;
			}
		};
		if (userPicks.length) {
			userPicks.forEach(checkForWinner);
		}
		allScores.push({ user: user.id, name: user.name, score: score });
	};
	users.forEach(getUserScore);

	useEffect(() => {
		getGames();
		getAllPicks();
	}, []);

	console.log(allPicks);
	console.log(games);

	//sort scores in descending order
	allScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));

	return (
		<div className='bg-slate-400 h-full'>
			<p className='text-3xl font-bold m-8'>Overall Scores:</p>
			{allScores.map((score) => (
				<div key={score.user}>
					<ScoreCard
						score={score}
						user={user}
					/>
				</div>
			))}

			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
				onClick={() => handleViewChange()}
			>
				Make some picks!
			</button>
		</div>
	);
};
