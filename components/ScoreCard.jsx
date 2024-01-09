import React, { useEffect, useState } from "react";

export const ScoreCard = ({ score, user }) => {
	const [current, setCurrent] = useState(false);

	const checkCurrent = (score, user) => {
		// console.log("tried");
		if (user.id === score.user) {
			setCurrent(true);
		}
	};
	// use same solution to race effect that I used in score_view...
	// have useEffect listen for user, if exists then run checkCurrent

	useEffect(() => {
		if (user) {
			checkCurrent(score, user);
		}
	}, [user]);

	// console.log(current);
	return (
		<>
			{current ? (
				<>
					<div className='flex flex-row justify-around text-center bg-orange-300 pt-2 pb-2'>
						<div className='font-bold w-48'>{score.name}</div>
						<div className='font-bold w-12'>{score.score}</div>
					</div>
				</>
			) : (
				<>
					<div className='flex flex-row justify-around text-center pt-2 pb-2'>
						<div className='w-48'>{score.name}</div>
						<div className='w-12'>{score.score}</div>
					</div>
				</>
			)}
		</>
	);
};
