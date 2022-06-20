import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import React, { useEffect, useState } from "react";

// Images
import img from "../../image1.jpg";

function User({ user, selectUser, chat, user1 }) {
	const [data, setData] = useState({});
	const user2 = user?.uid;

	useEffect(() => {
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
		let unsub = onSnapshot(doc(db, "lastmsg", id), (snapDoc) => {
			setData(snapDoc.data());
		});
		return () => unsub;
	}, []);

	return (
		<div
			className={`user_wrapper ${
				chat?.name === user.name && "selected_user"
			}`}
			onClick={() => selectUser(user)}
		>
			<div className="user_info">
				<div className="user_detail">
					<img
						src={user.avatar || img}
						alt="Avatar"
						className="avatar"
					/>
					<h4>{user.name}</h4>
					{data?.from !== user1 && data?.uread && !data?.typing && (
						<small className="unread">New</small>
					)}
				</div>
				<div
					className={`user_status ${
						user.isOnline ? "online" : "offline"
					}`}
				></div>
			</div>
			{data && (
				<p className="truncate">
					<strong>
						{data?.from === user1 && !data?.typing && data?.text
							? "Me:"
							: null}
					</strong>
					{data.from !== user1 && data?.typing
						? "typing...."
						: data?.text}
				</p>
			)}
		</div>
	);
}

export default User;
