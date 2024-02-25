import React, { useEffect, useState } from "react";

export const ScoreCard = ({ score, type, user }) => {
	const [current, setCurrent] = useState(false);

	// checks for current user
	const checkCurrent = (score, user) => {
		if (user?.id === score.user_id) {
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
						{type === "overall" ? (
							<div className='font-bold w-48'>{score.totalScore}</div>
						) : type === "game" ? (
							<div className='font-bold w-48'>{score.gameScore}</div>
						) : type === "stat" ? (
							<div className='font-bold w-48'>{score.statScore}</div>
						) : null}
					</div>
				</>
			) : (
				<>
					<div className='flex flex-row justify-around text-center font-bold pt-2 pb-2'>
						<div className='font-bold w-48'>{score.name}</div>
						{type === "overall" ? (
							<div className='font-bold w-48'>{score.totalScore}</div>
						) : type === "game" ? (
							<div className='font-bold w-48'>{score.gameScore}</div>
						) : type === "stat" ? (
							<div className='font-bold w-48'>{score.statScore}</div>
						) : null}
					</div>
				</>
			)}
		</>
	);
};
