import { Outlet } from "react-router-dom";
import { useLocation } from 'react-router-dom';

export default function Root() {

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') navigate('/home');
      }, [location]);

    return (
        <>
        <Outlet />
        </>
    )
}