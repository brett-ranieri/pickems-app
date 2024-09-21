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
	console.log(thisWeeksScores);
	let highestScore = 1;
	let arrayOfHighScorers = [];
	for (const score of thisWeeksScores) {
		if (score.totalScore >= highestScore) {
			highestScore = score.totalScore;
			console.log(score);
			arrayOfHighScorers.push(score);
		}
	}
	console.log("Week's High Scorer", arrayOfHighScorers);
	return (
		<>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-2xl text-lime-800 font-black underline m-4'>And the Glory goes to...</p>
				<div className='flex flex-row justify-around text-center mb-6'>
					{arrayOfHighScorers.map((score) => (
						<div key={score.user_id}>
							<div className='text-4xl font-black m-2'>{score.name}</div>
						</div>
					))}
				</div>
				{arrayOfHighScorers.length > 1 ? (
					<p className='text-lg m-4'>
						Looks like we got a tie...y'all are gonna need to split this week's glory.
					</p>
				) : null}
			</div>
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
