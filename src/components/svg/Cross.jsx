import React from "react";

const Cross = ({ dltPreview, i }) => {
	return (
		<svg
			onClick={() => dltPreview(i)}
			xmlns="http://www.w3.org/2000/svg"
			style={{
				width: "20px",
				height: "20px",
				position: "absolute",
				top: "-10px",
				right: "-7px",
				zIndex: 10,
				cursor: "pointer",
				color: "#fff",
			}}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	);
};

export default Cross;
