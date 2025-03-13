import "./UserStatus.css";
import UserStatusCard from "../Status/UserStatusCard/UserStatusCard";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../routes/userContext/UserContext";
import axios from "../../api/axios";
const USER_STATUS_URL = "/api/user/"

export default function UserStatus() {

  const { user, setUser, rooms, setRooms, activeTab } =
    useContext(UserContext);

  const [mood, setMood] = useState(null);
  const [feelings, setFeelings] = useState("");
  const [availability, setAvailability] = useState("")
  const [thoughts, setThoughts] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {

    const fetchUserStatus = async () => {

      try {
        const response = await axios.get(`${USER_STATUS_URL}/${user.userId}/status`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          const statusData = response.data;
          setMood(statusData.mood);
          setFeelings(statusData.feelings);
          setAvailability(statusData.availability);
          setThoughts(statusData.thoughts);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserStatus();
  }, [])

  return (
    <>
      <section id="user-status" className="user-status-container">
        <div className="user-status-header-container">
          <h2>YOUR STATUS</h2>
        </div>
        <UserStatusCard user={user} mood={mood} setMood={setMood} feelings={feelings} setFeelings={setFeelings} thoughts={thoughts} availability={availability} setAvailability={setAvailability} setThoughts={setThoughts} edit={edit} setEdit={setEdit} />
        
      </section>
    </>
  );
}
