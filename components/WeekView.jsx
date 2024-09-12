import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import users from "../constants/users";
import stat_results from "../constants/stats-results";

export const WeekView = ({
	baseUrl,
	allPicks,
	allStatPicks,
	upcomingGames,
	user,
	handleViewChange,
	logout,
}) => {
	console.log(upcomingGames);
	const week = upcomingGames[0].week;
	console.log(week);
	const thisWeeksPicks = allPicks.filter((x) => x.week === week);
	console.log(thisWeeksPicks);

	return (
		<div className='bg-side-line bg-cover'>
			<div className='bg-lime-800 flex flex-row justify-end p-1'>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("wager")}
				>
					Submit Picks
				</button>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("score")}
				>
					Scores
				</button>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>

			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>This Week's Picks:</p>
				<div className='mb-6 ml-10'>More coming soon...stay tuned!</div>
			</div>
			<div className='mt-80'>.</div>
		</div>
	);
};
