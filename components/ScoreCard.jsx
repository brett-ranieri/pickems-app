import React from "react";

export const ScoreCard = ({ score }) => {
	return (
		<>
			<div>{score.user}</div>
			<div>{score.name}</div>
			<div>{score.score}</div>
		</>
	);
};
