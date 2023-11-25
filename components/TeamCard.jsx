import React, { useState, useEffect } from "react";

export const TeamCard = ({ team, clicked, game, picks }) => {
	const [isPicked, setIsPicked] = useState(null);
	// if you pass `picks` to this component, it will know if it is picked, or if its opponent is picked, because it will have `game`
	// logic for that is like -
	// if this team's game exists in the picks array, check if the team id matches or not, set `isPicked` to true or false
	// else if it doesn't exist in the picks array, set `isPicked` to null
	// then you can use that state to determine the styling

	// tried adding second function to onClick
	// thought was maybe running checkPick onClick would update faster than useEffect
	// did not work as hoped, still seeing delay on logs
	const clicking = async () => {
		clicked(team.id, game.id);
		checkPick();
	};

	const checkPick = () => {
		if (picks.filter((pick) => pick.id === game.id).length > 0) {
			const pick = picks.filter((pick) => pick.id === game.id);
			const choosenTeam = pick[0].choosenTeam;
			if (choosenTeam === team?.id) {
				console.log("winner");
				setIsPicked(true);
			} else {
				console.log("loser");
				setIsPicked(false);
			}
		} else {
			setIsPicked(null);
		}
	};

	useEffect(() => {
		checkPick();
		console.log(team?.name, isPicked);
	}, [picks]);

	// optional chaining on `teams` and `thisTeam` in case it doesn't exist yet when component tries to initially render
	// let thisTeam = teams?.find((t) => t.id === teamId);
	// console.log(thisTeam);
	return <div onClick={() => clicking()}>{team?.name}</div>;
};

// tailwind color syntax: declare outside of the style prop
// const bgColor = `bg-[#${team.color}]`
// in the div: style={`${bgColor} mt-2`}
