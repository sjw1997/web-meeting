import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";
import meetingLogo from "../assets/meetingLogo.png"
import "../css/Navbar.css"
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useState } from "react";
import { 
  UserOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  MonitorOutlined,
  TeamOutlined,
  ToolOutlined,
  KeyOutlined,
  LogoutOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  VideoCameraAddOutlined
} from '@ant-design/icons';
import { useAuth } from "../auth/auth";

const Navbar: React.FC = () => {
    type MenuItem = Required<MenuProps>['items'][number];

    const { isAuthenticated, username } = useAuth()

    const items: MenuItem[] = [
      {
        label: '会议管理',
        key: 'meetingManagement',
        icon: <CalendarOutlined />,
        children: [
          {
            label: '预定会议',
            key: 'orderMeeting',
            icon: <CheckCircleOutlined />
          },
          {
            label: '我的预定',
            key: 'myOrder',
            icon: <FileTextOutlined />
          },
          {
            label: '请假审批',
            key: 'leaveApproval',
            icon: <KeyOutlined />
          },
          {
            label: '每日例会',
            key: 'standupMeeting',
            icon: <VideoCameraAddOutlined />
          },
        ],
      },
      {
        label: '我的会议',
        key: 'myMeeting',
        icon: <VideoCameraOutlined />,
        children: [
          {
            label: '会议安排',
            key: 'meetingSchedule',
            icon: <CalendarOutlined />
          },
          {
            label: '视频会议',
            key: 'videoMeeting',
            icon: <VideoCameraOutlined />
          },
        ],
      },
      {
        label: '会议监控',
        key: 'meetingMonitor',
        icon: <MonitorOutlined />,
        children: [
          {
            label: '签到记录',
            key: 'attendanceRecord',
            icon: <CheckCircleOutlined />
          },
          {
            label: '异常人员',
            key: 'abortPerson',
            icon: <UserOutlined />
          },
        ],
      },
      {
        label: "群组管理",
        key: "groupManagement",
        icon: <TeamOutlined />,
        children: [
          {
            label: "我的群组",
            key: "myGroup",
            icon: <TeamOutlined />
          }
        ]
      },
      {
        label: "其他",
        key: "others",
        icon: <ToolOutlined />,
        children: [
          {
            label: "设备保修",
            key: "equipmentRepair",
            icon: <ToolOutlined />
          },
          {
            label: "开门申请",
            key: "openDoorApply",
            icon: <KeyOutlined />
          }
        ]
      },
      {
        label: username,
        key: "username",
        icon: <UserOutlined />,
        children: [
          {
            label: "退出",
            key: "logout",
            icon: <LogoutOutlined />
          }
        ]
      }
    ];

    const [current, setCurrent] = useState('meetingManagement');

    const onClick: MenuProps['onClick'] = (e) => {
      setCurrent(e.key);
      if (e.key == "logout") {
        localStorage.removeItem("token");
        window.location.replace("/");
      }
    };

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'  }}>
            <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "black", display: "flex", alignItems: "center"}}>
                <img src={meetingLogo} alt="logo" className="meetingLogo" />
                会议管理系统
            </Link>
            {
              isAuthenticated &&
              <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            }
        </Header>
    )
};

export default Navbar;