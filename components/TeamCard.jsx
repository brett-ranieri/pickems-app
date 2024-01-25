import React, { useState, useEffect } from "react";

export const TeamCard = ({ team, clicked, game, picks, history }) => {
	const [isPicked, setIsPicked] = useState(null);

	const checkPick = async () => {
		if (history === true) {
			setIsPicked("history");
		} else if (picks.filter((pick) => pick.game_id === game.id).length > 0) {
			const pick = picks.filter((pick) => pick.game_id === game.id);
			const chosenTeam = pick[0].chosen_team;
			// optional chaining used on team throughout component
			if (chosenTeam === team?.id) {
				setIsPicked(true);
			} else {
				setIsPicked(false);
			}
		} else {
			setIsPicked(null);
		}
	};
	console.log(team.display_name, isPicked);

	useEffect(() => {
		checkPick();
	}, [picks]);

	return (
		<>
			{isPicked === null ? (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-white'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ color: `#${team?.color}` }}
					onClick={() => clicked(team.id, game.id, game.week)}
				>
					{team?.name}
				</div>
			) : isPicked === true ? (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer border-white border-4'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ backgroundColor: `#${team?.color}`, color: `#${team?.alt_color}` }}
					onClick={() => clicked(team.id, game.id, game.week)}
				>
					{team?.name}
				</div>
			) : isPicked === "history" ? (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer border-white border-4'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ backgroundColor: `#${team?.color}`, color: `#${team?.alt_color}` }}
				>
					{team.display_name}
				</div>
			) : (
				// this is basically isPicked === false
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-gray-200 text-slate-600'
					onClick={() => clicked(team.id, game.id, game.week)}
				>
					{team?.name}
				</div>
			)}
		</>
	);
};

// ENDED UP DOING OUTSIDE OF TAILWIND...
// tailwind color syntax: declare outside of the style prop
// const bgColor = `bg-[#${team.color}]`
// in the div: style={`${bgColor} mt-2`}
