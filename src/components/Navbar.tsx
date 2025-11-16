import React, { useState } from 'react';
import { Layout, Menu, type MenuProps } from 'antd';
import { 
  UserOutlined, ToolOutlined,
  UsergroupDeleteOutlined, VideoCameraOutlined,
  UsbOutlined, ExperimentOutlined
} from '@ant-design/icons';
import meetingLogo from '../assets/meeting.png';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/auth';
const { Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const Navbar: React.FC = () => {
  const { isAuthenticated, username } = useAuth();

  const [current, setCurrent] = useState('');

  const userItems: MenuItem[] = [
    {
      key: 'meetingMananger',
      label: '会议管理',
      icon: <ToolOutlined />,
      children: [
        {
          key: 'bookMeeting',
          label: '预订会议',
        },
        {
          key: 'myBookings',
          label: '我的预订',
        },
        {
          key: 'leaveRequests',
          label: '请假审批',
        },
        {
          key: 'weeklyMeetings',
          label: '每周例会',
        },
      ],
    },
    {
      key: 'myMeetings',
      label: '我的会议',
      icon: <UsergroupDeleteOutlined />,
      children: [
        {
          key: 'meetingSchedule',
          label: '会议安排',
        },
        {
          key: 'videoMeeting',
          label: '视频会议',
        },
      ],
    },
    {
      key: 'meetingMonitor',
      label: '会议监控',
      icon: <VideoCameraOutlined />,
      children: [
        {
          key: 'attendanceRecord',
          label: '签到记录',
        },
        {
          key: 'Abnormal personnel',
          label: '异常人员',
        },
      ],
    },
    {
      key: 'groupManager',
      label: '群组管理',
      icon: <UsbOutlined />,
      children: [
        {
          key: 'myGroup',
          label: '我的群组',
        },
      ],
    },
    {
      key: 'others',
      label: '其他',
      icon: <ExperimentOutlined />,
      children: [
        {
          key: 'equipmentRepair',
          label: '设备维修',
        },
        {
          key: 'openDoorApply',
          label: '开门申请',
        },
      ],
    },
    {
      key: 'user',
      label: username,
      icon: <UserOutlined />,
      children: [
        {
          key: 'myProfile',
          label: '我的资料',
        },
        {
          key: 'logout',
          label: "退出登录",
        },
      ]
    },
  ];


  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      window.location.reload();
    }
  };

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
      <Link to="/">
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={meetingLogo} className="meeting-logo" />
          <span style={{ color: "black", fontSize: "1.5em" }}>会议管理系统</span>
        </span>
      </Link>
      {
        isAuthenticated && (
          <Menu
            onClick={onClick} selectedKeys={[current]} mode="horizontal" 
            items={ userItems } style={{ marginLeft: 'auto' }} />
        )
      }
    </Header>
  );
};

export default Navbar;