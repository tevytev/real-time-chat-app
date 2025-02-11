import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../routes/userContext/UserContext";
import axios from "../../../api/axios";
import "./ProfilePictureSetting.css";
const USER_URL = "/api/user/";
import pfp from "../../../assets/pfp.jpg";

export default function ProfilePictureSetting(props) {
  const { user, setUser } = useContext(UserContext);

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState("Save");
  const [error, setError] = useState("");
  const [pfp, setPfp] = useState(user.profilePic ? user.profilePic : null);

  const handleFileChange = (e) => {
    const input = document.getElementById("file-upload");
    const file = input.files[0];
    const objectURL = URL.createObjectURL(file);
    setPfp(objectURL);

    if (file) {
      const fileType = ["image/jpeg", "image/png", "image/jpg"];

      if (fileType.includes(file.type)) {
        setError("");
        setImage(file);
      } else {
        setError("Error: Please upload a valid image file (JPG, JPEG, PNG)");
        setImage(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${USER_URL}${user.userId}/profilpic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data);

        const userResponse = await axios.get(
          `${USER_URL}${user.userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        const userData = {
            userId: userResponse.data._id,
            firstName: userResponse.data.firstName,
            lastName: userResponse.data.lastName,
            email: userResponse.data.email,
            profilePic: userResponse.data.profilePic,
            familyId: userResponse.data.family,
          };
        // Set user state and user local storage for data persistance
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelPfpUpdate = (e) => {
    const input = document.getElementById("file-upload");
    input.files = null;
    setImage(null);
    setPfp(user.profilePic ? user.profilePic : <></>);
  };

  return (
    <>
      <div className="pfp-main-container">
        <div className={pfp ? "pfp" : "default-pfp"}>
            {pfp ? <img src={pfp} alt="" /> : <p>{user.firstName ? user.firstName[0] : <></>}</p>}
        </div>
        <button
          onMouseOver={(e) => {
            if (!image) setUploadStatus("Please Select an Image");
          }}
          onMouseLeave={(e) => {
            if (!image) setUploadStatus("Save");
          }}
          onClick={handleUpload}
          disabled={image ? false : true}
          className="upload-btn"
        >
          {uploadStatus}
        </button>
        {image ? (
          <button onClick={cancelPfpUpdate} className="setting-btn">
            Cancel
          </button>
        ) : (
          <></>
        )}
        {error ? (
          <div className="pfp-error-container">
            <p>{error}</p>
          </div>
        ) : (
          <></>
        )}
        <label for="file-upload" class="custom-file-upload">
          Change Profile Picture
        </label>
        <input onChange={handleFileChange} id="file-upload" type="file" />
        <button className="setting-btn">Remove Profile Picture</button>
      </div>
    </>
  );
}
