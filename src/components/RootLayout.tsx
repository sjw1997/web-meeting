import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <Layout style={{minHeight: '100vh'}}>
        <Navbar />
        <Content style={{ marginTop: 64 }}><Outlet /></Content>
        <Footer>
            <p>Copyright © 2023</p>
        </Footer>
        </Layout>
    )
}

export default RootLayout;