import React, { useEffect, useState } from "react";

export const UserDropdown = ({ users, selectUser }) => {
	console.log("DD", users);
	const handleUserChange = (e) => {
		const value = parseInt(e.target.value);
		const selectedUser = users.filter((user) => user.id === value);
		console.log(selectedUser[0]);
		selectUser(selectedUser[0]);
	};
	return (
		<div>
			<p>I'm the user Dropdown yo!</p>
			{/* needed to pass e to handleUserChange to prevent 'e.target.value' from returning undefined */}
			<select onChange={(e) => handleUserChange(e)}>
				<option value='Select a User'> -- Select a User -- </option>
				{users.map((user) => (
					<option value={user.id}>{user.name}</option>
				))}
			</select>
		</div>
	);
};
