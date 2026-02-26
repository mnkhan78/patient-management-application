import { Link } from "react-router-dom";
import AuthButton from "../components/home/AuthButton";
import Footer from "../components/home/Footer";
import '../style/home.css';

const Home = () => {

    return (
        <div className="home-container">
            <AuthButton />
            <div className="home-content">
                <h1 className="home-title">Welcome to Patient Management System</h1>
                <p className="home-subtitle">Manage your patients efficiently and securely</p>
                <div className="home-buttons">
                    <Link to='/dashboard'>
                        <button className="home-primary-btn">Dashboard</button>
                    </Link>

                    <Link to='/signup'>
                        <button className="home-secondary-btn">Signup</button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default Home;