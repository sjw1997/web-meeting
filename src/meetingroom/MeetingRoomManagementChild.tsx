import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Table, Typography, message } from 'antd'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义
import type { DeviceInfo } from '../device/DeviceManagement';
import type { DepartmentInfo } from '../user/DepartmentManagement';

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
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

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
          <a style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>编辑</a>
          <a style={{ marginRight: 8 }} onClick={() => handleDelete(record)}>删除</a>
          {
            record.available ? (
              <a style={{ marginRight: 8 }} onClick={() => handleEnableOrDisable(record)}>禁用</a>
            ) : (
              <a style={{ marginRight: 8 }} onClick={() => handleEnableOrDisable(record)}>启用</a>
            )
          }
        </span>
      )
    }
  ];

  const fetchData = async () => {
    const response = await axios.get('/api/meeting_room/get');
    setDataSource(response.data.meetingRooms);

    const deviceResponse = await axios.get('/api/device/get');
    setDevices(deviceResponse.data.devices);

    const departmentResponse = await axios.get('/api/department/get');
    setDepartments(departmentResponse.data.departments);
  };

  const handleEnableOrDisable = async (record: MeetingRoomFullInfo) => {
    Modal.confirm({
      title: record.available ? '禁用会议室' : '启用会议室',
      content: `确定要${record.available ? '禁用' : '启用'}会议室 ${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.post(`/api/meeting_room/${record.available ? 'forbid' : 'enable'}/${record.id}`);
          if (response.data.success) {
            messageApi.success(`成功${record.available ? '禁用' : '启用'}会议室 ${record.name}`);
            fetchData();
          } else {
            messageApi.error(`${response.data.message} 失败${record.available ? '禁用' : '启用'}会议室 ${record.name}`);
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || `失败${record.available ? '禁用' : '启用'}会议室 ${record.name}`}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || `失败${record.available ? '禁用' : '启用'}会议室 ${record.name}`}`);
          }
        }
      }
    });
  }

  const handleDelete = async (record: MeetingRoomFullInfo) => {
    Modal.confirm({
      title: '删除会议室',
      content: `确定要删除会议室 ${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/meeting_room/delete/${record.id}`);
          if (response.data.success) {
            messageApi.success(`成功删除会议室 ${record.name}`);
            fetchData();
          } else {
            messageApi.error(`${response.data.message} 删除会议室 ${record.name} 失败`);
          }
        } catch (error: unknown) { 
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || `删除会议室 ${record.name} 失败`}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || `删除会议室 ${record.name} 失败`}`);
          }
        }
      }
    })
  }

  const handleAddOrEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'add') {
        const response = await axios.post('/api/meeting_room/add', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('添加会议室成功');
        } else {
          messageApi.error(`${response.data.message} 添加会议室失败`);
        }
      } else if (modalMode === 'edit') {
        const response = await axios.put('/api/meeting_room/update', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('编辑会议室成功');
        } else {
          messageApi.error(`${response.data.message} 编辑会议室失败`);
        }
      }
    } catch (error: unknown) { 
      if (axios.isAxiosError(error)) {
        messageApi.error(`${error.response?.data?.message || '添加/编辑会议室失败'}`);
      } else if (error instanceof Error) {
        messageApi.error(`${error.message || '添加/编辑会议室失败'}`);
      }
    }
  }

  const handleAdd = () => {
    setModalMode('add');
    form.resetFields();
    setIsModalOpen(true);
  }

  const handleEdit = (record: MeetingRoomFullInfo) => {
    setModalMode('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      number: record.number,
      location: record.location,
      capacity: record.capacity,
      deviceIds: record.deviceIds,
      departmentIds: record.departmentIds,
    });
    setIsModalOpen(true);
  }


  useEffect(() => {
    fetchData();
  }, []);

  const { Title } = Typography;

  return (
    <div>
      {contextHolder}
      <Row justify="center" align="middle">
        <Col span={20}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={3}>会议室管理</Title>
            <Button type="primary" onClick={handleAdd}>添加会议室</Button>
          </div>

          <Table dataSource={dataSource} columns={columns} rowKey="id"/>
        </Col>
      </Row>

      <Modal
        title={modalMode === 'add' ? '添加会议室' : '编辑会议室'} open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddOrEditOk}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          {modalMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入会议室名称' }]}>
            <Input placeholder="请输入会议室名称"/>
          </Form.Item>
          <Form.Item label="编号" name="number" rules={[{ required: true, message: '请输入会议室编号' }]}>
            <Input placeholder="请输入会议室编号"/>
          </Form.Item>
          <Form.Item label="地址" name="location" rules={[{ required: true, message: '请输入会议室地址' }]}>
            <Input placeholder="请输入会议室地址"/>
          </Form.Item>
          <Form.Item label="容量" name="capacity" rules={[{ required: true, message: '请输入会议室容量' }]}>
            <InputNumber placeholder="请输入会议室容量"/>
          </Form.Item>
          <Form.Item label="设备" name="deviceIds">
            <Select
              mode="multiple" placeholder="请选择会议室设备"
              options={devices.map(device => ({ label: device.name, value: device.id }))}
            />
          </Form.Item>
          <Form.Item label="部门" name="departmentIds">
            <Select
              mode="multiple" placeholder="请选择会议室部门"
              options={departments.map(department => ({ label: department.name, value: department.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
};

export default MeetingRoomManagementChild;