import { useState, useEffect } from "react";

export const TeamCard = ({ teamId, teams }) => {
	let thisTeam = teams.find((t) => t.id === teamId);
	console.log(thisTeam);
	return <div>{thisTeam.name}</div>;
};
