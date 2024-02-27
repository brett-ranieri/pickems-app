import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import stat_results from "../constants/stats-results";
import { PickHistoryView } from "./PickHistoryView";

export const ScoreView = ({ baseUrl, allPicks, allStatPicks, user, handleViewChange, logout }) => {
	const [games, setGames] = useState([]);
	const [formattedGames, setFormattedGames] = useState([]);
	const [formattedPicks, setFormattedPicks] = useState([]);
	const [scoringBreakdown, setScoringBreakdown] = useState([]);
	const [selectedWeek, setSelectedWeek] = useState(null);

	const handleWeekSelection = (week) => {
		if (!week) {
			setSelectedWeek(null);
		} else {
			setSelectedWeek(week);
		}
		console.log("^%^", formattedPicks);
	};
	//////////////////// SORT AND FORMAT ALL GAMES ///////////////////////////////////////

	// honestly I am not sure why I am sorting the games here...they are not used
	// for scoring at all. Index is only displaying most recent games because it
	// is using conditional in endpoint...so having ALL the games is useful but
	// I feel like it doesnt belong here and I'm not sure where to move it to yet

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
		// console.log("EXT", extrudedGames);
		setFormattedGames(extrudedGames);
	};

	// make global to have accessible in other functions
	// get array of weeks that will need to be mapped for picks
	const weeksToMap = formattedGames.map(function (game) {
		return game.week;
	});
	console.log(weeksToMap);

	//////////////////// SCORE AND FORMAT ALL USER PICKS ///////////////////////////////////////

	const scoreAndFormatPicks = (users) => {
		let restructuredPicks = [];
		let totalScores = [];
		function calculateScore(user) {
			const picksToScore = allPicks.filter((e) => e.user_id === user.id);
			const statPicksToScore = allStatPicks.filter((e) => e.user_id === user.id);

			// written to be used multiple times in different ways
			function doTheMaths(picks, statPicks, week) {
				let gameScore = 0;
				let statScore = 0;
				picks.map(function (pick) {
					if (pick.chosen_team === pick.winner) {
						gameScore++;
					}
				});
				// hate that this feels pretty damp and redundant, must be a better
				// way to be able to calculate two scores seperately. currently can only
				// think of options that involve restructuring data...
				// example: make all stat picks ids start with 99- and then write logic
				// if (pick.id.includes("99-"))
				statPicks.map(function (statPick) {
					if (statPick.chosen_team === statPick.winner) {
						statScore++;
					}
				});

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
				totalScores.push(forTotalScore);
			}
			getOverall();

			// populate scoresByWeek
			function calcAndFormatByWeek(picks, statPicks) {
				let weekPicksToPush = { user_id: user.id, allPicks: [], allStatPicks: [], scores: [] };
				weeksToMap.map(function (week) {
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
		setScoringBreakdown(totalScores);
		setFormattedPicks(restructuredPicks);
	};

	useEffect(() => {
		getGames();
		if (formattedPicks) {
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", formattedPicks);
		}
	}, []);

	useEffect(() => {
		sortGames(games);
	}, [games]);

	useEffect(() => {
		scoreAndFormatPicks(users);
	}, [formattedGames]);

	useEffect(() => {
		console.log("**************************", formattedPicks);
	}, [formattedPicks]);

	// scoringBreakdown is always populating from initial load but Picks are not
	// on fourth try is the first time that Picks populate. this is behavior similar
	// to what is happening with ALL PICKS and ALL STAT PICKS in logs from index.
	// Not currently sure what is causing this, but assuming it has something to do with
	// getOverall() and calcAndFormatByWeek() functions
	// console.log("@@*@@ Scoring:", scoringBreakdown);
	// console.log("$$$ Picks:", formattedPicks);

	// feels like there is likely a better way to do this, but I decided to sort
	// by score category before passing area to map in return
	const overallBreakdown = [...scoringBreakdown].sort(
		(a, b) => parseInt(b.totalScore) - parseInt(a.totalScore)
	);
	const gamesBreakdown = [...scoringBreakdown].sort(
		(a, b) => parseInt(b.gameScore) - parseInt(a.gameScore)
	);
	const statsBreakdown = [...scoringBreakdown].sort(
		(a, b) => parseInt(b.statScore) - parseInt(a.statScore)
	);

	// console.log(formattedPicks);
	// console.log("O", overallBreakdown);
	// console.log("G", gamesBreakdown);
	// console.log("S", statsBreakdown);

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
			<div>
				{weeksToMap.map((week) => (
					<button
						key={week}
						className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
						onClick={() => handleWeekSelection(week)}
					>
						Week {week}
					</button>
				))}
			</div>
			{selectedWeek ? (
				<div>
					<PickHistoryView
						user={user}
						picks={formattedPicks.find((e) => e.user_id === user.id)}
						week={selectedWeek}
						teams={["teams", "will", "be", "here"]}
						handleWeekSelection={handleWeekSelection}
					/>
				</div>
			) : (
				<>
					<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
						<p className='text-3xl text-lime-800 font-black underline m-4'>Overall Scores:</p>
						<div className='mb-6'>
							{overallBreakdown.map((score) => (
								<div
									key={score.user_id}
									className='text-lg'
								>
									<ScoreCard
										score={score}
										// add type property for conditional rendering purposes
										type={"overall"}
										user={user}
									/>
								</div>
							))}
						</div>
					</div>
					<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
						<p className='text-3xl text-lime-800 font-black underline m-4'>Game Scores:</p>
						<div className='mb-6'>
							{gamesBreakdown.map((score) => (
								<div
									key={score.user_id}
									className='text-lg'
								>
									<ScoreCard
										score={score}
										type={"game"}
										user={user}
									/>
								</div>
							))}
						</div>
					</div>
					<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
						<p className='text-3xl text-lime-800 font-black underline m-4'>Stat Scores:</p>
						<div className='mb-6'>
							{statsBreakdown.map((score) => (
								<div
									key={score.user_id}
									className='text-lg'
								>
									<ScoreCard
										score={score}
										type={"stat"}
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
				</>
			)}
		</div>
	);
};
