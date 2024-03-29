import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import Link from "next/link";

// you need to figure out how to group things by property into an array of arrays, in javascript
// so games right now is an array of objects. each object has a `week` property.
// you need to group them into an array of objects where its like
// [{week: 1, games: [{week 1 game 1}, {week 1 game 2}...]}, {week: 2, games: [{week 2 game 1}, {week 2 game 2}...]}]
// dont have to do this part right now, can happen in a later version after the playoffs deadline

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
		// console.log("called");
		// can manually change userId here
		const userId = 4;
		// a find returns an object. if you must return an array, and are only using the first item, get the object with [0] immediately
		const activeUser = users.find((user) => {
			return user.id === userId;
		});
		// console.log(activeUser);
		setUser(activeUser);

		const userPicks = allPicks.filter((pick) => {
			return pick.user_id === userId;
		});
		// console.log(userPicks);
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
		const checkForWinner = (pick) => {
			if (pick.winner === pick.chosen_team) {
				score++;
			}
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
	// console.log("User: ", user);
	// console.log("Picks: ", picks);
	console.log(games);

	useEffect(() => {
		getGames();
		getAllPicks();
	}, []);

	// this useEffect is the solution to the getUserInfo race condition
	// listen for allPicks and wait until its truthy (so you know the state has been set)
	// before making the call to setUserInfo()
	useEffect(() => {
		if (allPicks.length) {
			setUserInfo();
		}
	}, [allPicks]);

	//sort scores in descending order
	allScores.sort((a, b) => parseInt(b.score) - parseInt(a.score));

	return (
		<div className='bg-slate-400 h-full'>
			<p className='text-3xl font-bold m-8'>Overall Scores:</p>
			{allScores.map((score) => (
				<div
					key={score.user}
					// className='flex flex-row justify-around text-center mb-6'
				>
					<ScoreCard
						// if you're passing more than one property of an object as a prop, pass the whole thing!
						score={score}
						user={user}
					/>
				</div>
			))}
			<Link
				href='/game_view'
				passHref
			>
				<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'>
					Make some picks!
				</button>
			</Link>
			<div>
				{/* had a tough time with rendering the username...
        was returning undefined and chased a bunch of different ways
        to call functions and define variables before thinking of
        having it wait for user to return true before rendering */}
				{/* <p>Active User: {user?.name}</p>
				{picks.map((pick) => (
					<div key={pick.chosen_team}>
						{pick.game_id}, {pick.chosen_team}
					</div>
				))} */}
			</div>
		</div>
	);
};

export default ScoreViewPage;
