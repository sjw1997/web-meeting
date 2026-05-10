import { Button, Col, Form, Input, Modal, Row, Table, Typography, message } from 'antd'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义


export interface DepartmentInfo {
  id: number;
  name: string;
}

const DepartmentManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<DepartmentInfo[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

  const columns: ColumnsType<DepartmentInfo> = [
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
    const departmentResponse = await axios.get('/api/department/get');
    setDataSource(departmentResponse.data.departments);
  };

  const handleDelete = async (record: DepartmentInfo) => {
    Modal.confirm({
      title: '删除部门',
      content: `确定要删除部门 ${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/department/delete/${record.id}`);
          if (response.data.success) {
            messageApi.success(`成功删除部门 ${record.name}`);
            fetchData();
          } else {
            messageApi.error(`${response.data.message} 删除部门 ${record.name} 失败`);
          }
        } catch (error: unknown) { 
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || `删除部门 ${record.name} 失败`}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || `删除部门 ${record.name} 失败`}`);
          }
        }
      }
    })
  }

  const handleAddOrEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'add') {
        const response = await axios.post('/api/department/add', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('添加部门成功');
        } else {
          messageApi.error(`${response.data.message} 添加部门失败`);
        }
      } else if (modalMode === 'edit') {
        const response = await axios.put('/api/department/update', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('编辑部门成功');
        } else {
          messageApi.error(`${response.data.message} 编辑部门失败`);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        messageApi.error(`${error.response?.data?.message || '添加/编辑部门失败'}`);
      } else if (error instanceof Error) {
        messageApi.error(`${error.message || '添加/编辑部门失败'}`);
      }
    }
  }

  const handleAdd = () => {
    setModalMode('add');
    form.resetFields();
    setIsModalOpen(true);
  }

  const handleEdit = (record: DepartmentInfo) => {
    setModalMode('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name
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
            <Title level={3}>部门管理</Title>
            <Button type="primary" onClick={handleAdd}>添加部门</Button>
          </div>

          <Table dataSource={dataSource} columns={columns} rowKey="id"/>;
        </Col>
      </Row>

      <Modal
        title={modalMode === 'add' ? '添加部门' : '编辑部门'} open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddOrEditOk}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          {modalMode === 'edit' && <Form.Item name="id" hidden><Input /></Form.Item>}
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入部门名称' }]}>
            <Input placeholder="请输入部门名称"/>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
};

export default DepartmentManagement;