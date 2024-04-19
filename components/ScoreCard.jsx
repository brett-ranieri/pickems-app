import React, { useEffect, useState } from "react";

export const ScoreCard = ({ score, user }) => {
	const [current, setCurrent] = useState(false);

	const checkCurrent = (score, user) => {
		if (user?.id === score.user) {
			setCurrent(true);
		}
		//needed to add else statement to clear previously set users if toggled
		else {
			setCurrent(false);
		}
	};

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
