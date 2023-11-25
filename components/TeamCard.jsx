import React, { useState, useEffect } from "react";

export const TeamCard = ({ teamId, teams, clicked, gameId }) => {
	// if you pass `picks` to this component, it will know if it is picked, or if its opponent is picked, because it will have `game`
	// logic for that is like - 
	// if this team's game exists in the picks array, check if the team id matches or not, set `isPicked` to true or false
	// else if it doesn't exist in the picks array, set `isPicked` to null
	// then you can use that state to determine the styling

	// optional chaining on `teams` and `thisTeam` in case it doesn't exist yet when component tries to initially render
	let thisTeam = teams?.find((t) => t.id === teamId);
	// console.log(thisTeam);
	return <div onClick={() => clicked(thisTeam?.id, gameId)}>{thisTeam?.name}</div>;
};

// tailwind color syntax: declare outside of the style prop
// const bgColor = `bg-[#${team.color}]`
// in the div: style={`${bgColor} mt-2`}
