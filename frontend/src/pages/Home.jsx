import { Link } from "react-router-dom";

const Home = () => {

    return (
        <div>
            Home
            <Link to = '/dashboard'>
                <button>To Dashboard</button>
            </Link>
        </div>

    )
} 

export default Home;