import React, { useState, useEffect } from "react";

export const TeamCard = ({ team, clicked, game, picks }) => {
	const [isPicked, setIsPicked] = useState(null);

	const checkPick = async () => {
		// for .length you don't have to explicitly state > 0, length of 0 is falsy for .length
		if (picks.filter((pick) => pick.id === game.id).length > 0) {
			const pick = picks.filter((pick) => pick.id === game.id);
			const choosenTeam = pick[0].choosenTeam;
			// optional chaining used on team throughout component
			if (choosenTeam === team?.id) {
				setIsPicked(true);
			} else {
				setIsPicked(false);
			}
		} else {
			setIsPicked(null);
		}
	};

	useEffect(() => {
		checkPick();
	}, [picks]);

	// is there a better way to specify the return when isPicked is null????

	return (
		<>
			{isPicked === null ? (
				// null case is different case from isPicked === false, game hasn't been picked
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-gray-200'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ color: `#${team?.color}` }}
					onClick={() => clicked(team.id, game.id)}
				>
					{team?.name}
				</div>
			) : isPicked ? (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer border-slate-600 border-4'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ backgroundColor: `#${team?.color}`, color: `#${team?.alt_color}` }}
					onClick={() => clicked(team.id, game.id)}
				>
					{team?.name}
				</div>
			) : isPicked === false ? (
				// this is the case for isPicked === false, other team is picked
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-gray-200 text-slate-600'
					onClick={() => clicked(team.id, game.id)}
				>
					{team?.name}
				</div>
			) : null}
		</>
	);
};

// ENDED UP DOING OUTSIDE OF TAILWIND...
// tailwind color syntax: declare outside of the style prop
// const bgColor = `bg-[#${team.color}]`
// in the div: style={`${bgColor} mt-2`}
