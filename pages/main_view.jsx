import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";
import { ScoreView } from "../components/ScoreView";

const MainViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [view, setView] = useState(true);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);
	const [user, setUser] = useState({});

	// test Users table
	const users = [
		{ id: 1, name: "Allison" },
		{ id: 2, name: "Brett" },
		{ id: 3, name: "Maurice" },
		{ id: 4, name: "Biers" },
		{ id: 5, name: "Benny" },
		{ id: 6, name: "Flo" },
		{ id: 7, name: "Ferdinand" },
		{ id: 8, name: "Taylor" },
		{ id: 9, name: "Travis" },
		{ id: 10, name: "Donna" },
	];

	const handleUserChange = (e) => {
		const value = parseInt(e.target.value);
		const selectedUser = users.filter((user) => user.id === value);
		setUser(selectedUser);
	};

	const handleViewChange = () => {
		if (view === true) {
			setView(false);
		} else {
			setView(true);
		}
	};
	// games fetch WITH query param
	const getGames = async () => {
		const results = await fetch(`https://pickems-app-brett-ranieri.vercel.app/api/games?sent=true`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`https://pickems-app-brett-ranieri.vercel.app/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	const getPicks = async (user) => {
		const results = await fetch(`https://pickems-app-brett-ranieri.vercel.app/api/picks`);
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

	useEffect(() => {
		getTeams();
		getGames();
	}, []);

	// add useEffect listening to user to update whenever dropdown changed
	useEffect(() => {
		// do you know why I needed to declare a variable here to access user by index?
		const selected = user[0];
		// undefined error would happen on initial load until adding optional chaining
		getPicks(selected?.id);
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
					<p className='text-3xl font-bold mb-4'>This is the game view page</p>
					<select onChange={handleUserChange}>
						<option value='Select a User'> -- Select a User -- </option>
						{users.map((user) => (
							<option value={user.id}>{user.name}</option>
						))}
					</select>

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
};

export default MainViewPage;
