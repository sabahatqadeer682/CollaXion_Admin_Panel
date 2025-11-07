import React from "react";
import { Link } from "react-router-dom";

const Drawer = ({ links }) => {
    return (
        <div style={styles.drawer}>
            {links.map((link) => (
                <Link key={link.path} to={link.path} style={styles.link}>
                    {link.label}
                </Link>
            ))}
        </div>
    );
};

const styles = {
    drawer: {
        width: "220px",
        backgroundColor: "#1a1a2e",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "30px",
        position: "fixed",
        left: 0,
    },
    link: {
        padding: "15px 20px",
        color: "white",
        textDecoration: "none",
        fontSize: "16px",
        borderBottom: "1px solid #333",
    },
};

export default Drawer;
