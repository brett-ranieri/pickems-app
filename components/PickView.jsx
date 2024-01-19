import React, { useEffect, useState } from "react";
import { TeamCard } from "./TeamCard";

export const PickView = ({ allPicks, user, teams }) => {
	// const [userPicks, setUserPicks] = useState([]);
	let userPicks = [];

	const initialPicks = allPicks?.filter((pick) => pick.user_id === user.id);
	console.log(initialPicks);
	const week1Picks = initialPicks.filter((x) => x.week === 1);
	const week2Picks = initialPicks.filter((x) => x.week === 2);
	// const addDetails = (pick) => {
	// 	console.log("wk:", pick.week, pick, teams);
	// 	const matchingTeam = teams.find((team) => team.id === pick.chosen_team);
	// 	//add week key:value to object before adding to array
	// 	matchingTeam.week = pick.week;
	// 	matchingTeam.game_id = pick.game_id;
	// 	console.log(matchingTeam);
	// 	userPicks.push(matchingTeam);

	// 	// tried using state...didn't work
	// 	// const tempPicks = userPicks?.filter((p) => p.game_id !== pick.game_id);
	// 	// console.log(tempPicks);
	// 	// setUserPicks([...tempPicks, pick]);
	// };

	// initialPicks.forEach(addDetails);
	// const week1Picks = userPicks?.filter((pick) => pick.week === 1);
	// console.log(week1Picks);
	// const week2Picks = userPicks?.filter((pick) => pick.week === 2);
	// console.log(week2Picks);
	// console.log(userPicks);

	return (
		<div className='bg-lime-300 bg-opacity-80 m-4 p-1 rounded'>
			<h1 className='text-2xl text-lime-800 font-bold m-2 underline'>
				{user.name}'s pick history:
			</h1>
			<h3 className='text-lg text-lime-900 font-bold m-2'>Divisonal Championship Weekend:</h3>
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
					<p className='text-md text-black m-2'>No picks have been saved to the Database yet.</p>
				</div>
			)}
			<h3 className='text-lg text-lime-900 font-bold m-2 mt-4'>Super Wildcard Weekend:</h3>
			<div className='flex flex-col justify-around mb-6 items-center 6'>
				{week1Picks?.map((pick) => (
					<div key={pick.game_id}>
						<TeamCard
							team={teams.find((x) => x.id === pick.chosen_team)}
							history={true}
						/>
					</div>
				))}
			</div>
		</div>
	);
};