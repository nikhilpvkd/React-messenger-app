import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
function Login() {
	const { user } = useContext(AuthContext);
	const [data, setData] = useState({
		email: "",
		password: "",
		error: null,
		loading: false,
	});
	const { email, password, error, loading } = data;
	const navigate = useNavigate();
	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		// (data);
		setData({ ...data, error: null, loading: true });
		if (!email || !password) {
			setData({ ...data, error: "All feilds are required" });
		} else {
			try {
				const result = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);

				await updateDoc(doc(db, "users", result.user.uid), {
					signedInAt: Timestamp.fromDate(new Date()),
					isOnline: true,
				});
				setData({
					email: "",
					password: "",
					error: null,
					loading: false,
				});
				navigate("/");
			} catch (err) {
				setData({ ...data, error: err.message });
			}
		}
	};
	return user ? (
		<Navigate to="/" />
	) : (
		<section>
			<h3>Log in to accound</h3>
			<form className="form" onSubmit={handleSubmit}>
				<div className="input_container">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={handleChange}
					/>
				</div>
				<div className="input_container">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={handleChange}
					/>
				</div>
				{data.error && <p className="error">{error}</p>}
				<div className="btn_container">
					<button className="btn" type="submit">
						{loading ? "Loging in..." : "Login"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default Login;
