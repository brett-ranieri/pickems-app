import React, { useEffect, useState } from "react";

export const ScoreCard = ({ score, user }) => {
	const [current, setCurrent] = useState(false);

	const checkCurrent = (score, user) => {
		// add optional chaining to fix undefined error on selected for initial load
		if (user?.id === score.user) {
			setCurrent(true);
		}
		//needed to add else statement to clear previously set users if toggled
		else {
			setCurrent(false);
		}
	};

	// used same solution to race effect that I used in score_view...
	// have useEffect listen for user, if exists then run checkCurrent
	useEffect(() => {
		if (user) {
			checkCurrent(score, user);
		}
	}, [user]);

	return (
		<>
			{current ? (
				<>
					<div className='flex flex-row justify-around text-center bg-lime-900 text-xl text-white font-black pt-2 pb-2 rounded'>
						<div className='font-bold w-48'>{score.name}</div>
						<div className='font-bold w-12'>{score.score}</div>
					</div>
				</>
			) : (
				<>
					<div className='flex flex-row justify-around text-center font-bold pt-2 pb-2'>
						<div className='w-48'>{score.name}</div>
						<div className='w-12'>{score.score}</div>
					</div>
				</>
			)}
		</>
	);
};
