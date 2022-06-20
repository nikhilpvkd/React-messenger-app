import React from "react";

function Loading() {
	return (
		<div style={{ position: "relative" }}>
			<h3
				style={{
					position: "fixed",
					left: "50%",
					top: "50%",
					transform: "translate(-50%,-50%)",
				}}
			>
				Loading...
			</h3>
		</div>
	);
}

export default Loading;
