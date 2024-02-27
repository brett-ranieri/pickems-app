import React, { useEffect, useState } from "react";
import { TeamCard } from "./TeamCard";
import { StatCard } from "./StatCard";
import stats from "../constants/stats";
import superbowlStats from "../constants/superbowl-stats";

export const PickHistoryView = ({ user, picks, week, teams, handleWeekSelection }) => {
	const [picksToDisplay, setPicksToDisplay] = useState([]);
	const [statPicksToDisplay, setStatPicksToDisplay] = useState([]);
	// console.log("In PHV - ID", user.id);
	console.log("In PHV - week", week);
	console.log("In PHV - picks", picks);
	// console.log("In PHV - teams", teams);

	///////////////////////////// WEIRD CODE STUFF BELOW //////////////////////////////////////////////////
	// logic that was re-writing week value in formmatedPicks State!
	// no idea why it didn't return a new array, instead it would change the
	// week value to whatever week was passed to component
	// .find would only change first week in array, .filter changed all weeks
	// confirmed that it was changing formattedPicks by adding log into
	// handleWeekSelection and seeing that formattedPicks contained new values
	// feels BIZARRE!
	// const testPicks = picks.allPicks.filter((e) => (e.week = week));
	// const testStatPicks = picks.allStatPicks.find((e) => (e.week = week));

	// console.log(testPicks);
	// console.log(testStatPicks);

	///////////////////////////// WEIRD CODE STUFF END ///////////////////////////////////////

	const findSelectedWeeksPicks = () => {
		console.log("used");
		setPicksToDisplay(picks.allPicks.find((e) => e.week === week));
		setStatPicksToDisplay(picks.allStatPicks.find((e) => e.week === week));
	};

	useEffect(() => {
		findSelectedWeeksPicks();
	}, []);

	console.log("POOOOOST");
	console.log(picksToDisplay);
	console.log(statPicksToDisplay);

	return (
		<>
			<button
				className='bg-amber-500 hover:bg-amber-200 hover:text-black text-white font-bold py-2 px-4 rounded m-2'
				// dont pass a week here which will reset view to ScoreView
				onClick={() => handleWeekSelection()}
			>
				Overall
			</button>
			<p>I'm the Pick History!!</p>
		</>
	);
};
