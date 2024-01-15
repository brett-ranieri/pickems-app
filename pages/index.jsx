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

export default function Home({ upcomingGames, allTeams, baseUrl }) {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [view, setView] = useState(true);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	// needed to set to null for initial load
	const [user, setUser] = useState(null);

	console.log("logging out of the client", baseUrl);

	const selectUser = (user) => {
		console.log("in main", user);
		setUser(user);
	};

	const logout = () => {
		setUser(null);
	};

	const handleViewChange = () => {
		if (view === true) {
			setView(false);
		} else {
			setView(true);
		}
	};

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

	const getPicks = async (userId) => {
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

	useEffect(() => {
		getTeams();
		getGames();
	}, []);

	// add useEffect listening to user to update whenever dropdown changed
	useEffect(() => {
		console.log(user);
		if (user) {
			getPicks(user.id);
		}
	}, [user]);

	console.log(games);

	const clicked = async (id, gameId) => {
		const pick = {
			//needed to add an index here to be able to access object
			//do you know why this is happening here and why it happens
			//when calling selectedUser in UserDropdown?
			user_id: user[0].id,
			chosen_team: id,
			game_id: gameId,
		};
		const tempPicks = picks?.filter((pick) => pick.game_id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	const handleSubmit = async () => {
		if (isSubmitted.length) {
			console.log("picks already made");

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
					// this is NOT working as anticipated
					if (postPicksRes) {
						console.log("something else happened");
						setIsSubmitted(picks);
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
				// console.log("checking...", pick.game_id);
				const submissionCheck = isSubmitted.some((obj) => obj.game_id === pick.game_id);
				// console.log(submissionCheck);
				if (!submissionCheck) {
					// console.log(pick);
					updatedPicks.push(pick);
				}
				if (updatedPicks.length) {
					const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
						method: "POST",
						body: JSON.stringify(updatedPicks),
					});
					// this is NOT working as anticipated
					if (postPicksRes) {
						console.log("more somethings happened");
						setIsSubmitted(picks);
					}
				}
			};

			picks.forEach(comparePicks);
			picks.forEach(checkForGame);
			console.log("IS: ", isSubmitted);
		} else {
			console.log("no picks yet");
			console.log(picks);
			const postPicksRes = await fetch(`${baseUrl}/api/submit-picks`, {
				method: "POST",
				body: JSON.stringify(picks),
			});
			if (postPicksRes) {
				console.log("something happened");
				// feels like more can be done here to ensure confirmation of successful
				// pikc submission

				// moved into this if statement to ensure that post was successful
				// before setting picks to isSubmitted...did I do that right?
				// I DID NOT!
				setIsSubmitted(picks);
			}
		}
	};

	return (
		<>
			{!user ? (
				<div>
					<UserDropdown
						users={users}
						handleUserChange={() => handleUserChange()}
						// need to pass the user to selectUser otherwise it just retuns
						// undefined when function is called.
						selectUser={(user) => selectUser(user)}
					/>
				</div>
			) : view ? (
				<div>
					<h1>Welcome {user.name}!</h1>
					<p className='text-3xl font-bold mb-4'>
						This is the game view page. Here you can submit your picks for the upcoming week!
					</p>

					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
						onClick={() => handleViewChange()}
					>
						Check the scores!
					</button>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
						onClick={() => logout()}
					>
						Logout
					</button>

					{games.map((game) => (
						<div
							key={game.id}
							className='flex flex-row justify-around mb-6'
						>
							<TeamCard
								team={teams?.find((t) => t.id === game.home_id)}
								clicked={clicked}
								game={game}
								picks={picks}
							/>
							<div className='mt-4'>vs.</div>
							<TeamCard
								team={teams?.find((t) => t.id === game.away_id)}
								clicked={clicked}
								game={game}
								picks={picks}
							/>
						</div>
					))}
					{isSubmitted.length ? (
						<button
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
							type='submit'
							onClick={() => handleSubmit()}
						>
							Update
						</button>
					) : (
						<button
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
							type='submit'
							onClick={() => handleSubmit()}
						>
							Submit
						</button>
					)}
				</div>
			) : (
				<div>
					<ScoreView
						user={user}
						handleViewChange={() => handleViewChange()}
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
		// 	console.log(errObj)
		//   }
		// const upcomingGames = await gamesResults.json();

		// const teamsResults = await fetch(`${baseUrl}/api/teams`);
		// if (!teamsResults.ok) {
		// 	const errObj = await teamsResults.json()
		// 	console.log(errObj)
		//   }
		// const teams = await teamsResults.json();

		console.log(baseUrl);

		return {
			props: {
				// upcomingGames: upcomingGames,
				// allTeams: teams,
				baseUrl: baseUrl,
			},
		};
	} catch (error) {
		console.log(error);
	}
}
