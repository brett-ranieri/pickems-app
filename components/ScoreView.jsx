import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import stat_results from "../constants/stats-results";

export const ScoreView = ({ baseUrl, allPicks, allStatPicks, user, handleViewChange, logout }) => {
	const [games, setGames] = useState([]);
	// const [picks, setPicks] = useState([]);
	// const [allPicks, setAllPicks] = useState([]);
	let allGameScores = [];
	let allStatScores = [];
	let allOverallScores = [];

	const getGames = async () => {
		// const results = await fetch(`${baseUrl}/api/games`);
		const results = await fetch(`${baseUrl}/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const sortGames = (games) => {
		let extrudedGames = [];
		function checkWeek(game) {
			if (!extrudedGames.filter((e) => e.week === game.week).length) {
				let weekToPush = { week: game.week, games: [] };
				extrudedGames.push(weekToPush);
			}
		}
		games.forEach(checkWeek);
		extrudedGames.sort((a, b) => parseInt(a.week) - parseInt(b.week));

		function loadWeek(extrudedGames) {
			// need weird i parameters because week 4 is skipped and week 5 is super bowl
			for (let i = 1; i < extrudedGames.length + 2; i++) {
				let week = extrudedGames.find((e) => e.week === i);
				if (week?.week === undefined) {
					// return OR break ends the entire loop and it doesn't continue to 5
					// is there a way to stop a specific "lap" of a loop and move on to next?
					// should I just leave this if statement blank to handle this case with no
					// action?
				} else {
					const gamesToPush = games.filter((e) => e.week === week?.week);
					// this feels stupid/too specific to this weird data...
					// thinking I should go in and update week 5 to week 4 so I can write
					// code that will work for next season
					if (week?.week === 5) {
						let index = i - 2;
						extrudedGames[index]?.games.push(gamesToPush);
					} else {
						let index = i - 1;
						extrudedGames[index]?.games.push(gamesToPush);
					}
				}
			}
		}
		loadWeek(extrudedGames);
		console.log("EXT GAMES:", extrudedGames);
	};

	const sortAllUserPicks = (users) => {
		let extrudedUsers = [];
		function checkUser(user) {
			if (!extrudedUsers.filter((e) => e.user_id === user.id).length) {
				let userToPush = { user_id: user.id, user_picks: [] };
				extrudedUsers.push(userToPush);
			}
		}
		users.forEach(checkUser);
		extrudedUsers.sort((a, b) => parseInt(a.user_id) - parseInt(b.user_id));

		function loadPicks(extrudedUsers) {
			for (let i = 1; i < extrudedUsers.length + 1; i++) {
				const userToLoad = extrudedUsers.find((e) => e.user_id === i);

				const filteredPicksToPush = allPicks.filter((e) => e.user_id === userToLoad?.user_id);
				const lastWeekofPicks = Math.max(...filteredPicksToPush.map((o) => o.week));
				// console.log(i, userToLoad, lastWeekofPicks);
				for (let j = 1; j <= lastWeekofPicks; j++) {
					const picksFilteredByWeek = filteredPicksToPush.filter((e) => e.week === j);
					// console.log(j, picksFilteredByWeek);
					if (picksFilteredByWeek.length) {
						const picksToPush = {
							week: j,
							picks: picksFilteredByWeek,
						};
						// console.log(picksToPush);
						const index = i - 1;
						extrudedUsers[index]?.user_picks.push(picksToPush);
					}
				}
			}
		}
		loadPicks(extrudedUsers);
		console.log("EX Users:", extrudedUsers);
	};

	useEffect(() => {
		getGames();
		sortAllUserPicks(users);
		// getAllPicks();
	}, []);

	useEffect(() => {
		sortGames(games);
	}, [games]);

	/////////// OLD CODE BELOW //////////////////////
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
		// // console.log(user);
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
		// console.log(userGameScore);
		const userStatScore = allStatScores.find((score) => {
			return score.user === user.id;
		});
		// console.log(userStatScore);
		const userOverallScore = userGameScore.score + userStatScore.score;
		// console.log(userOverallScore);
		allOverallScores.push({ user: user.id, name: user.name, score: userOverallScore });
	};
	users.forEach(calcOverallScore);

	// // console.log("SV", allPicks);
	// // console.log(games);

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
