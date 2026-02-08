import { Link } from "react-router-dom";
import LogoutBtn from "../components/home/LogoutBtn";

const Home = () => {

    return (
        <div>
            Home
            <Link to = '/dashboard'>
                <button>To Dashboard</button>
            </Link>
            <Link to = '/login'>
                <button>To Login</button>
            </Link>
            <LogoutBtn />
        </div>

    )
} 

export default Home;