import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";
import { ScoreView } from "../components/ScoreView";
import users from "../constants/users";
import { UserDropdown } from "../components/UserDropdown";
// IMPORTANT TO REMEMBER
// you have to import baseUrl, then go down to gssp and return from gssp as a prop
// then you have to read it on the client side, in your component, as a prop, NOT directly from this import
// if you read it directly from this import, it will work on local, but it will break on vercel
// because, on vercel, the baseUrl is an environment variable and so it can't be read by the client side
// directly without being first passed through a server side function
import baseUrl from "../constants/baseUrl";
import { PickView } from "../components/PickView";
import stats from "../constants/stats";
import superbowlStats from "../constants/superbowl-stats";

export default function Home({ upcomingGames, allTeams, baseUrl }) {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [allPicks, setAllPicks] = useState([]);
	const [allStatPicks, setAllStatPicks] = useState([]);
	const [view, setView] = useState(true);
	const [picks, setPicks] = useState([]);
	const [statPicks, setStatPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	const [isStatSubmitted, setIsStatSubmitted] = useState([]);
	// needed to set to null for initial load
	const [userState, setUserState] = useState(null);
	const [submissionMessage, setSubmissionMessage] = useState(null);

	const selectUser = (user) => {
		setUserState(user);
	};

	const logout = () => {
		setUserState(null);
	};

	const handleViewChange = () => {
		if (view === true) {
			setView(false);
		} else {
			setView(true);
		}
	};

	const remaingTeams = [{ id: "25" }, { id: "12" }];

	///////////////////////////// PROD: Async/Await Option of fetch /////////////////////////////////////
	// const getData = async () => {
	// 	const gamesRes = await fetch(`${baseUrl}/api/games?sent=true`);
	// 	const upcomingGames = await gamesRes.json();
	// 	setGames(upcomingGames);
	// 	const teamsRes = await fetch(`${baseUrl}/api/teams`);
	// 	const theTeams = await teamsRes.json();
	// 	setTeams(theTeams);
	// 	const allPicksRes = await fetch(`${baseUrl}/api/picks`);
	// 	const theAllPicks = await allPicksRes.json();
	// 	setAllPicks(theAllPicks);
	// 	const allStatPicksRes = await fetch(`${baseUrl}/api/stat-picks`);
	// 	const theAllStatPicks = await allStatPicksRes.json();
	// 	setAllStatPicks(theAllStatPicks);

	// 	const userPicks = theAllPicks.filter((pick) => {
	// 		return pick.user_id === userState?.id;
	// 	});
	// 	if (userPicks.length) {
	// 		setPicks(userPicks);
	// 		setIsSubmitted(userPicks);
	// 	}
	// 	const userStatPicks = theAllStatPicks.filter((pick) => {
	// 		return pick.user_id === userState?.id;
	// 	});
	// 	if (userStatPicks.length) {
	// 		setStatPicks(userStatPicks);
	// 		setIsStatSubmitted(userStatPicks);
	// 	}
	// };

	////////////////////////////// DEV: Promise.all Option of fetch //////////////////////////////////
	const getData = async () => {
		try {
			const [gamesRes, teamsRes, allPicksRes, allStatPicksRes] = await Promise.all([
				fetch(`${baseUrl}/api/games?sent=true`),
				fetch(`${baseUrl}/api/teams`),
				fetch(`${baseUrl}/api/picks`),
				fetch(`${baseUrl}/api/stat-picks`),
			]);
			const [upcomingGames, theTeams, theAllPicks, theAllStatPicks] = await Promise.all([
				gamesRes.json(),
				teamsRes.json(),
				allPicksRes.json(),
				allStatPicksRes.json(),
			]);
			setGames(upcomingGames);
			setTeams(theTeams);
			setAllPicks(theAllPicks);
			setStatPicks(theAllStatPicks);
			const userPicks = theAllPicks.filter((pick) => {
				return pick.user_id === userState?.id;
			});
			if (userPicks.length) {
				setPicks(userPicks);
				setIsSubmitted(userPicks);
				console.log(userPicks);
			}
			const userStatPicks = theAllStatPicks.filter((pick) => {
				return pick.user_id === userState?.id;
			});
			if (userStatPicks.length) {
				setStatPicks(userStatPicks);
				setIsStatSubmitted(userStatPicks);
			}
		} catch (error) {
			console.log(error);
		}
	};

	/////////////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////// STILL NEED TO DO ///////////////////////////////
	// once that works both on local _and_ on vercel in production, move these calls into the gssp
	// you can have both async await and promise.all in the gssp. its very much the same as up here
	// theres some examples down there already
	/////////////////////////////////////////////////////////////////////

	useEffect(() => {
		if (userState) {
			getData();
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
			// this key allows me to hard code the week for now
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
			arrayOfSubmittedStatPicks = [
				...reviewed.new,
				...reviewed.updated,
				...reviewed.untouched,
				//adding extra object with wrong chosen_team for testing
				// {
				// 	user_id: 3,
				// 	chosen_team: "2",
				// 	// passes if you make new game_id
				// 	game_id: "9101-99",
				// 	week: 5,
				// 	winner: null,
				// 	type: "stat",
				// },
			];
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
			arrayOfSubmittedPicks = [
				...reviewed.new,
				...reviewed.updated,
				...reviewed.untouched,
				//for testing
				//adding additional object to array that has diff chosen_team
				// {
				// 	user_id: 3,
				// 	chosen_team: "8",
				// 	// passes if you make new game_id by adding -99 to end of string
				// 	game_id: "401547378",
				// 	week: 5,
				// 	type: "game",
				// },
			];
			setIsSubmitted(arrayOfSubmittedPicks);
		}
		console.log(arrayOfSubmittedPicks);
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
		// checking that response from database matches picks entered locally
		// but only works one way!
		// if an additional pick is added to arrayOfSubmittedPicks error is
		// caught, but if arrayOfSubmittedPicks doesn't include
		// (like if you comment out ...reviewed.untouched) error is NOT caught
		console.log("picks", cacheArray);
		console.log("db", databaseArray);
		const result = cacheArray.filter(function (obj) {
			return databaseArray.some(function (obj2) {
				return obj.game_id === obj2.game_id && obj.chosen_team !== obj2.chosen_team;
			});
		});
		console.log(result);
		return result;
	};

	return (
		<>
			{!userState ? (
				<div>
					<UserDropdown
						users={users}
						// handleUserChange={() => handleUserChange()}
						// need to pass the user to selectUser otherwise it just retuns
						// undefined when function is called.
						selectUser={(user) => selectUser(user)}
						setUserState={setUserState}
					/>
				</div>
			) : view ? (
				<div className='bg-football-super-close bg-cover'>
					{/*ultimately turn this into a true Navbar */}
					<div className='bg-lime-800 flex flex-row justify-end p-1 sticky top-0'>
						<button
							className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
							onClick={() => errorHandling(picks, isSubmitted)}
						>
							TEST COMPARE
						</button>
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
						<h1 className='text-3xl text-lime-800 font-bold m-2'>Welcome {userState.name}!</h1>
						<p className='text-black m-2 ml-4'>
							It's the Super Bowl baby!!
							<br />
							<br />
							Lots of stat categories for this week so it is still anyone's game.
							<br />
							<br />
							Remember, click on the team you think will win the game/stat category. When you're
							happy with your picks, click submit!
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
						<div>
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
						</div>
						<div className='m-2 mr-8 ml-8 mb-4'>
							{userState.id === 10 ? (
								<div>
									<p className='text-lg text-white font-bold m-2'>
										WAIT! <span classname='underline'>HOW</span> are you {userState.name}?
									</p>
									<p className='text-sm text-white m-2'>
										It's been about two weeks since we last saw you and those voluptuous
										hands...Here's hoping this week's picks are better than your last ones!
									</p>
								</div>
							) : (
								<div>
									<p className='text-lg text-white font-bold m-2'>
										WAIT! Are you {userState.name}?
									</p>
									<p className='text-sm text-lime-300 m-2'>
										If not, logout to go back to the menu and be sure to select the right user in
										the dropdown.
									</p>
								</div>
							)}
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

// look up "getServerSideProps next docs" to learn more about this function if you want
export async function getServerSideProps() {
	try {
		// moved the fetches for these two pieces of data down here
		// now when you hit the page it grabs this data before even trying to load the UI
		// so by the time react does anything and tries to render the component, it already has games and teams
		// being passed in as props

		// games fetch WITH query param
		// const gamesResults = await fetch(`${baseUrl}/api/games?sent=true`);
		// if (!gamesResults.ok) {
		// 	const errObj = await gamesResults.json()
		// 	// console.log(errObj)
		//   }
		// const upcomingGames = await gamesResults.json();

		// const teamsResults = await fetch(`${baseUrl}/api/teams`);
		// if (!teamsResults.ok) {
		// 	const errObj = await teamsResults.json()
		// 	// console.log(errObj)
		//   }
		// const teams = await teamsResults.json();

		// console.log(baseUrl);

		return {
			props: {
				// upcomingGames: upcomingGames,
				// allTeams: teams,
				baseUrl: baseUrl,
			},
		};
	} catch (error) {
		// console.log(error);
	}
}
