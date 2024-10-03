import React, { useEffect, useState } from "react";
import { TeamCard } from "./TeamCard";

export const PickWeekView = ({ user, week, teams, formattedPicks, isSubmitted }) => {
	const picksForThisWeek = isSubmitted.filter((pick) => pick.week === week);
	console.log("NUP:", picksForThisWeek);

	// const thisUsersPicks = formattedPicks.filter((e) => e.user_id === user.id);

	return (
		<>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<p className='text-3xl text-lime-800 font-black underline m-4'>Week {week} Picks:</p>
				{!picksForThisWeek?.length ? (
					<p className='text-lg m-4'>No picks submitted for this week</p>
				) : (
					<div className='flex flex-col justify-around items-center mb-6'>
						{picksForThisWeek?.map((pick) => (
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
				)}
			</div>

			<div className='mt-80'>.</div>
		</>
	);
};
