import React, { useState, useEffect } from "react";

export const StatCard = ({ stat }) => {

	return <div className='text-md text-lime-900 font-bold mt-2'>{stat.name}</div>;
};
