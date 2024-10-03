import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";
import { ScoreView } from "../components/ScoreView";
import { WeekView } from "../components/WeekView";
import users from "../constants/users";
import { UserDropdown } from "../components/UserDropdown";
import baseUrl from "../constants/baseUrl";
import { PickView } from "../components/PickView";
// import stats from "../constants/stats";
// import superbowlStats from "../constants/superbowl-stats";

export default function Home({
	upcomingGames,
	totalGames,
	allTeams,
	totalPicks,
	totalStatPicks,
	baseUrl,
}) {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [allGames, setAllGames] = useState([]);
	const [allPicks, setAllPicks] = useState([]);
	const [allStatPicks, setAllStatPicks] = useState([]);
	const [view, setView] = useState("wager");
	const [picks, setPicks] = useState([]);
	const [statPicks, setStatPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	const [isStatSubmitted, setIsStatSubmitted] = useState([]);
	const [userState, setUserState] = useState(null);
	const [submissionMessage, setSubmissionMessage] = useState(null);
	const [totalScores, setTotalScores] = useState([]);
	const [formattedPicks, setFormattedPicks] = useState([]);
	const [formattedGames, setFormattedGames] = useState([]);

	const selectUser = (user) => {
		setUserState(user);
	};

	const logout = () => {
		setUserState(null);
		//temporarily added reload to deal with bug of picks array
		//not resetting properly on logout when switching to another
		//user. NEED better fix.
		location.reload();
	};

	const handleViewChange = (newView) => {
		setView(newView);
	};

	const setData = async () => {
		setGames(upcomingGames);
		setAllGames(totalGames);
		setTeams(allTeams);
		setAllPicks(totalPicks);
		setAllStatPicks(totalStatPicks);
		const userPicks = totalPicks.filter((pick) => {
			return pick.user_id === userState?.id;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setIsSubmitted(userPicks);
		}
		const userStatPicks = totalStatPicks.filter((pick) => {
			return pick.user_id === userState?.id;
		});
		if (userStatPicks.length) {
			setStatPicks(userStatPicks);
			setIsStatSubmitted(userStatPicks);
		}
	};

	useEffect(() => {
		if (userState) {
			setData();
		}
	}, [userState]);

	const clicked = async (id, gameId, week) => {
		const pick = {
			user_id: userState.id,
			chosen_team: id,
			game_id: gameId,
			week: week,
			type: "game",
		};

		const tempPicks = picks?.filter((pick) => pick.game_id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	// const statClicked = async (id, gameId, week) => {
	// 	const pick = {
	// 		user_id: userState.id,
	// 		chosen_team: id,
	// 		game_id: gameId,
	// 		// this comment is a reminder to refactor hardcoded week
	// 		week: 5,
	// 		type: "stat",
	// 	};

	// 	const tempStatPicks = statPicks?.filter((pick) => pick.game_id !== gameId);
	// 	setStatPicks([...tempStatPicks, pick]);
	// };

	const handleSubmit = async () => {
		let arrayOfSubmittedPicks = [];
		let arrayOfSubmittedStatPicks = [];

		const reviewPicks = (arrayOfPicks) => {
			let newPicks = [];
			let updatedPicks = [];
			let untouchedPicks = [];

			arrayOfPicks.forEach(function (submittedPick) {
				const pickInQuestion =
					submittedPick.type === "stat"
						? isStatSubmitted.find((pick) => pick.game_id === submittedPick.game_id)
						: isSubmitted.find((pick) => pick.game_id === submittedPick.game_id);

				if (pickInQuestion) {
					if (pickInQuestion.chosen_team === submittedPick.chosen_team) {
						untouchedPicks.push(submittedPick);
					} else {
						updatedPicks.push(submittedPick);
					}
				} else {
					newPicks.push(submittedPick);
				}
			});
			return { new: newPicks, updated: updatedPicks, untouched: untouchedPicks };
		};

		if (statPicks.length) {
			const reviewed = reviewPicks(statPicks);
			if (reviewed.new.length) {
				const postPicksRes = await fetch(`${baseUrl}/api/submit-stat-picks`, {
					method: "POST",
					body: JSON.stringify(reviewed.new),
				});
				// is it bad to reassign response to same variable? feels bad...
				// but having variable access issues if I tried to instantiate array
				// in statPicks.length if statement and set in this if...
				reviewed.new = await postPicksRes.json();
			}
			if (reviewed.updated.length) {
				const putPicksRes = await fetch(`${baseUrl}/api/submit-stat-picks`, {
					method: "PUT",
					body: JSON.stringify(reviewed.updated),
				});
				reviewed.updated = await putPicksRes.json();
			}
			arrayOfSubmittedStatPicks = [...reviewed.new, ...reviewed.updated, ...reviewed.untouched];
			setIsStatSubmitted(arrayOfSubmittedStatPicks);
		}

		if (picks.length) {
			const reviewed = reviewPicks(picks);
			if (reviewed.new.length) {
				const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
					method: "POST",
					body: JSON.stringify(reviewed.new),
				});
				reviewed.new = await postPicksRes.json();
			}
			if (reviewed.updated.length) {
				const putPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
					method: "PUT",
					body: JSON.stringify(reviewed.updated),
				});
				reviewed.updated = await putPicksRes.json();
			}
			arrayOfSubmittedPicks = [...reviewed.new, ...reviewed.updated, ...reviewed.untouched];
			setIsSubmitted(arrayOfSubmittedPicks);
		}
		const pickReview = errorHandling(picks, arrayOfSubmittedPicks);
		const statReview = errorHandling(statPicks, arrayOfSubmittedStatPicks);

		if (pickReview.length || statReview.length) {
			alertSetting("false");
		} else {
			alertSetting("true");
		}
	};

	const alertSetting = (results) => {
		setSubmissionMessage(results);
		setTimeout(function () {
			setSubmissionMessage(null);
		}, 3000);
	};

	const errorHandling = (cacheArray, databaseArray) => {
		const result = cacheArray.filter(function (obj) {
			return databaseArray.some(function (obj2) {
				return obj.game_id === obj2.game_id && obj.chosen_team !== obj2.chosen_team;
			});
		});
		return result;
	};

	////////////////////////////// sort and format games ////////////////////////////////

	const sortGames = () => {
		let extrudedGames = [];
		function checkWeek(game) {
			if (!extrudedGames.filter((e) => e.week === game.week).length) {
				let weekToPush = { week: game.week, games: [] };
				extrudedGames.push(weekToPush);
			}
		}
		allGames?.forEach(checkWeek);
		extrudedGames.sort((a, b) => parseInt(a.week) - parseInt(b.week));

		function loadWeek(extrudedGames) {
			for (let i = 1; i < extrudedGames.length + 1; i++) {
				let week = extrudedGames.find((e) => e.week === i);
				if (week?.week === undefined) {
					// is there a way to stop a specific "lap" of a loop and move on to next?
					// should I just leave this if statement blank to handle this case with no
					// action?
				} else {
					const gamesToPush = allGames?.filter((e) => e.week === week?.week);
					let index = i - 1;
					extrudedGames[index]?.games.push(gamesToPush);
				}
			}
		}
		loadWeek(extrudedGames);
		setFormattedGames(extrudedGames);
	};
	/////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
		sortGames();
	}, [allGames]);

	const weeksToMap = formattedGames.map(function (game) {
		return game.week;
	});

	//////////////////// score and format all user picks //////////////////////////

	const scoreAndFormatPicks = () => {
		// will be populated by the a forEach loop of users calling calculateScore()
		let restructuredPicks = [];
		let allTotalScores = [];
		function calculateScore(user) {
			const picksToScore = allPicks.filter((e) => e.user_id === user.id);
			// console.log(picksToScore);
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

				const scoresToPush = {
					// below used to only return user id if no week, but might not need anymore
					// ...(!week && { user_id: user.id }),
					// conditionally add the week key/value pair IF the week property is passed
					...(week && { week: week }),
					// had to add user_id to scores so I had a unique key for map in ScoreWeekView
					user_id: user.id,
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

	const weeksHighToLow = [...weeksToMap].sort((a, b) => b - a);

	///////////////////////////// end score and formatting ////////////////////////////////

	console.log(games);
	return (
		<>
			{!userState ? (
				<div>
					<UserDropdown
						users={users}
						selectUser={(user) => selectUser(user)}
						setUserState={setUserState}
					/>
				</div>
			) : view === "wager" ? (
				<div className='bg-football-super-close bg-cover'>
					<div className='bg-lime-800 flex flex-row justify-end p-1 sticky top-0'>
						<button
							className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
							onClick={() => handleViewChange("picks")}
						>
							My Picks
						</button>
						<button
							className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
							onClick={() => handleViewChange("score")}
						>
							Scores
						</button>
						{/* <button
							className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
							onClick={() => handleViewChange("week")}
						>
							This Week
						</button> */}
						<button
							className='bg-amber-900 hover:bg-amber-500 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
							onClick={() => logout()}
						>
							Logout
						</button>
					</div>
					<div className='bg-lime-300 bg-opacity-80 m-4 p-1 rounded'>
						<h1 className='text-3xl text-lime-800 font-bold m-2'>Welcome back {userState.name}!</h1>
						<p className='text-black m-2 ml-4'>
							Thanks for stopping by and submitting your picks for this week's games!
							<br />
							<br />
							Remember, click on the team you think will win the game. When you're happy with your
							picks, click submit! Once submitted, you can update your picks.
							<br />
							<br />
							We are running off the honor system here because I haven't written any date/time
							related code yet. Do the right thing and make sure you get your picks in BEFORE each
							game starts!
						</p>
					</div>

					<div className='bg-lime-700 bg-opacity-80 m-6 pt-1 mb-6 rounded-lg'>
						<p className='text-xl text-lime-300 font-bold ml-8 m-2 underline'>Game Winner:</p>
						{games.map((game) => (
							<div
								key={game.id}
								className='flex flex-row justify-around m-2 mx-6'
							>
								<TeamCard
									team={teams?.find((t) => t.id === game.away_id)}
									clicked={clicked}
									game={game}
									picks={picks}
								/>
								<div className='m-4 mt-6 p-1 font-black text-md text-white rounded'>vs.</div>
								<TeamCard
									team={teams?.find((t) => t.id === game.home_id)}
									clicked={clicked}
									game={game}
									picks={picks}
								/>
							</div>
						))}
						<div className='m-2 mr-8 ml-8 mb-4'>
							<div>
								<p className='text-lg text-white font-bold m-2'>WAIT! Are you {userState.name}?</p>
								<p className='text-sm text-lime-300 m-2'>
									If not, logout to go back to the menu and be sure to select the right user in the
									dropdown.
								</p>
							</div>
							{/* )} */}
						</div>
						{/* {isSubmitted.length ? (
							<button
								className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8 mb-8'
								type='submit'
								onClick={() => handleSubmit()}
							>
								Update
							</button>
						) : ( */}
						<button
							className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8 mb-8'
							type='submit'
							onClick={() => handleSubmit()}
						>
							Submit
						</button>
						{/* )} */}
						{submissionMessage === "true" ? (
							<div>
								<p className='text-lg text-lime-300 ml-10 mb-8 pb-8'>
									Picks have successfully been submitted!
								</p>
							</div>
						) : submissionMessage === "false" ? (
							<div>
								<p className='text-lg text-white font-bold ml-10 mb-8 pb-8'>
									Uh oh! Something went wrong...try submitting again.
								</p>
							</div>
						) : null}
					</div>
					{/* temp add to provide space at bottom of page */}
					<div className='mt-8'>.</div>
				</div>
			) : view === "score" ? (
				<div>
					<ScoreView
						allPicks={allPicks}
						allStatPicks={allStatPicks}
						user={userState}
						logout={() => logout()}
						handleViewChange={(newView) => handleViewChange(newView)}
						baseUrl={baseUrl}
						weeksToMap={weeksToMap}
						weeksHighToLow={weeksHighToLow}
						totalScores={totalScores}
						formattedPicks={formattedPicks}
						formattedGames={formattedGames}
						scoreAndFormatPicks={() => scoreAndFormatPicks()}
					/>
				</div>
			) : view === "week" ? (
				<WeekView
					allPicks={allPicks}
					allStatPicks={allStatPicks}
					upcomingGames={upcomingGames}
					user={userState}
					logout={() => logout()}
					handleViewChange={(newView) => handleViewChange(newView)}
					baseUrl={baseUrl}
				/>
			) : view === "picks" ? (
				<PickView
					logout={() => logout()}
					handleViewChange={(newView) => handleViewChange(newView)}
					weeksToMap={weeksToMap}
					weeksHighToLow={weeksHighToLow}
					teams={teams}
					totalScores={totalScores}
					isSubmitted={isSubmitted}
				/>
			) : null}
		</>
	);
}

export async function getServerSideProps() {
	try {
		////////////////// PRODUCTION: async/await method ///////////////////////////////
		const gamesRes = await fetch(`${baseUrl}/api/games?sent=true`);
		const upcomingGames = await gamesRes.json();

		const allGamesRes = await fetch(`${baseUrl}/api/games`);
		const theGames = await allGamesRes.json();

		const teamsRes = await fetch(`${baseUrl}/api/teams`);
		const theTeams = await teamsRes.json();

		const allPicksRes = await fetch(`${baseUrl}/api/picks`);
		const theAllPicks = await allPicksRes.json();

		const allStatPicksRes = await fetch(`${baseUrl}/api/stat-picks`);
		const theAllStatPicks = await allStatPicksRes.json();
		//////////////////////////////////////////////////////////////////////

		/////////////////// DEV: promise all method /////////////////////////////////////
		// const [gamesRes, teamsRes, allPicksRes, allStatPicksRes] = await Promise.all([
		// 	fetch(`${baseUrl}/api/games?sent=true`),
		// 	fetch(`${baseUrl}/api/teams`),
		// 	fetch(`${baseUrl}/api/picks`),
		// 	fetch(`${baseUrl}/api/stat-picks`),
		// ]);
		// const [upcomingGames, theTeams, theAllPicks, theAllStatPicks] = await Promise.all([
		// 	gamesRes.json(),
		// 	teamsRes.json(),
		// 	allPicksRes.json(),
		// 	allStatPicksRes.json(),
		// ]);
		///////////////////////////////////////////////////////////////////////////////////

		return {
			props: {
				upcomingGames: upcomingGames,
				totalGames: theGames,
				allTeams: theTeams,
				totalPicks: theAllPicks,
				totalStatPicks: theAllStatPicks,
				baseUrl: baseUrl,
			},
		};
	} catch (error) {
		console.log(error);
	}
}
