import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";

const ScoreViewPage = () => {
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	// switched to null instead of () thinking it might
	// help with undefined name issue...it did not
	const [user, setUser] = useState(null);
	const [allPicks, setAllPicks] = useState([]);
	let allScores = [];

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

	const getGames = async () => {
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};
	// api call now just populates an array of all picks
	const getAllPicks = async () => {
		const results = await fetch(`http://localhost:3000/api/picks`);
		const allPicks = await results.json();
		setAllPicks(allPicks);
	};

	const setUserInfo = async () => {
		console.log("called");
		// can manually change userId here
		const userId = 1;
		const activeUser = users.filter((user) => {
			return user.id === userId;
		});
		console.log(activeUser);
		setUser(activeUser);

		// needed to add fetch below to fix an undefined issue...but doesnt feel right
		// there has to be a way to use the allPicks state here and
		// not running a second fetch to the api...

		// had same code as getUserScore and was trying to filter
		// allPicks state, but no matter where I tried to call setUserInfo
		// allPicks was just empty array when called, only way I have found to
		// consistently populate so far is this...but there must be another way
		// it works for getUserScore consistently so I know I'm missing
		// something...
		const results = await fetch(`http://localhost:3000/api/picks`);
		const allPicks = await results.json();

		// is it bad coding practice to copy/paste this bit here
		// feels like it, but also think I need the function below
		// to run repeatedly in the loop, so keeping seperate to not
		// overlap and/or break something
		// console.log("1: ", allPicks);
		const userPicks = await allPicks.filter((pick) => {
			return pick.user_id === userId;
		});
		console.log(userPicks);
		setPicks(userPicks);
	};

	// re-factored all previous functions to all run in a loop
	const getUserScore = async (user) => {
		// instantiate score as 0
		let score = 0;
		// console.log("2: ", allPicks);
		const userPicks = allPicks.filter((pick) => {
			return pick.user_id === user.id;
		});
		const checkForWinner = async (pick) => {
			const gameMatch = async (game) => {
				if (game.id === pick.game_id) {
					// log below allows me to check that scores are accurate
					// console.log(game.id, game.winner, pick.chosen_team);
					if (game.winner === pick.chosen_team) {
						score++;
					}
				}
			};
			games.forEach(gameMatch);
		};
		if (userPicks.length) {
			userPicks.forEach(checkForWinner);
		}
		allScores.push({ user: user.id, name: user.name, score: score });
		
		// console.log(user.id, tally);
	};
	users.forEach(getUserScore);

	// setUserInfo(); - calling here creates infinite loop...
	// console.log(allPicks);
	// console.log(allScores);
	console.log("User: ", user);
	console.log("Picks: ", picks);

	useEffect(() => {
		getGames();
		getAllPicks();
		setUserInfo();
	}, []);

	return (
		<>
			<p>Scoring View</p>
			{allScores.map((score) => (
				<div
					key={score.user}
					className='flex flex-row justify-around mb-6'
				>
					<ScoreCard
						// variable naming is getting weird here...
						user={score.user}
						name={score.name}
						score={score.score}
					/>
				</div>
			))}
			<div>
				{/* had a tough time with rendering the username...
        was returning undefined and chased a bunch of different ways
        to call functions and define variables before thinking of
        having it wait for user to return true before rendering */}
				{user ? <p>Active User: {user[0].name}</p> : null}
				{picks.map((pick) => (
					<div key={pick.chosen_team}>
						{pick.game_id}, {pick.chosen_team}
					</div>
				))}
			</div>
		</>
	);
};

export default ScoreViewPage;
