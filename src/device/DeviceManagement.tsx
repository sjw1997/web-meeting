import { Button, Col, Form, Input, Modal, Row, Table, Typography, message } from 'antd'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义

export interface DeviceInfo {
  id: number;
  name: string;
}

const DeviceManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<DeviceInfo[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

  const columns: ColumnsType<DeviceInfo> = [
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
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => (
        <span>
          <a style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>编辑</a>
          <a style={{ marginRight: 8 }} onClick={() => handleDelete(record)}>删除</a>
        </span>
      )
    }
  ];

  const fetchData = async () => {
    const deviceResponse = await axios.get('/api/device/get');
    setDataSource(deviceResponse.data.devices);
  };


  const handleDelete = async (record: DeviceInfo) => {
    Modal.confirm({
      title: '删除设备',
      content: `确定要删除设备 ${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/device/delete/${record.id}`);
          if (response.data.success) {
            messageApi.success(`成功删除设备 ${record.name}`);
            fetchData();
          } else {
            messageApi.error(`${response.data.message} 删除设备 ${record.name} 失败`);
          }
        } catch (error: unknown) { 
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || `删除设备 ${record.name} 失败`}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || `删除设备 ${record.name} 失败`}`);
          }
        }
      }
    })
  }

  const handleAddOrEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'add') {
        const response = await axios.post('/api/device/add', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('添加设备成功');
        } else {
          messageApi.error(`${response.data.message} 添加设备失败`);
        }
      } else if (modalMode === 'edit') {
        const response = await axios.put('/api/device/update', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('编辑设备成功');
        } else {
          messageApi.error(`${response.data.message} 编辑设备失败`);
        }
      }
    } catch (error: unknown) { 
      if (axios.isAxiosError(error)) {
        messageApi.error(`${error.response?.data?.message || '添加/编辑设备失败'}`);
      } else if (error instanceof Error) {
        messageApi.error(`${error.message || '添加/编辑设备失败'}`);
      }
    }
  }

  const handleAdd = () => {
    setModalMode('add');
    form.resetFields();
    setIsModalOpen(true);
  }

  const handleEdit = (record: DeviceInfo) => {
    setModalMode('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name,
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
            <Title level={3}>设备管理</Title>
            <Button type="primary" onClick={handleAdd}>添加设备</Button>
          </div>

          <Table dataSource={dataSource} columns={columns} rowKey="id"/>
        </Col>
      </Row>

      <Modal
        title={modalMode === 'add' ? '添加设备' : '编辑设备'} open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddOrEditOk}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          {modalMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
            <Input placeholder="请输入设备名称"/>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
};

export default DeviceManagement;