import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";
import { ScoreView } from "../components/ScoreView";
import users from "../constants/users";
import { UserDropdown } from "../components/UserDropdown";
import baseUrl from "../constants/baseUrl";
import { PickView } from "../components/PickView";
import stats from "../constants/stats";
import superbowlStats from "../constants/superbowl-stats";

export default function Home({ upcomingGames, allTeams, totalPicks, totalStatPicks, baseUrl }) {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [allPicks, setAllPicks] = useState([]);
	const [allStatPicks, setAllStatPicks] = useState([]);
	const [view, setView] = useState(true);
	const [picks, setPicks] = useState([]);
	const [statPicks, setStatPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	const [isStatSubmitted, setIsStatSubmitted] = useState([]);
	const [userState, setUserState] = useState(null);
	const [submissionMessage, setSubmissionMessage] = useState(null);

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

	const handleViewChange = () => {
		if (view === true) {
			setView(false);
		} else {
			setView(true);
		}
	};

	const remaingTeams = [{ id: "25" }, { id: "12" }];

	const setData = async () => {
		setGames(upcomingGames);
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

	const statClicked = async (id, gameId, week) => {
		const pick = {
			user_id: userState.id,
			chosen_team: id,
			game_id: gameId,
			// this comment is a reminder to refactor hardcoded week
			week: 5,
			type: "stat",
		};

		const tempStatPicks = statPicks?.filter((pick) => pick.game_id !== gameId);
		setStatPicks([...tempStatPicks, pick]);
	};

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
			) : view ? (
				<div className='bg-football-super-close bg-cover'>
					<div className='bg-lime-800 flex flex-row justify-end p-1 sticky top-0'>
						<button
							className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
							onClick={() => handleViewChange()}
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
						{/* section below is for regular stats, not superbowlStats */}
						{/* <div>
							<p className='text-xl text-lime-300 font-bold ml-8 m-2 underline'>Stat Picks:</p>
							{stats.map((stat) => (
								<div
									key={stat.id}
									className='flex flex-col justify-around m-2'
								>
									<p className='text-lg text-lime-300 font-bold ml-8 m-2'>{stat.name}</p>
									<div className='flex flex-col justify-center items-center m-2 mx-12'>
										{remaingTeams.map((team) => (
											<TeamCard
												key={team.id}
												team={teams?.find((t) => t.id === team.id)}
												clicked={statClicked}
												game={stat}
												picks={statPicks}
											/>
										))}
									</div>
								</div>
							))}
						</div> */}
						{/* <div>
							<p className='text-xl text-lime-300 font-bold ml-8 m-2 underline'>Stat Picks:</p>
							{superbowlStats.map((stat) => (
								<div
									key={stat.id}
									className='flex flex-col justify-around m-2'
								>
									<p className='text-lg text-lime-300 font-bold ml-8 m-2'>{stat.name}</p>
									<div className='flex flex-col justify-center items-center m-2 mx-12'>
										{remaingTeams.map((team) => (
											<TeamCard
												key={team.id}
												team={teams?.find((t) => t.id === team.id)}
												clicked={statClicked}
												game={stat}
												picks={statPicks}
											/>
										))}
									</div>
								</div>
							))}
						</div> */}
						<div className='m-2 mr-8 ml-8 mb-4'>
							{/* {userState.id === 10 ? (
								<div>
									<p className='text-lg text-white font-bold m-2'>
										WAIT! <span classname='underline'>HOW</span> are you {userState.name}?
									</p>
									<p className='text-sm text-white m-2'>
										It's been about two weeks since we last saw you and those voluptuous
										hands...Here's hoping this week's picks are better than your last ones!
									</p>
								</div>
							) : ( */}
							<div>
								<p className='text-lg text-white font-bold m-2'>WAIT! Are you {userState.name}?</p>
								<p className='text-sm text-lime-300 m-2'>
									If not, logout to go back to the menu and be sure to select the right user in the
									dropdown.
								</p>
							</div>
							{/* )} */}
						</div>
						{isSubmitted.length ? (
							<button
								className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8 mb-8'
								type='submit'
								onClick={() => handleSubmit()}
							>
								Update
							</button>
						) : (
							<button
								className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8 mb-8'
								type='submit'
								onClick={() => handleSubmit()}
							>
								Submit
							</button>
						)}
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
					<div>
						<PickView
							userPicks={isSubmitted}
							userStatPicks={isStatSubmitted}
							user={userState}
							teams={teams}
						/>
					</div>
					{/* temp add to provide space at bottom of page */}
					<div className='mt-8'>.</div>
				</div>
			) : (
				<div>
					<ScoreView
						allPicks={allPicks}
						allStatPicks={allStatPicks}
						user={userState}
						logout={() => logout()}
						handleViewChange={() => handleViewChange()}
						baseUrl={baseUrl}
					/>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps() {
	try {
		////////////////// PRODUCTION: async/await method ///////////////////////////////
		const gamesRes = await fetch(`${baseUrl}/api/games?sent=true`);
		const upcomingGames = await gamesRes.json();

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
