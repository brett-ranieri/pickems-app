import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";
import { ScoreView } from "../components/ScoreView";
// import Link from "next/link";

const MainViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [view, setView] = useState("game");
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
		let value = parseInt(e.target.value);
		console.log(value);
		console.log(users);
		let selectedUser = users.filter((user) => user.id === value);
		console.log(selectedUser);
		setUser(selectedUser);
	};

	const handleViewChange = () => {
		if (view === "game") {
			setView("score");
		} else if (view === "score") {
			setView("game");
		}
	};

	const getGames = async () => {
		const results = await fetch(`http://localhost:3000/api/games?sent=true`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	console.log(games);

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	const getPicks = async (user) => {
		console.log("user", user);
		const results = await fetch(`http://localhost:3000/api/picks`);
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
		let selected = user[0];
		// undefined error would happen on initial load until adding conditional ?
		getPicks(selected?.id);
	}, [user]);

	const clicked = async (id, gameId) => {
		const pick = {
			user_id: user,
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
				console.log("checking...", pick.game_id);
				const submissionCheck = isSubmitted.some((obj) => obj.game_id === pick.game_id);
				// originally used .includes but all cases were returning false
				// switching to .some and declaring simple arrow func did the trick!
				console.log(submissionCheck);
				if (!submissionCheck) {
					console.log(pick);
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
			const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
				method: "POST",
				body: JSON.stringify(picks),
			});
			if (postPicksRes) {
				console.log("something happened");
				// moved into this if statement to ensure that post was successful
				// before setting picks to isSubmitted...did I do that right?
				// I DID NOT!
				setIsSubmitted(picks);
			}
		}
	};

	return (
		<>
			<p className='text-3xl font-bold mb-4'>This is the game view page</p>
			<select onChange={handleUserChange}>
				<option value='Select a User'> -- Select a User -- </option>
				{users.map((user) => (
					<option value={user.id}>{user.name}</option>
				))}
			</select>

			{/* <Link
				href='/score_view'
				passHref
			> */}
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
				onClick={() => handleViewChange()}
			>
				Check the scores!
			</button>
			{/* </Link> */}

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
			<ScoreView
				user={user}
				handleViewChange={() => handleViewChange()}
			/>
		</>
	);
};

export default MainViewPage;
