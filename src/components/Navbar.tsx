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
  VideoCameraAddOutlined,
  UsergroupAddOutlined,
  ApartmentOutlined,
  IdcardOutlined,
  UserSwitchOutlined,
  BankOutlined,
  DesktopOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  SmileOutlined,
  ScheduleOutlined,
  ReloadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useAuth } from "../auth/auth";

const Navbar: React.FC = () => {
    type MenuItem = Required<MenuProps>['items'][number];

    const { isAuthenticated, username, isAdmin } = useAuth()
    const [ isNoramlMode, setIsNoramlMode ] = useState(true);

    const userMenuItem = {
        label: username,
        key: "username",
        icon: <UserOutlined />,
        children: [
          ...(isAdmin ? [
            {
              label: "切换模式",
              key: "switchMode",
              icon: <ToolOutlined />,
              children: [
                {
                  label: "用户模式",
                  key: "normalMode",
                  icon: <UserOutlined />
                },
                {
                  label: "管理员模式",
                  key: "adminMode",
                  icon: <TeamOutlined />
                }
              ]
            }
          ] : []),
          {
            label: "退出",
            key: "logout",
            icon: <LogoutOutlined />
          }
        ]
      };

    const adminModelItems: MenuItem[] = [
      {
        label: "用户管理",
        key: "userManagement",
        icon: <UsergroupAddOutlined />,
        children: [
          {
            label: "部门管理",
            key: "departmentManagement",
            icon: <ApartmentOutlined />
          },
          {
            label: "角色管理",
            key: "roleManagement",
            icon: <IdcardOutlined />
          },
          {
            label: "员工管理",
            key: "employeeManagement",
            icon: <UserSwitchOutlined />
          }
        ]
      },
      {
        label: "会议室管理",
        key: "meetingRoomManagementParent",
        icon: <BankOutlined />,
        children: [
          {
            label: "设备管理",
            key: "deviceManagement",
            icon: <DesktopOutlined />
          },
          {
            label: "会议室管理",
            key: "meetingRoomManagementChild",
            icon: <VideoCameraOutlined />
          },
          {
            label: "参数管理",
            key: "parameterManagement",
            icon: <SettingOutlined />
          },
          {
            label: "设备保修管理",
            key: "deviceRepairManagement",
            icon: <ToolOutlined />
          },
          {
            label: "门禁权限管理",
            key: "doorAccessPermissionManagement",
            icon: <SecurityScanOutlined />
          },
          {
            label: "文件管理",
            key: "fileManagement",
            icon: <FileTextOutlined />
          }
        ]
      },
      {
        label: "面部信息管理",
        key: "faceInfoManagement",
        icon: <SmileOutlined />
      },
      {
        label: "会议管理",
        key: "meetingManagementParent",
        icon: <CalendarOutlined />,
        children: [
          {
            label: "会议管理",
            key: "meetingManagementChild",
            icon: <ScheduleOutlined />
          },
          {
            label: "每周例会管理",
            key: "weeklyMeetingManagement",
            icon: <ReloadOutlined />
          },
          {
            label: "预定会议",
            key: "orderMeeting",
            icon: <CheckCircleOutlined />
          }
        ]
      },
      {
        label: "数据分析",
        key: "dataAnalysis",
        icon: <BarChartOutlined />
      },
      userMenuItem
    ];

    const noramlModelItems: MenuItem[] = [
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
      userMenuItem
    ];

    const [current, setCurrent] = useState('meetingManagement');

    const onClick: MenuProps['onClick'] = (e) => {
      setCurrent(e.key);
      if (e.key == "logout") {
        localStorage.removeItem("token");
        window.location.replace("/");
      } else if (e.key == "normalMode") {
        setIsNoramlMode(true);
      } else if (e.key == "adminMode") {
        setIsNoramlMode(false);
      }
    };

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between'  }}>
            <Link to="/" style={{ fontSize: "20px", fontWeight: "bold", color: "black", display: "flex", alignItems: "center"}}>
                <img src={meetingLogo} alt="logo" className="meetingLogo" />
                会议管理系统{isNoramlMode ? "" : " - 管理员模式"}
            </Link>
            {
              isAuthenticated &&
              <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={ isNoramlMode ? noramlModelItems : adminModelItems } disabledOverflow={true} />
            }
        </Header>
    )
};

export default Navbar;