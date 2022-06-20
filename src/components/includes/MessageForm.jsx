import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import Attachment from "../svg/Attachment";
import Cross from "../svg/Cross";
import Microphone from "../svg/Microphone";
import image from "../../image1.jpg";
const MessageForm = ({
	handleSubmit,
	text,
	setText,
	images,
	setImage,
	setAudio,
	user1,
	user2,
}) => {
	const MicRecorder = require("mic-recorder-to-mp3");
	const [preview, setPreview] = useState(false);

	// New instance
	const recorder = new MicRecorder({
		bitRate: 128,
	});

	const [audioScrn, setAudioScrn] = useState(false);
	var imgArray = [];

	const handlePreview = () => {
		console.log(images);
		let preImgs = [];
		images.forEach((img) => {
			console.log(URL.createObjectURL(img));
			preImgs.push(URL.createObjectURL(img));
		});
		console.log(preImgs);
		return preImgs.map((preImg, i) => (
			<div className="preview_item">
				<Cross dltPreview={dltPreview} i={i} />
				<img src={preImg} className="preview_image" />
			</div>
		));
	};
	const imageSend = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setPreview(true);
			for (let i = 0; i < e.target.files.length; i++) {
				imgArray.push(e.target.files[i]);
			}
		}
		console.log(imgArray[0].name);
		setImage(imgArray);
	};
	const dltPreview = (i) => {
		console.log("got into dlt....");
		console.log(i);
		const filtered = images.filter((item, index) => {
			return i !== index;
		});
		console.log(filtered.length);
		if (filtered.length <= 0) {
			setPreview(false);
			setImage("");
		} else {
			setImage(filtered);
		}
	};
	const handleWriting = async (e) => {
		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
		setText(e.target.value);
		await updateDoc(doc(db, "lastmsg", id), {
			to: user2,
			from: user1,
			typing: true,
		});
	};
	const startRecording = () => {
		recorder
			.start()
			.then(() => {})
			.catch((e) => {
				console.error(e);
			});
	};
	const stopRecording = () => {
		recorder
			.stop()
			.getMp3()
			.then(([buffer, blob]) => {
				// do what ever you want with buffer and blob
				// Example: Create a mp3 file and play
				const file = new File(buffer, "me-at-thevoice.mp3", {
					type: blob.type,
					lastModified: Date.now(),
				});
				setAudio(file);
			})
			.catch((e) => {
				alert("We could not retrieve your message");
			});
	};

	return (
		<div className="form_container">
			<form
				className="message_form"
				onSubmit={(e) => (
					handleSubmit(e), setAudioScrn(false), setPreview(false)
				)}
			>
				{preview && (
					<div className="preview_container">{handlePreview()}</div>
				)}
				<div className="recorder">
					<Microphone setAudioScrn={setAudioScrn} />
				</div>
				<label htmlFor="img">
					<Attachment />
				</label>
				<input
					type="file"
					id="img"
					accept="image/*"
					style={{ display: "none" }}
					onChange={imageSend}
					multiple="multiple"
				/>
				<div>
					<input
						type="text"
						placeholder="Enter Message"
						value={text}
						onChange={handleWriting}
					/>
				</div>
				<div>
					<button className="btn">Send</button>
				</div>
			</form>
			{audioScrn && (
				<div className="audio_screen">
					<button onClick={startRecording}>Start</button>
					<button onClick={stopRecording}>Stop</button>
					{
						<button
							onClick={() => (
								setAudio(null), setAudioScrn(false)
							)}
						>
							delete
						</button>
					}
				</div>
			)}
		</div>
	);
};

export default MessageForm;
