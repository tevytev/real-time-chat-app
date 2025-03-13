import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";
import FamilyForm from "../../components/FamilyForm/FamilyForm";
import axios from "../../api/axios";
const FAMILY_URL = "/api/family/";

export default function FamilySetup() {
  const navigate = useNavigate();

  const [familyName, setFamilyName] = useState("");
  const [validFamilyName, setValidFamilyName] = useState(false);
  const [familyAccessCode, setFamilyAccessCode] = useState("");
  const [startOrJoin, setStartOrJoin] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  // User context
  const { user, setUser, family, setFamily, setCreator } = useContext(UserContext);

  useEffect(() => {
    if (!user.userId) navigate("/register");

    return () => {};
  }, [user]);

  const fetchFamily = async (e) => {
    e.preventDefault();

    // If user wants to start a family, create family and set UserContext family to returned new family object
    if (startOrJoin === "start") {

      const startFormData = {
        familyAccessCode: familyAccessCode,
        familyName: familyName,
      };

      try {
        const response = await axios.post(
          FAMILY_URL,
          JSON.stringify(startFormData),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 201) {
          const familyData = {
            familyId: response.data._id,
            familyAccessCode: response.data.familyAccessCode,
            familyName: response.data.familyName,
            livingRoomId: response.data.livingRoomId,
            members: response.data.members,
            creator: response.data.creator
          };

          setCreator(true);
          setFamily(familyData);
          localStorage.setItem("family", JSON.stringify(familyData));
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
      // if user wants to join a family, add user to existing family in database and set UserContext family state to returned family object
    } else if (startOrJoin === "join") {
      const joinFormData = {
        familyAccessCode: familyAccessCode,
        familyName: familyName,
      };
      try {
        const response = await axios.post(
          `${FAMILY_URL}/join`,
          JSON.stringify(joinFormData),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const familyData = {
            familyId: response.data._id,
            familyAccessCode: response.data.familyAccessCode,
            familyName: response.data.familyName,
            livingRoomId: response.data.livingRoomId,
            members: response.data.members,
            creator: response.data.creator
          };

          setFamily(familyData);
          localStorage.setItem("family", JSON.stringify(familyData));
          setCreator(false);
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const getFormData = {
        familyId: user.familyId,
      };
      try {
        const response = await axios.get(
          `${FAMILY_URL}${user.familyId}`,
          JSON.stringify(getFormData),
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log(response);
          const familyData = {
            familyId: response.data._id,
            familyAccessCode: response.data.familyAccessCode,
            familyName: response.data.familyName,
            livingRoomId: response.data.livingRoomId,
            members: response.data.members,
            creator: response.data.creator
          };

          setFamily(familyData);
          localStorage.setItem("family", JSON.stringify(familyData));
          navigate("/home");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <FamilyForm
        startOrJoin={startOrJoin}
        setStartOrJoin={setStartOrJoin}
        familyName={familyName}
        setFamilyName={setFamilyName}
        familyAccessCode={familyAccessCode}
        setFamilyAccessCode={setFamilyAccessCode}
        fetchFamily={fetchFamily}
        validFamilyName={validFamilyName}
        setValidFamilyName={setValidFamilyName}
      />
    </>
  );
}
