import React, { useEffect, useState } from "react";
import { PickWeekView } from "./PickWeekView";

export const PickView = ({
	handleViewChange,
	logout,
	weeksToMap,
	weeksHighToLow,
	teams,
	isSubmitted,
}) => {
	const [selectedWeek, setSelectedWeek] = useState(null);

	useEffect(() => {
		let firstWeek = weeksToMap[0];
		let highestWeek;
		for (const week of weeksToMap) {
			if (week >= firstWeek) {
				highestWeek = week;
			}
		}
		setSelectedWeek(highestWeek);
	}, []);

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
					onClick={() => handleViewChange("score")}
				>
					Scores
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
				{weeksHighToLow.map((week) => (
					<button
						key={week}
						className='bg-amber-500 hover:bg-amber-300 hover:text-black text-white font-bold py-2 px-4 rounded m-2 shrink-0 snap-end'
						onClick={() => handleWeekSelection(week)}
					>
						Week {week}
					</button>
				))}
			</div>
			<PickWeekView
				teams={teams}
				isSubmitted={isSubmitted}
				week={selectedWeek}
			/>
		</div>
	);
};
