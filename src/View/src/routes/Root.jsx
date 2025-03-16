import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "./userContext/UserContext";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  useEffect(() => {
      if (location.pathname === '/') {
        if (!user) navigate('/register');
        else navigate("/home");
      }
    }, [location]);

  return <Outlet />;
}
