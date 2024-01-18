import React, { useEffect, useState } from "react";

export const UserDropdown = ({ users, selectUser }) => {
	console.log("DD", users);
	const handleUserChange = (e) => {
		const value = parseInt(e.target.value);
		const selectedUser = users.filter((user) => user.id === value);
		console.log(selectedUser[0]);
		//need index here...why?
		selectUser(selectedUser[0]);
	};
	return (
		<div className='bg-football-on-field bg-cover h-screen'>
			<div className='flex flex-col justify-center items-center text-center '>
				<div className='bg-gradient-to-l from-amber-300 to-amber-500 m-8 mt-32 rounded-3xl'>
					<p className='text-4xl font-bold mb-4 mt-4'>Brett's</p>
					<img
						className='h-48 bg-gradient-to-r from-gray-100 to-gray-400'
						src='/nfl-1-logo-png-transparent.png'
					/>
					<p className='text-4xl font-bold mt-4 mb-4'>Pick'ems</p>
				</div>
				<div className='flex flex-col justify-center items-center text-center bg-gradient-to-r from-amber-300 to-amber-500 w-3/5 rounded-2xl'>
					<p className='m-2 mt-4'>Who the heck are ya?</p>
					{/* needed to pass e to handleUserChange to prevent 'e.target.value' from returning undefined */}
					<select
						onChange={(e) => handleUserChange(e)}
						className='m-2 mb-4 w-5/6 rounded'
					>
						<option value='Select a User'> -- Select a User -- </option>
						{users.map((user) => (
							<option value={user.id}>{user.name}</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
