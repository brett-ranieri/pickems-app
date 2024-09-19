import React, { useEffect, useState } from "react";
import { TeamCard } from "./TeamCard";
import { StatCard } from "./StatCard";
import stats from "../constants/stats";
import superbowlStats from "../constants/superbowl-stats";

export const PickView = ({ userPicks, userStatPicks, user, teams }) => {
	const week1Picks = userPicks.filter((x) => x.week === 1);
	const week2Picks = userPicks.filter((x) => x.week === 2);
	const week3Picks = userPicks.filter((x) => x.week === 3);
	const week4Picks = userPicks.filter((x) => x.week === 4);
	const week5Picks = userPicks.filter((x) => x.week === 5);
	const week6Picks = userPicks.filter((x) => x.week === 6);

	// const week3StatPicks = userStatPicks.filter((x) => x.week === 3);
	// const week5StatPicks = userStatPicks.filter((x) => x.week === 5);

	return (
		<>
			<div className='bg-lime-300 bg-opacity-70 m-4 p-1 rounded'>
				<h1 className='text-2xl text-lime-800 font-bold m-2 underline'>{user.name}'s Picks:</h1>
				{/* <h3 className='text-lg text-lime-900 font-bold m-2'>Week 4:</h3>
				{week4Picks.length ? (
					<div className='flex flex-col justify-around items-center 6'>
						{week3Picks?.map((pick) => (
							<div key={pick.game_id}>
								<TeamCard
									team={teams.find((x) => x.id === pick.chosen_team)}
									history={true}
								/>
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col justify-around items-center 6'>
						<p className='text-md text-black m-2'>No picks have been saved yet.</p>
					</div>
				)} */}

				<h3 className='text-lg text-lime-900 font-bold m-2'>Week 3:</h3>
				{week3Picks.length ? (
					<div className='flex flex-col justify-around items-center 6'>
						{week3Picks?.map((pick) => (
							<div key={pick.game_id}>
								<TeamCard
									team={teams.find((x) => x.id === pick.chosen_team)}
									history={true}
								/>
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col justify-around items-center 6'>
						<p className='text-md text-black m-2'>No picks have been saved yet.</p>
					</div>
				)}

				<h3 className='text-lg text-lime-900 font-bold m-2'>Week 2:</h3>
				{week2Picks.length ? (
					<div className='flex flex-col justify-around items-center 6'>
						{week2Picks?.map((pick) => (
							<div key={pick.game_id}>
								<TeamCard
									team={teams.find((x) => x.id === pick.chosen_team)}
									history={true}
								/>
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col justify-around items-center 6'>
						<p className='text-md text-black m-2'>No picks have been saved yet.</p>
					</div>
				)}

				<h3 className='text-lg text-lime-900 font-bold m-2 mt-4'>Week 1:</h3>
				{week1Picks.length ? (
					<div className='flex flex-col justify-around items-center mb-6 6'>
						{week1Picks?.map((pick) => (
							<div key={pick.game_id}>
								<TeamCard
									team={teams.find((x) => x.id === pick.chosen_team)}
									history={true}
								/>
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col justify-around items-center 6'>
						<p className='text-md text-black m-2 mb-6'>No picks have been saved yet.</p>
					</div>
				)}
			</div>
		</>
	);
};
