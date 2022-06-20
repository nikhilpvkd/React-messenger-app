import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../../firebaseConfig";
import {
	query,
	collection,
	where,
	onSnapshot,
	Timestamp,
	orderBy,
	setDoc,
	doc,
	getDoc,
	updateDoc,
} from "firebase/firestore";
import {
	getDownloadURL,
	ref,
	uploadBytes,
	uploadBytesResumable,
} from "firebase/storage";
import User from "../includes/User";
import MessageForm from "../includes/MessageForm";
import Messages from "../includes/Messages";

function Home() {
	const [users, setUsers] = useState([]);
	const [chat, setChat] = useState();
	const [text, setText] = useState("");
	const [images, setImage] = useState([]);
	const [audio, setAudio] = useState("");
	const [msgs, setMsg] = useState([]);
	const [document, setDocument] = useState([]);
	const [upldPrgs, setUpld] = useState(0);
	const user1 = auth.currentUser.uid;

	useEffect(() => {
		const usersRef = collection(db, "users");
		// create query object
		const q = query(usersRef, where("uid", "not-in", [user1]));
		const unsub = onSnapshot(q, (querySnapshot) => {
			let users = [];
			querySnapshot.forEach((doc) => {
				users.push(doc.data());
			});
			setUsers(users);
		});
		return () => unsub;
	}, []);

	// useEffect(() => {
	// 	("got into useeffect...");
	// 	const updateMessage = async () => {
	// 		("got data...");
	// 	};
	// 	updateMessage();
	// }, [msgs]);
	const selectUser = async (user) => {
		setChat(user);
		const user2 = user.uid;
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
		const msgRef = collection(db, "messages", id, "chat");
		const q = query(msgRef, orderBy("createdAt", "asc"));

		onSnapshot(q, (querySnapshot) => {
			let msgs = [];
			querySnapshot.forEach((doc) => {
				msgs.push(doc.data());
			});
			setMsg(msgs);
		});
		const snapDoc = await getDoc(doc(db, "lastmsg", id));
		snapDoc.data();
		if (snapDoc.data() && snapDoc.data()?.from !== user1) {
			await updateDoc(doc(db, "lastmsg", id), {
				uread: false,
			});
		}
		// const chatRef = doc(db, "messages", id, "chat");
		// const chatMsg = await getDoc(chatRef);
		// (chatMsg.data());

		// await updateDoc(chatRef, {
		// 	uploading: true,
		// });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user2 = chat.uid;
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
		const createdAt = Timestamp.fromDate(new Date());
		const id2 = user1 + createdAt;

		if (images) {
			console.log(images);
			let urlArry = [];
			images.forEach((image) => {
				const imgRef = ref(
					storage,
					`images/${new Date().getTime()}-${image.name}`
				);
				const uploadTask = uploadBytesResumable(imgRef, image);
				console.log(uploadTask);
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, and resume
						// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

						setUpld(
							(snapshot.bytesTransferred / snapshot.totalBytes) *
								100
						);

						console.log("Upload is " + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						// Handle unsuccessful uploads
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then(
							(downloadURL) => {
								console.log(uploadTask.snapshot);
								const prgrss =
									(uploadTask.snapshot.bytesTransferred /
										uploadTask.snapshot.totalBytes) *
									100;
								console.log("File available at", downloadURL);
								urlArry.push(downloadURL);
								console.log("updatting img>>>>");
								updateDoc(doc(db, `messages/${id}/chat`, id2), {
									uploading: false,
									media: urlArry,
									prgrss,
								});
							}
						);
						// const snapDoc = getDoc(
						// 	doc(db, `messages/${id}/chat`, id2)
						// );
						// if (snapDoc.data()) {

						// }
					}
				);

				// const durl = await getDownloadURL(
				// 	ref(storage, snap.ref.fullPath)
				// );
				// console.log(durl);
			});
		}

		let audioUrl = "";

		if (audio) {
			setAudio("");
			const audioRef = ref(
				storage,
				`audio/${new Date().getTime()}-${audio.size}.mp3`
			);

			const snap = await uploadBytes(audioRef, audio);
			const dlurl = await getDownloadURL(ref(storage, snap.ref.fullPath));
			audioUrl = dlurl;
		}

		if (text || images || audio) {
			setText("");
			setImage("");

			await setDoc(doc(db, `messages/${id}/chat`, id2), {
				text,
				from: user1,
				to: user2,
				createdAt,
				media: [],
				voice: audioUrl || "",
				uread: true,
				uploading: true,
			});

			const snapDoc = await getDoc(doc(db, `messages/${id}/chat`, id2));
			if (snapDoc.data() && !images) {
				console.log("updating text....");
				await updateDoc(doc(db, `messages/${id}/chat`, id2), {
					uploading: false,
				});
			}
		}
		await setDoc(doc(db, "lastmsg", id), {
			text,
			from: user1,
			to: user2,
			createdAt,
			// media: urls || "",
			uread: true,
			typing: false,
		});
	};

	return (
		<div className="home_container">
			<div className="users_container">
				{users.map((user) => (
					<User
						key={user.uid}
						user={user}
						selectUser={selectUser}
						user1={user1}
						chat={chat}
					/>
				))}
			</div>
			<div className="messages_container">
				{chat ? (
					<>
						<div className="messages_user">
							<h3>{chat.name}</h3>
						</div>
						<div className="messages">
							{msgs.length
								? msgs.map((msg, i) => (
										<Messages
											key={i}
											msg={msg}
											user1={user1}
											user2={chat.uid}
											audio={audio}
											upldPrgs={upldPrgs}
										/>
								  ))
								: null}
						</div>
						{/* {images.map((image) => ( */}
						<MessageForm
							handleSubmit={handleSubmit}
							text={text}
							setText={setText}
							setImage={setImage}
							user1={user1}
							user2={chat.uid}
							images={images}
							setAudio={setAudio}
							audio={audio}
							setDocument={setDocument}
						/>
					</>
				) : (
					<h3 className="no_conv">
						select a user to start conversation
					</h3>
				)}
			</div>
		</div>
	);
}

export default Home;
