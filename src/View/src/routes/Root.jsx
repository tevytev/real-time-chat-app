import { Outlet } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Root() {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/') navigate('/register');
      }, [location]);

    return (
        <>
        <Outlet />
        </>
    )
}