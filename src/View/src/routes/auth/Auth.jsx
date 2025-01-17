import { useState, useEffect, useContext } from "react";
import { UserContext } from "../userContext/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
const LOGIN_URL = "/api/auth/login";
import AuthForm from "../../components/AuthForm/AuthForm"

export default function Auth() {

  // navigation function
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState("login");

  const { user, setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = {
          userId: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          familyId: response.data.user.family ? response.data.user.family : null
        }
        console.log(response);
        console.log(userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate("/home");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <AuthForm
        authType={authType}
        setAuthType={setAuthType}
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        clearInputs={clearInputs}
      />
    </>
  );
}
