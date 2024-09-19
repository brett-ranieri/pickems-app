import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import stat_results from "../constants/stats-results";

export const ScoreView = ({ baseUrl, allPicks, allStatPicks, user, handleViewChange, logout }) => {
	const [games, setGames] = useState([]);
	const [formattedGames, setFormattedGames] = useState([]);
	const [formattedPicks, setFormattedPicks] = useState([]);
	const [scoringBreakdown, setScoringBreakdown] = useState([]);
	const [totalScores, setTotalScores] = useState([]);
	// const [picks, setPicks] = useState([]);
	// const [allPicks, setAllPicks] = useState([]);
	let allGameScores = [];
	let allStatScores = [];
	let allOverallScores = [];

	//////////////////////// get and sort all games ///////////////////////////////////
	const getGames = async () => {
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
			for (let i = 1; i < extrudedGames.length + 1; i++) {
				let week = extrudedGames.find((e) => e.week === i);
				if (week?.week === undefined) {
					// is there a way to stop a specific "lap" of a loop and move on to next?
					// should I just leave this if statement blank to handle this case with no
					// action?
				} else {
					const gamesToPush = games.filter((e) => e.week === week?.week);
					let index = i - 1;
					extrudedGames[index]?.games.push(gamesToPush);
				}
			}
		}
		loadWeek(extrudedGames);
		setFormattedGames(extrudedGames);
	};
	/////////////////////////////////////////////////////////////////////////////

	// brought out of scoreAndFormatPicks to make accesible to more functions
	// get array of weeks that will need to be mapped for picks
	const weeksToMap = formattedGames.map(function (game) {
		return game.week;
	});
	console.log(weeksToMap);

	//////////////////// score and format all user picks //////////////////////////

	const scoreAndFormatPicks = (users) => {
		// will be populated by the a forEach loop of users calling calculateScore()
		let restructuredPicks = [];
		let allTotalScores = [];
		function calculateScore(user) {
			const picksToScore = allPicks.filter((e) => e.user_id === user.id);
			console.log(picksToScore);
			const statPicksToScore = allStatPicks.filter((e) => e.user_id === user.id);

			// written to be used multiple times in different ways
			// doesn't always receive week property when called, and conditionally
			// adds properties to object based on week property
			function doTheMaths(picks, statPicks, week) {
				let gameScore = 0;
				let statScore = 0;
				picks.map(function (pick) {
					if (pick.chosen_team === pick.winner) {
						gameScore++;
					}
				});

				//////////////// need to comment out until statPicks table is cleared /////////////////////////
				// hate that this feels pretty damp and redundant, must be a better
				// way to be able to calculate two scores seperately. currently can only
				// think of options that involve restructuring data...
				// example: make all stat picks ids start with 99- and then write logic
				// if (pick.id.includes("99-"))
				// statPicks.map(function (statPick) {
				// 	if (statPick.chosen_team === statPick.winner) {
				// 		statScore++;
				// 	}
				// });
				/////////////////////////////////////////////////////////////////////////////////////////////////

				if (!week) {
					console.log("nope");
				}

				const scoresToPush = {
					// only return user id if no week
					...(!week && { user_id: user.id }),
					// conditionally add the week key/value pair IF the week property is passed
					...(week && { week: week }),
					name: user.name,
					gameScore: gameScore,
					statScore: statScore,
					totalScore: gameScore + statScore,
				};
				return scoresToPush;
			}

			// populate totalScores
			function getOverall() {
				const forTotalScore = doTheMaths(picksToScore, statPicksToScore);
				// forTotalScore receives id prop but not week from doTheMaths
				allTotalScores.push(forTotalScore);
			}
			getOverall();

			// populate scoresByWeek
			function calcAndFormatByWeek(picks, statPicks) {
				let weekPicksToPush = { user_id: user.id, allPicks: [], allStatPicks: [], scores: [] };
				weeksToMap.map(function (week) {
					// week property conditionally passed by doTheMaths is used here to filter picks
					const eachGameWeek = picks.filter((e) => e.week === week);
					const eachStatWeek = statPicks.filter((e) => e.week === week);
					const thisWeek = doTheMaths(eachGameWeek, eachStatWeek, week);
					weekPicksToPush.scores.push(thisWeek);
					weekPicksToPush.allPicks.push({ week: week, picks: eachGameWeek });
					weekPicksToPush.allStatPicks.push({ week: week, statPicks: eachStatWeek });
				});
				restructuredPicks.push(weekPicksToPush);
			}
			calcAndFormatByWeek(picksToScore, statPicksToScore);
		}
		users.forEach(calculateScore);
		// setScoringBreakdown(totalScores);
		setFormattedPicks(restructuredPicks);
		setTotalScores(allTotalScores);
	};

	useEffect(() => {
		scoreAndFormatPicks(users);
	}, [formattedGames]);

	useEffect(() => {
		console.log("**************************", formattedPicks);
	}, [formattedPicks]);

	useEffect(() => {
		console.log("++++++++++++++++++++++++++", totalScores);
	}, [totalScores]);

	///////////////////////////////////////////////////////////////////////////////
	useEffect(() => {
		getGames();
		// getAllPicks();
	}, []);

	useEffect(() => {
		sortGames(games);
	}, [games]);

	totalScores.sort((a, b) => parseInt(b.totalScore) - parseInt(a.totalScore));

	/////////////////////////////////////////START: OLD CODE////////////////////////////////////////////////////////
	// re-factored all previous functions to all run in a loop
	// const getUserScore = async (user) => {
	// 	let score = 0;
	// 	const userPicks = allPicks.filter((pick) => {
	// 		return pick.user_id === user.id;
	// 	});
	// 	const checkForWinner = (pick) => {
	// 		if (pick.winner === pick.chosen_team) {
	// 			score++;
	// 		}
	// 	};
	// 	if (userPicks.length) {
	// 		userPicks.forEach(checkForWinner);
	// 	}
	// 	allGameScores.push({ user: user.id, name: user.name, score: score });
	// };
	// users.forEach(getUserScore);

	// const calcStatScore = async (user) => {
	// 	let statScore = 0;
	// 	const userPicks = allStatPicks.filter((pick) => {
	// 		return pick.user_id === user.id;
	// 	});
	// 	const checkForWinner = (pick) => {
	// 		if (pick.winner === pick.chosen_team) {
	// 			statScore++;
	// 		}
	// 	};
	// 	if (userPicks.length) {
	// 		userPicks.forEach(checkForWinner);
	// 	}
	// 	allStatScores.push({ user: user.id, name: user.name, score: statScore });
	// };
	// users.forEach(calcStatScore);

	// const calcOverallScore = async (user) => {
	// 	const userGameScore = allGameScores.find((score) => {
	// 		return score.user === user.id;
	// 	});

	// 	const userStatScore = allStatScores.find((score) => {
	// 		return score.user === user.id;
	// 	});
	// 	const userOverallScore = userGameScore.score + userStatScore.score;

	// 	allOverallScores.push({ user: user.id, name: user.name, score: userOverallScore });
	// };
	// users.forEach(calcOverallScore);

	// console.log("here", formattedGames);

	// //sort scores in descending order
	// allGameScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	// allStatScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	// allOverallScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));
	// // console.log(allOverallScores);
	/////////////////////////////////////////////////END: Old Code/////////////////////////////////////////////////////////////
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
					onClick={() => handleViewChange("week")}
				>
					This Week
				</button>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>
			{/* <div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
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
			</div> */}
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Overall Scores:</p>
				<div className='mb-6'>
					{totalScores.map((score) => (
						<div
							key={score.user_id}
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
			{/* <div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
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
			</div> */}
			{/* <div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
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
			</div> */}
			<div className='mt-80'>.</div>
		</div>
	);
};
