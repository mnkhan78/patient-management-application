import React from "react";
// import "./footer.css";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>
                © {year} PMA | Designed & Developed by <strong>Mohammed Naseem Khan</strong> 
            </p>
        </footer>
    );
};

export default Footer;