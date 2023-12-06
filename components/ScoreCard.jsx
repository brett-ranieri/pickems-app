import React from "react";

export const ScoreCard = ({ user, name, score }) => {
	return (
		<>
			<div>{user}</div>
			<div>{name}</div>
			<div>{score}</div>
		</>
	);
};
