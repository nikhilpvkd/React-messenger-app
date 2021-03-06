import React from "react";

const Microphone = ({ setAudioScrn }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{ color: "#fff", width: "25px", cursor: "pointer" }}
			fill="none"
			onClick={() => setAudioScrn(true)}
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
			/>
		</svg>
	);
};

export default Microphone;
