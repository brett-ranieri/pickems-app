import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import baseUrl from "../constants/baseUrl";
import stat_results from "../constants/stats-results";

export const ScoreView = ({ allPicks, allStatPicks, user, handleViewChange, logout }) => {
	const [games, setGames] = useState([]);
	// const [picks, setPicks] = useState([]);
	// const [allPicks, setAllPicks] = useState([]);
	let allGameScores = [];
	let allStatScores = [];
	let allOverallScores = [];

	const getGames = async () => {
		// const results = await fetch(`${baseUrl}/api/games`);
		const results = await fetch(`https://pickems-app.vercel.app/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	// const getAllPicks = async () => {
	// 	const results = await fetch(`${baseUrl}/api/picks`);
	// 	// const results = await fetch(`https://pickems-app.vercel.app/api/picks`);
	// 	const allPicks = await results.json();
	// 	setAllPicks(allPicks);
	// };

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
	console.log(allOverallScores);

	return (
		<div className='bg-side-line bg-cover'>
			<div className='bg-lime-800 flex flex-row justify-end p-1'>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange()}
				>
					Picks
				</button>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Overall Scores:</p>
				<div className='mb-6'>
					{allOverallScores.map((score) => (
						<div
							key={score.user}
							className='text-lg'
						>
							<ScoreCard
								score={score}
								user={user}
							/>
						</div>
					))}
				</div>
			</div>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Game Scores:</p>
				<div className='mb-6'>
					{allGameScores.map((score) => (
						<div
							key={score.user}
							className='text-lg'
						>
							<ScoreCard
								score={score}
								user={user}
							/>
						</div>
					))}
				</div>
			</div>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Stat Scores:</p>
				<div className='mb-6'>
					{allStatScores.map((score) => (
						<div
							key={score.user}
							className='text-lg'
						>
							<ScoreCard
								score={score}
								user={user}
							/>
						</div>
					))}
				</div>
			</div>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>
					Conference Championship Stat Results:
				</p>
				<div className='flex flex-col justify-around text-center font-bold pt-2 pb-2 mb-6'>
					<h3 className='text-2xl mb-2'>Total Points:</h3>
					<ul className='mb-2'>
						<li>49ers - 34</li>
						<li>Lions - 31</li>
						<li>Chiefs - 17</li>
						<li>Ravens - 10</li>
					</ul>
					<h3 className='text-2xl mb-2'>Total Yards:</h3>
					<ul className='mb-2'>
						<li>Lions - 442</li>
						<li>49ers - 413</li>
						<li>Ravens - 336</li>
						<li>Cheifs - 319</li>
					</ul>
				</div>
			</div>
			<div className='mt-80'>.</div>
		</div>
	);
};
