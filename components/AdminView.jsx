import React, { useEffect, useState } from "react";
import baseUrl from "../constants/baseUrl";

export const AdminView = ({ handleViewChange }) => {
	const [gamesResponse, setGamesResponse] = useState([]);
	const [winnersResponse, setWinnersResponse] = useState([]);

	const handleGames = async () => {
		const populateGames = await fetch(`${baseUrl}/api/populate-games`);
		const newGames = await populateGames.json();
		console.log(newGames);
		setGamesResponse(newGames);
	};

	const handleWinners = async () => {
		const populateWinners = await fetch(`${baseUrl}/api/populate-winners`);
		const gameWinners = await populateWinners.json();
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", gameWinners);
		setWinnersResponse(newGames);
	};

	//////////////////////////////////////////////////////////////////////////////////////////

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
					onClick={() => handleViewChange("picks")}
				>
					My Picks
				</button>
				<button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("week")}
				>
					This Week
				</button>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>

			<>
				<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
					<p className='text-3xl text-lime-800 font-black underline m-4'>Admin View</p>
					<button
						className='bg-fuchsia-600 hover:bg-fuchsia-800 text-pink-50 font-bold py-2 px-4 rounded m-2 '
						onClick={() => handleGames()}
					>
						Populate Games
					</button>
					<button
						className='bg-fuchsia-600 hover:bg-fuchsia-800 text-pink-50 font-bold py-2 px-4 rounded m-2 '
						onClick={() => handleWinners()}
					>
						Populate Winners
					</button>
				</div>
				<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'></div>

				<div className='mt-80'>.</div>
			</>
		</div>
	);
};
