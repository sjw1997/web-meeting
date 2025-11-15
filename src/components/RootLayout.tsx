import { Layout } from "antd";
import Navbar from "./Navbar.tsx";

const { Content, Footer } = Layout;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ marginTop: 64 }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Web Meeting ©{new Date().getFullYear()} Created by Ant Design
      </Footer>
    </Layout>
  );
};

export default RootLayout;