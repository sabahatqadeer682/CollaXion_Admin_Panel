import React, { useState } from "react";
import Drawer from "./Drawer";

const InternshipDashboard = () => {
    const [content, setContent] = useState("Welcome, Internship Incharge!");

    const handleClick = (text) => setContent(text);

    const links = [
        { label: "Receive Internship Requests", path: "#" },
        { label: "Approve / Reject Requests", path: "#" },
        { label: "Forward to Industry Liaison", path: "#" },
        { label: "View Internship Status", path: "#" },
    ];

    return (
        <div style={{ display: "flex" }}>
            <Drawer links={links} />
            <div style={styles.main}>
                <h2>{content}</h2>
                <div style={styles.actions}>
                    {links.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleClick(item.label)}
                            style={styles.btn}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    main: { marginLeft: "240px", padding: "30px" },
    actions: { display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" },
    btn: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        textAlign: "left",
        width: "300px",
    },
};

export default InternshipDashboard;
