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

export default function Home({upcomingGames, allTeams, baseUrl}) {
	const [teams, setTeams] = useState(allTeams);
	const [games, setGames] = useState(upcomingGames);
	const [view, setView] = useState(true);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	const [user, setUser] = useState({});

	console.log(baseUrl)

	const selectUser = (user) => {
		setUser(user);
	};

	const handleViewChange = () => {
		if (view === true) {
			setView(false);
		} else {
			setView(true);
		}
	};

	const getPicks = async (user) => {
		const results = await fetch(`${baseUrl}/api/picks`);
		const prevPicks = await results.json();
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === user;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setIsSubmitted(userPicks);
		} else {
			setPicks([]);
			setIsSubmitted([]);
		}
	};

	// add useEffect listening to user to update whenever dropdown changed
	useEffect(() => {
		console.log(user);
		// do you know why I needed to declare a variable here to access user by index?
		// const selected = user[0];
		// undefined error would happen on initial load until adding optional chaining
		getPicks(user);
	}, [user]);

	const clicked = async (id, gameId) => {
		const pick = {
			//needed to add an index here to be able to access object
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
					const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
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
				// this in last code review

				// ALSO: quick googling of 'too many connections' error brought me to:
				// https://www.reddit.com/r/SQL/comments/608kbj/postgresql_too_many_connections/
				// talks about creating a new connection for every row inserted being a problem
				// possibly all connected??
				// not seeing how, because connection will fail at times where picks are not being submitted
				// before call logs (games.js)
				// got got logs (teams.js)
				// then too many connections error throws...so not convinced this reddit post
				// is definitively what is causing my issue

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
					const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
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
			const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
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
			{view ? (
				<div>
					<div>
						<UserDropdown
							users={users}
							handleUserChange={() => handleUserChange()}
							selectUser={() => selectUser()}
						/>
					</div>
					<p className='text-3xl font-bold mb-4'>This is the game view page</p>

					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
						onClick={() => handleViewChange()}
					>
						Check the scores!
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
		const gamesResults = await fetch(`${baseUrl}/api/games?sent=true`);
		if (!gamesResults.ok) {
			const errObj = await gamesResults.json()
			console.log(errObj)
		  }
		const upcomingGames = await gamesResults.json();
	

		const teamsResults = await fetch(`${baseUrl}/api/teams`);
		if (!teamsResults.ok) {
			const errObj = await teamsResults.json()
			console.log(errObj)
		  }
		const teams = await teamsResults.json();	

		console.log(baseUrl)

		return {
			props: {
				upcomingGames: upcomingGames,
				allTeams: teams,
				baseUrl: baseUrl
			}
		}
	} catch (error) {
		console.log(error)
	}
}