import { useState, useEffect } from "react";

export const TeamCard = ({ teamId, teams, clicked, gameId }) => {
	let thisTeam = teams.find((t) => t.id === teamId);
	// console.log(thisTeam);
	return <div onClick={() => clicked(thisTeam.id, gameId)}>{thisTeam.name}</div>;
};
