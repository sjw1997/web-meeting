import axios from 'axios';
import React, { useState, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义
import { Button, Col, Modal, Row, Table, Typography, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; // 2. 引入图标


export interface DepartmentInfo {
  id: number;
  name: string;
}

const DepartmentManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<DepartmentInfo[]>([]);
  const [modalType, setModalType] = useState<'add' | 'edit'>('edit');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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

  useEffect(() => {
    fetchData();
  }, []);

  const { Title } = Typography;

  const fetchData = async () => {
      const response = await axios.get('/api/department/get');
      console.log(response.data);
      setDataSource(response.data.departments);
    };

  const handleAdd = () => {
    setModalType('add');
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (record: DepartmentInfo) => {
    setModalType('edit');
    setIsModalOpen(true);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
    });
  };

  const handleDelete = (record: DepartmentInfo) => {
    Modal.confirm({
      title: '删除部门',
      content: `确定要删除部门 "${record.name}" 吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/department/delete/${record.id}`);
          if (response.data.success) {
            fetchData();
            messageApi.open({
              type: 'success',
              content: '删除部门成功',
            });
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            messageApi.open({
              type: 'error',
              content: error.response?.data?.message || '删除部门失败',
            });
          }
        }
      }
    })
  }

  const handleOk = async () => {
    const values = await form.validateFields();
    console.log('表单值:', values);
    if (modalType === 'add') {
      try {
        const response = await axios.post('/api/department/add', values);
        if (response.data.success) {
          fetchData();
          setIsModalOpen(false);
          messageApi.open({
            type: 'success',
            content: '添加部门成功',
          });
        } else {
          messageApi.open({
            type: 'error',
            content: response.data.message,
          });
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message);
          messageApi.open({
            type: 'error',
            content: error.response?.data?.message || '添加部门失败',
          });
        }
      }
    } else {
      try {
        const response = await axios.put('/api/department/update', values);
        if (response.data.success) {
          fetchData();
          setIsModalOpen(false);
          messageApi.open({
            type: 'success',
            content: '更新部门成功',
          });
        } else {
          messageApi.open({
            type: 'error',
            content: response.data.message,
          });
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          messageApi.open({
            type: 'error',
            content: error.response?.data?.message || '更新部门失败',
          });
        }
      }
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      { contextHolder }
      {/* 顶部标题和操作栏 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>部门管理</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加部门
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
        title={modalType === 'add' ? '添加部门' : '编辑部门'}
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
          <Form.Item label="部门名称:" name="name">
            <Input placeholder="请输入部门名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DepartmentManagement;