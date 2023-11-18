import React, { useEffect } from "react";

const TestPage = () => {
	const getTeams = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`);
		console.log(await teams.json());
	};

	const postTeam = async () => {
		const teams = await fetch(`http://localhost:3000/api/teams`, {
			method: "POST",
			body: JSON.stringify({
				color: "yellow",
			}),
		});
		console.log(await teams.json());
	};

	useEffect(() => {
		getTeams();
	}, []);

	return (
		<>
			<p>Hello world</p>;{/* <button onClick={() => postTeam()}>Click me!</button> */}
		</>
	);
};

export default TestPage;
