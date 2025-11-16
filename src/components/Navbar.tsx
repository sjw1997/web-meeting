import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import meetingLogo from "../assets/meetingLogo.png"
import "../css/Navbar.css"

const Navbar: React.FC = () => {
    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "black", display: "flex", alignItems: "center"}}>
                <img src={meetingLogo} alt="logo" className="meetingLogo" />
                会议管理系统
            </Link>
        </Header>
    )
};

export default Navbar;