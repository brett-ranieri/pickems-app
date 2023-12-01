import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);
	const [isSubmitted, setIsSubmitted] = useState([]);

	const getGames = async () => {
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	const getPicks = async () => {
		const results = await fetch(`http://localhost:3000/api/picks`);
		const prevPicks = await results.json();
		const user = 9;
		const userPicks = prevPicks.filter((pick) => {
			return pick.user_id === user;
		});
		if (userPicks.length) {
			setPicks(userPicks);
			setIsSubmitted(userPicks);
		} else {
			// I THOUGHT:
			// setting both states to an empty array here
			// fixed intial render bug...i was wrong...
			//
			// Noticed that it is only occuring for games that have had a pick
			// submitted to the database. If no pick has been submitted for a game
			// it is rendering correctly on initial load
			setPicks([]);
			setIsSubmitted([]);
		}
	};

	useEffect(() => {
		getTeams();
		getGames();
		getPicks();
	}, []);

	const clicked = async (id, gameId) => {
		const pick = {
			user_id: 9,
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
		</>
	);
};

export default GameViewPage;
