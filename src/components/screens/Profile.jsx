import React, { useEffect, useState } from "react";
import { storage, db, auth } from "../../firebaseConfig";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import image from "../../image1.jpg";
import Camera from "../svg/Camera";
import Delete from "../svg/Delete";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const [img, setImage] = useState("");
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(null);
	const navigate = useNavigate();
	useEffect(() => {
		getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
			setUser(docSnap.data());
		});
		if (img) {
			const uploadImg = async () => {
				setLoading(true);
				const imageRef = ref(
					storage,
					`avatar/${img.name}-${new Date().getTime()}`
				);
				try {
					if (user.avatar) {
						await deleteObject(ref(storage, user.avatarPath));
					}
					const snap = await uploadBytes(imageRef, img);
					const url = await getDownloadURL(
						ref(storage, snap.ref.fullPath)
					);

					await updateDoc(doc(db, "users", auth.currentUser.uid), {
						avatar: url,
						avatarPath: snap.ref.fullPath,
					});
					setLoading(false);
					setImage("");
				} catch (err) {
					console.log(err.message);
				}
			};
			uploadImg();
		}
	}, [img]);
	const deleteImage = async () => {
		try {
			const confirm = window.confirm("Delete avatar ?");
			if (confirm) {
				await deleteObject(ref(storage, user.avatarPath));
				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					avatar: "",
					avatarPath: "",
				});
				navigate("/");
			}
		} catch (err) {
			console.log(err.message);
		}
	};
	return (
		user && (
			<section>
				<div className="profile_container">
					<div className="img_container">
						{loading ? (
							"loading.."
						) : (
							<img src={user.avatar || image} alt="Avatar" />
						)}

						<div className="overlay">
							<div>
								<label htmlFor="photo">
									<Camera />
								</label>
								{user.avatar && (
									<Delete deleteImage={deleteImage} />
								)}
								<input
									type="file"
									accept="image/*"
									id="photo"
									style={{ display: "none" }}
									onChange={(e) =>
										setImage(e.target.files[0])
									}
								/>
							</div>
						</div>
					</div>
					<div className="text_container">
						<h3>{user.name}</h3>
						<p>{user.email}</p>
						<hr />
						<small>
							Joined on:{user.createdAt.toDate().toDateString()}
						</small>
					</div>
				</div>
			</section>
		)
	);
};

export default Profile;
