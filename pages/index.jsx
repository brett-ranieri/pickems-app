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
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState(null);

	console.log(baseUrl);

	const selectUser = (user) => {
		setUser(user);
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

	const getGames = async () => {
		const results = await fetch(`${baseUrl}/api/games?sent=true`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`${baseUrl}/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	const getAllPicks = async () => {
		const results = await fetch(`${baseUrl}/api/picks`);
		const allPicks = await results.json();
		setAllPicks(allPicks);
	};

	const getAllStatPicks = async () => {
		const results = await fetch(`${baseUrl}/api/stat-picks`);
		const allPicks = await results.json();
		setAllStatPicks(allPicks);
	};

	const getPicks = async (userId) => {
		// is it necessary to have another fetch here? feels like I should be fetching from
		// getAllPicks and then use that for this function...
		const results = await fetch(`${baseUrl}/api/picks`);
		const prevPicks = await results.json();
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === userId;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setIsSubmitted(userPicks);
		} else {
			setPicks([]);
			setIsSubmitted([]);
		}
	};

	const getStatPicks = async (userId) => {
		// wanted to do this with conditional but wasn't sure how to handle that with the join
		// in the picks endpoint. made additional endpoint for fast deployment and then need to
		// come back and re-factor
		const results = await fetch(`${baseUrl}/api/stat-picks`);
		const prevPicks = await results.json();
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === userId;
		});
		if (userPicks.length) {
			setStatPicks(userPicks);
			setIsStatSubmitted(userPicks);
		} else {
			setStatPicks([]);
			setIsStatSubmitted([]);
		}
	};

	// 6th
	// these two useeffects are a problem for a number of reasons
	// on page load, you're kicking off 4 simultaneous network calls that are not awaiting each other and are not contained in a promise
	// your db cant handle that. we had to do both because something was unhappy with one of them and something was unhappy with the other
	// i dont remember the specifics but it was like a dumb vercel thing or something
	// you should write both. for async/await everything you have in all the network calls above needs to move into one function
	// and be under one async and happen consecutively, like call an endpoint, read its response, set that to state, then call the next one
	// for promise.all...here's my code for this
	// https://github.com/brett-ranieri/pickems-app/blob/6f7fdf0d0dfdf5fe53b59d2c6f949c7898da3749/pages/index.jsx#L92
	// make one of these work to fetch initial data, up here. one function, called by the useeffect (or useeffects). try to get all the network calls into one function
	// and conditionally call the fetches you need for user
	// DONT MAKE UNNECESSARY NETWORK CALLS BE CAREFUL

	// once that works both on local _and_ on vercel in production, move these calls into the gssp
	// you can have both async await and promise.all in the gssp. its very much the same as up here
	// theres some examples down there already
	useEffect(() => {
		getTeams();
		getGames();
		getAllPicks();
		getAllStatPicks();
	}, []);

	useEffect(() => {
		if (user) {
			getPicks(user.id);
			getStatPicks(user.id);
		}
	}, [user]);

	const clicked = async (id, gameId, week) => {
		const pick = {
			user_id: userState.id,
			chosen_team: id,
			game_id: gameId,
			week: week,
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
		};

		const tempStatPicks = statPicks?.filter((pick) => pick.game_id !== gameId);
		setStatPicks([...tempStatPicks, pick]);
	};

	const handleSubmit = async () => {
		//if statement to handle statPicks
		if (statPicks.length) {
			if (isStatSubmitted.length) {
				const comparePicks = async (pick) => {
					// 4th
					// now you're passing this `picks`, instead of `pick`, so change your variable name
					// loop over picks, for each pick run your isStatSubmitted code - that function is good
					// you have another function, checkForGame, that asks the question "is this pick new?"
					// this function, comparePicks, asks the question "is this pick an update?"
					// at the moment, you call both functions on each pick...after you stop doing network calls in a loop youll be calling each func for the full array of picks
					// you need to refactor both of the functions into one function that sorts the picks into three arrays, "picks to update", "new picks", and "else" (picks that are neither)
					// you need the "else" here so you can recombine that array with the responses from your endpoints at the end of this function
					// so you can display all picks on the page not just the ones that were updated
					// instantiate another couple of arrays for those categories, go get the code from checkForGame and do a nice if/if else/else
					// now that you've done that, updatedPicks has been populated with however many picks need to be sent to the db
					// your put method is also good, because updatedPicks is now an array of picks, but you've already updated your
					// put method in the endpoint to handle an array
					// bring the `post` method up here and do like a `if updatedPicks.length run this put` type of logic for both your "picks to update" and "new picks" arrays

					let updatedPicks = [];
					isStatSubmitted.forEach(function (submittedPick) {
						if (pick.game_id === submittedPick.game_id) {
							if (pick.chosen_team !== submittedPick.chosen_team) {
								console.log("different");
								updatedPicks.push(pick);
							}
						}
					});
					if (updatedPicks.length) {
						const postPicksRes = await fetch(`${baseUrl}/api/submit-stat-picks`, {
							method: "PUT",
							body: JSON.stringify(updatedPicks),
						});
						if (postPicksRes) {
							// 5th
							// now you need to actually get the responses that your put and post are sending and use them
							// read the response like: const putResponse = await postPicksRes.json()
							// console log putResponse and make sure it is what you're expecting (an array of the picks that were updated)
							// THEN, you need to spread the responses from both calls, plus the other picks that weren't sent to the db into an array
							// and set that array to state
							// DO NOT CALL getAllStatPicks here. we're gonna refactor that into a page load function anyway. or gssp. tbd.
							setIsStatSubmitted(statPicks);
							getAllStatPicks();
						}
					}
				};

				const checkForGame = async (pick) => {
					// leaving comments below in because I can't see where we talked about
					// this in last code review:

					// needed to POST data returned from this checkForGame, not PUT,
					// so i seperated function from comparePicks to allow for different fetch methods
					//
					// are some variables, like declaring updatedPicks in both functions
					// a bit redundant?
					// kept them seperate because each function needs to run independantly
					// of the other, but both need to be populated simultaneously AND if the
					// results of either function were sent to the wrong fetch it would
					// mess up the data...
					//
					// you mentioned an insert/update query though...is this a use case
					// for something like that?
					let updatedPicks = [];
					const submissionCheck = isStatSubmitted.some((obj) => obj.game_id === pick.game_id);
					if (!submissionCheck) {
						updatedPicks.push(pick);
					}
					if (updatedPicks.length) {
						const postPicksRes = await fetch(`${baseUrl}/api/submit-stat-picks`, {
							method: "POST",
							body: JSON.stringify(updatedPicks),
						});
						if (postPicksRes) {
							setIsStatSubmitted(statPicks);
							getAllStatPicks();
						}
					}

					// START OF WHAT ALLISON CHANGED
					// console.log("🍇 271, POST of some kind");
					// setIsStatSubmitted(statPicks);

					// console.log("OTHER PICKS HERE!!!!", otherPicks);
					// console.log("🍓 NEW STAT PICKS", allStatPicks, theNewStatPicks, thePutStatPicks);
					// setStatPicks([...otherPicks, ...theNewStatPicks, ...thePutStatPicks]);
					// filtered all stat picks to not include the user's picks spread with the user's stat picks
					// result is one less network call
					// const combinedStatPicks = [
					// 	...allStatPicks.filter((x) => x.user_id !== userState.id),
					// 	...otherPicks,
					// 	...theNewStatPicks,
					// 	...thePutStatPicks,
					// ];
					// setAllStatPicks(combinedStatPicks);
					// END OF WHAT ALLISON CHANGED
				};

				// 3rd
				// any function that you're calling in a foreach or a for of or any loop
				// where the function contains a network call, NEEDS TO GO AWAY
				// all functions that contain a network call that are currently being called in a loop need to be passed the full data set,
				// meaning the array, and handle that, NOT BY looping over the array inside the function and making network calls in that loop
				// no network calls in any loops.

				// so that means here, you need to call comparePicks(picks), and same thing for checkForGame, and the two other functions
				// there's 4 functions that need basically the same refactor, and they need to become 2 functions in this pass,
				// and ultimately 1 function if you really want to dry it up. when i stopped touching things i had left 2 functions but
				// thats just because i was over it, i wouldve refactored it into one function if it was my code. you should leave it as 2 for now
				// and do the rest of this work then come back to it.
				// im going to put notes in comparePicks.
				statPicks.forEach(comparePicks);
				statPicks.forEach(checkForGame);
			} else {
				const postPicksRes = await fetch(`${baseUrl}/api/submit-stat-picks`, {
					method: "POST",
					body: JSON.stringify(statPicks),
				});
				if (postPicksRes) {
					setIsStatSubmitted(statPicks);
					const theStatPicks = await postPicksRes.json();
					console.log("🍓 ALL STAT PICKS", allStatPicks, theStatPicks);
					setStatPicks(theStatPicks);
					// filtered all stat picks to not include the user's picks spread with the user's stat picks
					// result is one less network call
					const combinedStatPicks = [
						...allStatPicks.filter((x) => x.user_id !== userState.id),
						...theStatPicks,
					];
					setAllStatPicks(combinedStatPicks);
					// END OF WHAT ALLISON CHANGED
					// getAllStatPicks();
				}
			}
		}

		// handling picks from here down
		if (isSubmitted.length) {
			const comparePicks = async (pick) => {
				let updatedPicks = [];
				isSubmitted.forEach(function (submittedPick) {
					if (pick.game_id === submittedPick.game_id) {
						if (pick.chosen_team !== submittedPick.chosen_team) {
							updatedPicks.push(pick);
						}
					}
				});
				if (updatedPicks.length) {
					const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
						method: "PUT",
						body: JSON.stringify(updatedPicks),
					});
					if (postPicksRes) {
						setIsSubmitted(picks);
						const updatedAllPicks = [
							...allPicks.filter((x) => x.user_id !== userState.id),
							...picks,
						];
						setAllPicks(updatedAllPicks);
					}
				}
			};

			const checkForGame = async (pick) => {
				let updatedPicks = [];

				const submissionCheck = isSubmitted.some((obj) => obj.game_id === pick.game_id);
				if (!submissionCheck) {
					updatedPicks.push(pick);
				}
				if (updatedPicks.length) {
					const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
						method: "POST",
						body: JSON.stringify(updatedPicks),
					});
					if (postPicksRes) {
						setIsSubmitted(picks);
						const updatedAllPicks = [
							...allPicks.filter((x) => x.user_id !== userState.id),
							...picks,
						];
						setAllPicks(updatedAllPicks);
					}
				}
			};

			picks.forEach(comparePicks);
			picks.forEach(checkForGame);
		} else {
			const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
				method: "POST",
				body: JSON.stringify(picks),
			});
			if (postPicksRes) {
				setIsSubmitted(picks);
				const updatedAllPicks = [...allPicks.filter((x) => x.user_id !== userState.id), ...picks];
				setAllPicks(updatedAllPicks);
			}
		}
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
								className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8'
								type='submit'
								onClick={() => handleSubmit()}
							>
								Submit
							</button>
						) : (
							<button
								className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded mb-2 ml-8'
								type='submit'
								onClick={() => handleSubmit()}
							>
								Submit
							</button>
						)}
						<p className='text-sm text-lime-300 ml-10 mb-8 mt-2 pb-8'>
							* If successfully submitted, picks will appear below in the "Pick History" section.
						</p>
					</div>
					<div>
						<PickView
							allPicks={allPicks}
							allStatPicks={allStatPicks}
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
