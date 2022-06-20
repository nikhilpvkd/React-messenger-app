import { onSnapshot } from "firebase/firestore";
import React, { useRef, useEffect, useState } from "react";
import Moment from "react-moment";

const Messages = ({ msg, user1, audio, upldPrgs }) => {
	const ScrollRef = useRef();

	useEffect(() => {
		ScrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	// useEffect(() => {
	// 	const unsub=onSnapshot()
	// },[]);

	return (
		<>
			<div
				className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
				ref={ScrollRef}
			>
				<p className={msg.from === user1 ? "me" : "friend"}>
					{msg.media
						? msg.from === user1
							? msg.uploading
								? upldPrgs + "%"
								: msg.media
								? msg.media.map((img) => (
										<img src={img} alt="image" />
								  ))
								: null
							: msg.uploading
							? null
							: msg.media
							? msg.media.map((img) => (
									<img src={img} alt="image" />
							  ))
							: null
						: null}
					{msg.text
						? msg.from === user1
							? msg.uploading
								? "loading..."
								: msg.text
							: msg.uploading
							? null
							: msg.text
						: null}

					{msg.voice ? (
						msg.from === user1 ? (
							msg.uploading ? (
								"loading..."
							) : (
								<audio src={msg.voice} controls />
							)
						) : msg.uploading ? null : (
							<audio src={msg.voice} controls />
						)
					) : null}
					<br />

					<small style={{ display: "block" }}>
						<Moment fromNow>{msg.createdAt.toDate()}</Moment>
					</small>
				</p>
			</div>
		</>
	);
};

export default Messages;
