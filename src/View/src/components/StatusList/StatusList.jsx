import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../routes/userContext/UserContext";
import FamilyStatusCard from "../Status/FamilyStatusCard/FamilyStatusCard";
import axios from "../../api/axios";
const FAMILY_URL = "/api/family/";
import "./StatusList.css";

export default function StatusList(props) {
  const { family, setActiveTab, getRefreshToken } = useContext(UserContext);

  const { setActiveRoomId } = props;

  const [statusCards, setStatusCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    const fetchStatusCards = async () => {
      setLoadingCards(true);

      try {
        const response = await axios.get(
          `${FAMILY_URL}${family.familyId}/status`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const statusData = response.data;
          setStatusCards(statusData);
          setLoadingCards(false);
        }
      } catch (error) {
        if (!error?.response) {
          console.log("No server response");
        } else if (error.response?.status === 401) {
          getRefreshToken(fetchStatusCards);
        } else if (error.response?.status === 500) {
          setLoadingCards(true);
          alert("Server error has occured: Failed to load statuses");
        } else {
          console.error("An error occured:", error);
        }
      }
    };

    fetchStatusCards();
  }, []);

  if (loadingCards) {
    return (
      <>
        <section className="status-list-outer-container">
          <div className="status-list-header-container">
            <h2></h2>
          </div>
          <div className="loading-status-list-container">
          <div className="loader"></div>
          </div>
        </section>
      </>
    );
  } else if (statusCards.length) {
    return (
      <>
        <section className="status-list-outer-container">
          <div className="status-list-header-container">
            <h2>{family.familyName} Family</h2>
          </div>
          <div className="status-list-container">
            {statusCards.map((status) => {
              return (
                <FamilyStatusCard
                  setActiveRoomId={setActiveRoomId}
                  setActiveTab={setActiveTab}
                  mood={status.mood}
                  feelings={status.feelings}
                  availability={status.availability}
                  thoughts={status.thoughts}
                  firstName={status.firstName}
                  userId={status.user}
                  roomId={status.roomId}
                  profilePic={status.profilePic}
                  key={`status-list-item-${status.user}`}
                />
              );
            })}
          </div>
        </section>
      </>
    );
  } else {
    return (
      <>
        <section className="status-list-outer-container">
          <div className="status-list-header-container">
            <h2>{family.familyName} Family</h2>
          </div>
          <div className="empty-status-list-container">
            <p>No statuses to show, you need family members.</p>
          </div>
        </section>
      </>
    );
  }
}
