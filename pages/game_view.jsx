import React, { useEffect, useState } from "react";
import { TeamCard } from "../components/TeamCard";

const GameViewPage = () => {
	const [teams, setTeams] = useState([]);
	const [games, setGames] = useState([]);
	const [picks, setPicks] = useState([]);

	const getGames = async () => {
		console.log("hello??");
		// if you're not changing a variable, _always_ declare as a `const`
		const results = await fetch(`http://localhost:3000/api/games`);
		const upcomingGames = await results.json();
		console.log(upcomingGames);
		setGames(upcomingGames);
	};

	const getTeams = async () => {
		const results = await fetch(`http://localhost:3000/api/teams`);
		const teams = await results.json();
		setTeams(teams);
	};

	useEffect(() => {
		console.log("running useeffect");
		getTeams();
		getGames();
	}, []);

	const clicked = async (id, gameId) => {
		const pick = {
			user_id: 4,
			chosen_team: id,
			game_id: gameId,
		};
		console.log(pick);

		const tempPicks = picks?.filter((pick) => pick.game_id !== gameId);
		setPicks([...tempPicks, pick]);
	};

	const handleSubmit = async () => {
		console.log("submitted");

		// post request to endpoint, body is stringified picks
		const postPicksRes = await fetch(`http://localhost:3000/api/submit-picks`, {
			method: "POST",
			body: JSON.stringify(picks),
		});
		// in the endpoint, you'll be able to log req.method as 'POST' and req.body will be your data
		// because its already JSON and you're not parsing it, instead of the JSON.stringify(data) like the example
		// you should be able to just put `req.body` in the parameters array after the query
		// (if that doesn't work try parsing it and stringifying it again im maybe 90% confident)

		// you probably want to use a json_populate_recordset in your query
		// to post all the picks at once (see PR write up for example of query)
		// when you set up your picks object in `clicked`, make the keys the same as the table column headers

		// when you're successful you'll be able to console.log(await postPicksRes.json())
		// and it'll be the array of picks you just posted because of the returning * in the query
		// assuming you do a res.send at the end of the post method in the endpoint
		console.log(await postPicksRes.json());
	};

	return (
		<>
			<p className='text-3xl font-bold mb-4'>This is the game view page</p>
			{/* // didn't need to declare this map outside the default return, can map right here inside {} */}
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
			<button
				type='submit'
				onClick={() => handleSubmit()}
			>
				Submit
			</button>
		</>
	);
};

export default GameViewPage;
