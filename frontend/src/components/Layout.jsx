import Sidebar from "./Sidebar";
import BottomNavigation from "./BottomNavigation";
import "./styles/layout.css";

const Layout = ({ children, user }) => {

    return (
        <div className="app-layout">

            <Sidebar user={user} />

            <main className="app-main">

                {children}

            </main>

            <BottomNavigation user={user} />

        </div>
    );
};

export default Layout;