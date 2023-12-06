import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";

const ScoreViewPage = () => {
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	const [user, setUser] = useState();
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

	// re-factored all previous functions to all run in a loop
	const getUserScore = async (user) => {
		let tally = [];
		const userPicks = allPicks.filter((pick) => {
			return pick.user_id === user.id;
		});
		const checkForWinner = async (pick) => {
			const gameMatch = async (game) => {
				if (game.id === pick.game_id) {
					// log allows me to check that scores are accurate
					// console.log(game.id, game.winner, pick.chosen_team);
					if (game.winner === pick.chosen_team) {
						tally.push(1);
					}
				}
			};
			games.forEach(gameMatch);
		};
		if (userPicks.length) {
			userPicks.forEach(checkForWinner);
			const getScore = () => {
				let sum = 0;
				tally.forEach((item) => {
					sum += item;
				});
				return sum;
			};
			// there a better way to do this?
			// defining function then calling in diff variable feels clunky...
			const score = getScore();
			allScores.push({ user: user.id, name: user.name, score: score });
		} else {
			const score = 0;
			allScores.push({ user: user.id, name: user.name, score: score });
		}

		// console.log(user.id, tally);
	};

	users.forEach(getUserScore);
	// console.log(allPicks);
	// console.log(allScores);

	useEffect(() => {
		getGames();
		getAllPicks();
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
		</>
	);
};

export default ScoreViewPage;
