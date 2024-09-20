import React, { useEffect, useState } from "react";
import { ScoreCard } from "./ScoreCard";

export const ScoreWeekView = ({ user, week, formattedPicks }) => {
	let thisWeeksScores = [];
	function mapAllScores() {
		formattedPicks.map(function (pick) {
			const scoresToFilter = pick.scores;
			const scoreToPush = scoresToFilter.filter((e) => e.week === week);
			thisWeeksScores.push(scoreToPush[0]);
		});
	}
	mapAllScores();

	thisWeeksScores.sort((a, b) => parseInt(b.totalScore) - parseInt(a.totalScore));
	return (
		<>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Week {week} Scores:</p>
				<div className='mb-6'>
					{thisWeeksScores.map((score) => (
						<div
							key={score.user_id}
							className='text-lg'
						>
							<ScoreCard
								score={score}
								user={user}
							/>
						</div>
					))}
				</div>
			</div>

			<div className='mt-80'>.</div>
		</>
	);
};
