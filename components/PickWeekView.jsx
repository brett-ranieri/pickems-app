import React, { useEffect, useState } from "react";
import { TeamCard } from "./TeamCard";

export const PickWeekView = ({ user, week, teams, formattedPicks }) => {
	const thisUsersPicks = formattedPicks.filter((e) => e.user_id === user.id);

	let thisWeeksPicks = [];
	function findThisWeeksPicks() {
		thisUsersPicks.map(function (pick) {
			const picksToFilter = pick.allPicks;
			const pickToPush = picksToFilter.filter((e) => e.week === week);
			thisWeeksPicks.push(pickToPush[0]);
		});
	}
	findThisWeeksPicks();

	const picksToMap = thisWeeksPicks[0]?.picks;

	return (
		<>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Week {week} Picks:</p>
				<div className='flex flex-col justify-around items-center mb-6'>
					{picksToMap?.map((pick) => (
						<div
							key={pick.game_id}
							className='text-lg'
						>
							<TeamCard
								team={teams?.find((x) => x.id === pick.chosen_team)}
								history={true}
							/>
						</div>
					))}
				</div>
			</div>

			<div className='mt-80'>.</div>
		</>
	);
};
