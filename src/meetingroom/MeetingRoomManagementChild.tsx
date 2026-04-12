import { Table } from 'antd'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义


interface MeetingRoomFullInfo {
  id: number;
  name: string;
  number: string;
  location: string;
  capacity: number;
  available: boolean;
  isFree: boolean;
  deviceIds: number[];
  departmentIds: number[];
}

const MeetingRoomManagementChild: React.FC = () => {
  const [dataSource, setDataSource] = useState<MeetingRoomFullInfo[]>([]);

  const columns: ColumnsType<MeetingRoomFullInfo> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '编号',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '地址',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: '启用状态',
      dataIndex: 'available',
      key: 'available',
      render: (available: boolean) => (available ? '启用' : '禁用'),
    },
    {
      title: '目前状态',
      dataIndex: 'isFree',
      key: 'isFree',
      render: (isFree: boolean) => (isFree ? '空闲' : '使用中'),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <span>
          <a style={{ marginRight: 8 }}>编辑</a>
          <a style={{ marginRight: 8 }}>删除</a>
          {
            record.available ? (
              <a style={{ marginRight: 8 }}>禁用</a>
            ) : (
              <a style={{ marginRight: 8 }}>启用</a>
            )
          }
        </span>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/meeting_room/get');
      console.log(response.data);
      setDataSource(response.data.meetingRooms);
    };
    fetchData();
  }, []);

  return (
    <>
      <Table dataSource={dataSource} columns={columns} rowKey="id"/>;
    </>
  )
};

export default MeetingRoomManagementChild;