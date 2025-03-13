import { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
const AUTH_URL = "/api/auth/";
const FAMILY_URL = "/api/family/";
import AuthForm from "../../components/AuthForm/AuthForm";

export default function Auth() {

  // User context
  const { user, setUser, family, setFamily, setCreator } = useContext(UserContext);

  // navigation function
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);

  const [authType, setAuthType] = useState("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  let signInUserId = '';


  // User login function
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${AUTH_URL}login`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = {
          userId: response.data.user._id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          profilePic: response.data.user.profilePic ? response.data.user.profilePic : null,
          familyId: response.data.user.family
            ? response.data.user.family
            : null,
        };
        // Set user state and user local storage for data persistance
        setUser(userData);
        signInUserId = userData.userId;
        localStorage.setItem("user", JSON.stringify(userData));
        // Fetch user family and then navigate user to dashboard if they already have a family or to the family setup screen if they do not have a family
        if (userData.familyId !== null) {
          await fetchFamily(userData.familyId);
          navigate("/home");
        } else navigate("/familysetup");
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("No server response");
      } else if (error.response?.status === 400) {
        setErrorMsg("Incorrect email or password");
      }
    }
  };

  // User sign up function
  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${AUTH_URL}register`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        const userData = {
          userId: response.data.newUser._id,
          firstName: response.data.newUser.firstName,
          lastName: response.data.newUser.lastName,
          email: response.data.newUser.email,
          profilePic: null,
          familyId: null,
        };
        // Set user state and user local storage for data persistance
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // Navigate to family setup route
        navigate("/familysetup");
      }
    } catch (error) {
      if (!error?.response) {
        setErrorMsg("No server response");
      } else if (error.response?.status === 400) {
        setErrorMsg("Email is already registered");
      }
    }
  };

  const fetchFamily = async (familyId) => {
    
    try {
      const response = await axios.get(
        `${FAMILY_URL}${familyId}`,
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
        if (familyData.creator === signInUserId) setCreator(true);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  // Function to clear inputs after authType state change
  const clearInputs = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMsg("");
  };
    return (
      <>
        <AuthForm
          authType={authType}
          setAuthType={setAuthType}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          clearInputs={clearInputs}
          validFirstName={validFirstName}
          setValidFirstName={setValidFirstName}
          validLastName={validLastName}
          setValidLastName={setValidLastName}
          validEmail={validEmail}
          setValidEmail={setValidEmail}
          validPassword={validPassword}
          setValidPassword={setValidPassword}
          validConfirmPassword={validConfirmPassword}
          setValidConfirmPassword={setValidConfirmPassword}
          formStarted={formStarted}
          setFormStarted={setFormStarted}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
        />
      </>
    );
}
