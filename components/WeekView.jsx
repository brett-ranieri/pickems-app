import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import stat_results from "../constants/stats-results";

export const WeekView = ({ baseUrl, allPicks, allStatPicks, user, handleViewChange, logout }) => {
	const [games, setGames] = useState([]);
	// const [picks, setPicks] = useState([]);
	// const [allPicks, setAllPicks] = useState([]);
	let allGameScores = [];
	let allStatScores = [];
	let allOverallScores = [];

	const getGames = async () => {
		const results = await fetch(`${baseUrl}/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
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
		allGameScores.push({ user: user.id, name: user.name, score: score });
	};
	users.forEach(getUserScore);

	const calcStatScore = async (user) => {
		let statScore = 0;
		const userPicks = allStatPicks.filter((pick) => {
			return pick.user_id === user.id;
		});
		const checkForWinner = (pick) => {
			if (pick.winner === pick.chosen_team) {
				statScore++;
			}
		};
		if (userPicks.length) {
			userPicks.forEach(checkForWinner);
		}
		allStatScores.push({ user: user.id, name: user.name, score: statScore });
	};
	users.forEach(calcStatScore);

	const calcOverallScore = async (user) => {
		const userGameScore = allGameScores.find((score) => {
			return score.user === user.id;
		});

		const userStatScore = allStatScores.find((score) => {
			return score.user === user.id;
		});
		const userOverallScore = userGameScore.score + userStatScore.score;

		allOverallScores.push({ user: user.id, name: user.name, score: userOverallScore });
	};
	users.forEach(calcOverallScore);

	useEffect(() => {
		getGames();
		// getAllPicks();
	}, []);

	//sort scores in descending order
	allGameScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	allStatScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	allOverallScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	// console.log(allOverallScores);

	return (
		<div className='bg-side-line bg-cover'>
			<div className='bg-lime-800 flex flex-row justify-end p-1'>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("wager")}
				>
					Submit Picks
				</button>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("score")}
				>
					Scores
				</button>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>

			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>This Week's Picks:</p>
				<div className='mb-6'></div>
			</div>
			<div className='mt-80'>.</div>
		</div>
	);
};
