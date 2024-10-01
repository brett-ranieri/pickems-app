import React, { useEffect, useState } from "react";
import { ScoreCard } from "../components/ScoreCard";
import { ScoreWeekView } from "./ScoreWeekView";

export const ScoreView = ({
	user,
	handleViewChange,
	logout,
	weeksToMap,
	totalScores,
	formattedPicks,
	formattedGames,
	scoreAndFormatPicks,
}) => {
	const [selectedWeek, setSelectedWeek] = useState(null);

	useEffect(() => {
		scoreAndFormatPicks();
	}, []);

	totalScores.sort((a, b) => parseInt(b.totalScore) - parseInt(a.totalScore));

	/////////////////////// week selection /////////////////////////////////////////
	const handleWeekSelection = (week) => {
		if (!week) {
			setSelectedWeek(null);
		} else {
			setSelectedWeek(week);
		}
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
				{/* <button
					className='bg-lime-300 hover:bg-lime-400 text-lime-800 font-bold py-2 px-4 rounded m-2 '
					onClick={() => handleViewChange("week")}
				>
					This Week
				</button> */}
				<button
					className='bg-amber-900 hover:bg-amber-500 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>

			<div className='overflow-x-scroll w-full flex gap-x-3 bg-amber-900'>
				<button
					className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2 shrink-0 snap-end'
					onClick={() => handleWeekSelection(null)}
				>
					Overall
				</button>
				{weeksToMap.map((week) => (
					<button
						key={week}
						className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2 shrink-0 snap-end'
						onClick={() => handleWeekSelection(week)}
					>
						Week {week}
					</button>
				))}
			</div>

			{selectedWeek ? (
				<div>
					<ScoreWeekView
						user={user}
						formattedPicks={formattedPicks}
						formattedGames={formattedGames}
						week={selectedWeek}
					/>
				</div>
			) : (
				<>
					<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
						<p className='text-3xl text-lime-800 font-black underline m-4'>Overall Scores:</p>
						<div className='mb-6'>
							{totalScores.map((score) => (
								<div
									key={score.user_id}
									className='text-lg'
								>
									<ScoreCard
										score={score}
										user={user}
									/>
								</div>
							))}
						</div>
					</div>

					<div className='mt-80'>.</div>
				</>
			)}
		</div>
	);
};
