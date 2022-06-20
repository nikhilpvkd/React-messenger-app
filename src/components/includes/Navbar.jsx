import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import image from "../../image1.jpg";

function Navbar() {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [avatar, setAvatar] = useState();

	const handleSignout = async () => {
		await updateDoc(doc(db, "users", auth.currentUser.uid), {
			isOnline: false,
		});
		await signOut(auth);
		navigate("/login");
	};

	useEffect(() => {
		if (user) {
			let unsub = onSnapshot(doc(db, "users", user.uid), (snapDoc) => {
				setAvatar(snapDoc.data().avatar);
			});
			return () => unsub;
		}
	}, [user]);
	return (
		<nav>
			<h3>
				<Link to="/">Messenger</Link>
			</h3>
			<div>
				{user ? (
					<div className="right">
						<Link to="/profile">
							<img
								src={avatar || image}
								alt="YOU"
								className="avatar"
							/>
						</Link>
						<button className="btn" onClick={handleSignout}>
							Log out
						</button>
					</div>
				) : (
					<>
						<Link to="/register">Register</Link>
						<Link to="/login">Log In</Link>
					</>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
