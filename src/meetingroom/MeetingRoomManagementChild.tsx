import { Table, Row, Col, Button, Typography, Modal, Input, Form, InputNumber, message, Select } from 'antd'; 
import { PlusOutlined } from '@ant-design/icons'; // 2. 引入图标
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义
import type { DeviceInfo } from '../device/DeviceManagement';
import type { DepartmentInfo } from '../department/DepartmentManagement';


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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [messageApi, contextHolder] = message.useMessage();

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
              <a style={{ marginRight: 8 }} onClick={() => handleEnableDisable(record)}>禁用</a>
            ) : (
              <a style={{ marginRight: 8 }} onClick={() => handleEnableDisable(record)}>启用</a>
            )
          }
        </span>
      )
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let response = await axios.get('/api/meeting_room/get');
    setDataSource(response.data.meetingRooms);

    response = await axios.get('/api/device/get');
    setDevices(response.data.devices);

    response = await axios.get('/api/department/get');
    setDepartments(response.data.departments);
  };

  // 处理添加按钮点击
  const handleAdd = () => {
    setIsModalOpen(true);
    setModalType('add');
    form.resetFields();
  };

  const handleEdit = (record: MeetingRoomFullInfo) => {
    console.log("编辑会议室信息:", record);
    setIsModalOpen(true);
    setModalType('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      number: record.number,
      location: record.location,
      capacity: record.capacity,
      deviceIds: record.deviceIds,
      departmentIds: record.departmentIds
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log('表单值:', values);

      const response = await axios.post('/api/meeting_room/' + (modalType === 'add' ? 'add' : 'update'), {
        ...values,
        deviceIds: Array.isArray(values.deviceIds) ? values.deviceIds.map(Number) : [],
        departmentIds: Array.isArray(values.departmentIds) ? values.departmentIds.map(Number) : []
      });
      if (response.data.success) {
        fetchData();
        messageApi.open({
          type: 'success',
          content: modalType === 'add' ? '添加会议室成功' : '更新会议室成功',
        });
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        messageApi.open({
          type: 'error',
          content: error.response?.data?.message || (modalType === 'add' ? '添加会议室失败' : '更新会议室失败'),
        });
      } else {
        messageApi.open({
          type: 'error',
          content: '请求失败',
        });
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (record: MeetingRoomFullInfo) => {
    Modal.confirm({
      title: '删除会议室',
      content: `确定要删除会议室 "${record.name}" 吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/meeting_room/delete/${record.id}`);
          if (response.data.success) {
            fetchData();
            messageApi.open({
              type: 'success',
              content: '删除会议室成功',
            });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            messageApi.open({
              type: 'error',
              content: error.response?.data?.message || '删除会议室失败',
            });
          }
        }
      }
    })
  };

  const handleEnableDisable = async (record: MeetingRoomFullInfo) => {
    try {
      const response = await axios.post(`/api/meeting_room/${record.available ? 'forbid' : 'enable'}/${record.id}`);
      if (response.data.success) {
        fetchData();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        messageApi.open({
          type: 'error',
          content: error.response?.data?.message || `${record.available ? '禁用' : '启用'}会议室失败`,
        });
      }
    }
  }

  const { Title } = Typography;

  return (
    <div style={{ padding: '24px' }}>
      {contextHolder}
      {/* 顶部标题和操作栏 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>会议室管理</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加会议室
          </Button>
        </Col>
      </Row>

      {/* 表格区域 */}
      <Row>
        <Col span={24}>
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            rowKey="id" 
            bordered // 可选：添加边框使表格更清晰
          />
        </Col>
      </Row>

      <Modal
        title={modalType === 'add' ? '添加会议室' : '编辑会议室'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout='vertical'>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="编号" name="number">
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="容量" name="capacity">
            <InputNumber />
          </Form.Item>
          <Form.Item label="拥有设备" name="deviceIds">
            <Select
              mode="multiple"
              placeholder="请选择设备"
              options={devices.map(device => ({ value: device.id, label: device.name }))}
            >
            </Select>
          </Form.Item>
          <Form.Item label="可用部门" name="departmentIds">
            <Select
              mode="multiple"
              placeholder="请选择部门"
              options={departments.map(department => ({ value: department.id, label: department.name }))}
            >
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default MeetingRoomManagementChild;