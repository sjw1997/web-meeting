import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Typography, Popconfirm, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface Department {
  id: string;
  name: string;
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();

  // 获取部门列表
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/department/get');
      if (response.data.success) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      message.error('获取部门列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 打开编辑模态框
  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    form.setFieldsValue({
        id: department.id,
        name: department.name
    });
    setIsModalOpen(true);
  };

  // 打开新增模态框
  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 提交表单（新增或编辑）
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const url = editingDepartment
        ? `/api/department/update`
        : '/api/department/add';
      
      const response = editingDepartment
        ? await axios.put(url, values)
        : await axios.post(url, values);

      if (!response.data.success) {
        throw new Error(editingDepartment ? '更新部门失败' : '创建部门失败');
      }

      message.success(editingDepartment ? '更新成功' : '创建成功');
      setIsModalOpen(false);
      fetchDepartments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(`${error.response?.data?.message || (editingDepartment ? '更新部门失败' : '创建部门失败')}`);
      } else if (error instanceof Error) {
        message.error(`${error.message}`);
      }
    }
  };

  // 删除部门
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/department/delete/${id}`);

      if (!response.data.success) {
        throw new Error('删除部门失败');
      }

      message.success('删除成功');
      fetchDepartments();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(`${error.response?.data?.message || '删除部门失败'}`);
      } else if (error instanceof Error) {
        message.error(`${error.message}`);
      }
    }
  };

  // 表格列定义
  const columns: ColumnsType<Department> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '部门名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个部门吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Row justify="center" align="middle">
      <Col xs={24} sm={22} md={20} lg={18}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Title level={2}>部门管理</Typography.Title>
          <Button type="primary" onClick={handleAdd}>
            新增部门
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={departments}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingDepartment ? '编辑部门' : '新增部门'}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          okText="确定"
          cancelText="取消"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="部门名称"
              rules={[{ required: true, message: '请输入部门名称' }]}
            >
              <Input placeholder="请输入部门名称" />
            </Form.Item>

            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default Department;