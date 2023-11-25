import React, { useState, useEffect } from "react";

export const TeamCard = ({ teamId, teams, clicked, gameId }) => {
	// optional chaining on `teams` and `thisTeam` in case it doesn't exist yet when component tries to initially render
	let thisTeam = teams?.find((t) => t.id === teamId);
	// console.log(thisTeam);
	return <div onClick={() => clicked(thisTeam?.id, gameId)}>{thisTeam?.name}</div>;
};

// tailwind color syntax: declare outside of the style prop
// const bgColor = `bg-[#${team.color}]`
// in the div: style={`${bgColor} mt-2`}
