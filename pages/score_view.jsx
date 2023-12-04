import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const ScoreViewPage = () => {
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	const [user, setUser] = useState();
	let tally = [];

	const getGames = async () => {
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getPicks = async () => {
		const results = await fetch(`http://localhost:3000/api/picks`);
		const prevPicks = await results.json();
		const user = 3;
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === user;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setUser(user);
		}
	};

	const checkForWinner = async (pick) => {
		console.log("scoring...", pick.game_id, "winner: ", pick.chosen_team);
		const gameMatch = async (game) => {
			if (game.id === pick.game_id) {
				console.log(game.id, game.winner);
				if (game.winner === pick.chosen_team) {
					tally.push(1);
				}
			}
		};
		games.forEach(gameMatch);
		console.log(tally);
	};

	console.log("Games: ", games);
	console.log("Picks: ", picks);

	picks.forEach(checkForWinner);

	console.log("Tally: ", tally);

	const getScore = () => {
		let sum = 0;
		tally.forEach((item) => {
			sum += item;
		});
		return sum;
	};

	console.log(getScore());
	const score = getScore();

	useEffect(() => {
		getGames();
		getPicks();
	}, []);

	return (
		<>
			<p>Scoring View</p>
			<div>{user}</div>
			<div>{score}</div>
			<button
				className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 mt-2 ml-8'
				// type='submit'
				onClick={() => getScore()}
			>
				Total?
			</button>
		</>
	);
};

export default ScoreViewPage;
