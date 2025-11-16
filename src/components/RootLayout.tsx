import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import Navbar from "./Navbar";

const RootLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <Layout style={{minHeight: '100vh'}}>
        <Navbar />
        <Content style={{ marginTop: 64 }}>{children}</Content>
        <Footer>
            <p>Copyright © 2023</p>
        </Footer>
        </Layout>
    )
}

export default RootLayout;