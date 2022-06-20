import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/screens/Home";
import Navbar from "./components/includes/Navbar";
import Register from "./components/screens/Register";
import Login from "./components/screens/Login";
import AuthProvider from "./components/context/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/screens/Profile";
function App() {
	return (
		<AuthProvider>
			<Router>
				<Navbar />
				<Routes>
					<Route
						exact
						path="/"
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route exact path="/register" element={<Register />} />
					<Route exact path="/login" element={<Login />} />
					<Route
						exact
						path="/profile"
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
