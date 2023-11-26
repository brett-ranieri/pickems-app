import React, { useState, useEffect } from "react";

export const TeamCard = ({ team, clicked, game, picks }) => {
	const [isPicked, setIsPicked] = useState(null);

	// if you pass `picks` to this component, it will know if it is picked, or if its opponent is picked, because it will have `game`
	// logic for that is like -
	// if this team's game exists in the picks array, check if the team id matches or not, set `isPicked` to true or false
	// else if it doesn't exist in the picks array, set `isPicked` to null
	// then you can use that state to determine the styling

	// turns out delayed issue was with my console logs, not with state setting
	// was able to tell once I added styling!! :)

	const checkPick = async () => {
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

	if (isPicked === null) {
		return (
			<>
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-gray-200'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ color: `#${team?.color}` }}
					onClick={() => clicked(team.id, game.id)}
				>
					{team?.name}
				</div>
			</>
		);
	}

	return (
		<>
			{isPicked ? (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer border-black border-slate-600 border-4'
					// seemed easier to do outside of tailwind, found solution here:
					// https://stackoverflow.com/questions/70903204/tailwindcss-custom-background-color-not-working
					style={{ backgroundColor: `#${team?.color}`, color: `#${team?.alt_color}` }}
					onClick={() => clicked(team.id, game.id)}
				>
					{team?.name}
				</div>
			) : (
				<div
					className='w-80 h-10 mt-4 font-bold flex items-center justify-center rounded hover:cursor-pointer bg-gray-200 text-slate-600'
					onClick={() => clicked(team.id, game.id)}
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
