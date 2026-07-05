import { Button, Col, Form, Input, Modal, Row, Select, Table, Typography, message } from 'antd'; 
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table'; // 引入类型定义
import type { DepartmentInfo } from './DepartmentManagement';


export interface EmployeeInfo {
  id: number;
  name: string;
  workNum: string;
  phoneNum: string;
  departmentId: number;
}

const EmployeeManagement: React.FC = () => {
  const [dataSource, setDataSource] = useState<EmployeeInfo[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [form] = Form.useForm();

  const columns: ColumnsType<EmployeeInfo> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工号',
      dataIndex: 'workNum',
      key: 'workNum',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
    },
    {
      title: '部门',
      dataIndex: 'departmentId',
      key: 'departmentId',
      render: (departmentId) => {
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : '未知部门';
      }
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
    const employeeResponse = await axios.get('/api/user/getUsers');
    const departmentResponse = await axios.get('/api/department/get');
    setDepartments(departmentResponse.data.departments);
    setDataSource(employeeResponse.data.users);
  };

  const handleDelete = async (record: EmployeeInfo) => {
    Modal.confirm({
      title: '删除员工',
      content: `确定要删除员工 ${record.name} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.delete(`/api/user/delete/${record.id}`);
          if (response.data.success) {
            messageApi.success(`成功删除员工 ${record.name}`);
            fetchData();
          } else {
            messageApi.error(`${response.data.message} 删除员工 ${record.name} 失败`);
          }
        } catch (error: unknown) { 
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || `删除员工 ${record.name} 失败`}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || `删除员工 ${record.name} 失败`}`);
          }
        }
      }
    })
  }

  const handleAddOrEditOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalMode === 'add') {
        const response = await axios.post('/api/user/add', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('添加员工成功');
        } else {
          messageApi.error(`${response.data.message} 添加员工失败`);
        }
      } else if (modalMode === 'edit') {
        const response = await axios.put('/api/user/update', values);
        if (response.data.success) {
          setIsModalOpen(false);
          fetchData();
          messageApi.success('编辑员工成功');
        } else {
          messageApi.error(`${response.data.message} 编辑员工失败`);
        }
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        messageApi.error(`${error.response?.data?.message || '添加/编辑员工失败'}`);
      } else if (error instanceof Error) {
        messageApi.error(`${error.message || '添加/编辑员工失败'}`);
      }
    }
  }

  const handleEdit = (record: EmployeeInfo) => {
    setModalMode('edit');
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      workNum: record.workNum,
      phoneNum: record.phoneNum,
      departmentId: record.departmentId
    });
    setIsModalOpen(true);
  }

  const handleAdd = () => { 
    setModalMode('add');
    form.resetFields();
    setIsModalOpen(true);
  }

  const handleBatchAdd = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async () => { 
      const file = input.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axios.post('/api/user/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          if (response.data.success) {
            messageApi.success(response.data.message);
            fetchData();
          } else {
            messageApi.error(`${response.data.message}`);
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            messageApi.error(`${error.response?.data?.message || '导入失败'}`);
          } else if (error instanceof Error) {
            messageApi.error(`${error.message || '导入失败'}`);
          }
        }
      }
    };
    input.click();
  }

  const handleDownloadTemplate = () => {
    axios.get('/api/download/insertDemo.xls', { responseType: 'blob' })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '员工导入模板.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
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
            <Title level={3}>员工管理</Title>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" onClick={handleAdd}>单个添加</Button>
              <Button type="primary" onClick={handleBatchAdd}>表格添加</Button>
              <Button type="primary" onClick={handleDownloadTemplate}>下载表格案例</Button>
            </div>
          </div>

          <Table dataSource={dataSource} columns={columns} rowKey="id"/>
        </Col>
      </Row>

      <Modal
        title="编辑员工" open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddOrEditOk}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" hidden><Input /></Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入员工姓名' }]}>
            <Input placeholder="请输入员工姓名"/>
          </Form.Item>
          <Form.Item label="工号" name="workNum" rules={[{ required: true, message: '请输入员工工号' }]}>
            <Input placeholder="请输入员工工号"/>
          </Form.Item>
          <Form.Item label="手机号" name="phoneNum" rules={[{ required: true, message: '请输入员工手机号' }]}>
            <Input placeholder="请输入员工手机号"/>
          </Form.Item>
          <Form.Item label="部门" name="departmentId" rules={[{ required: true, message: '请选择员工部门' }]}>
            <Select
              placeholder="请选择员工部门"
              options={departments.map(department => ({ label: department.name, value: department.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>

    </div>
  )
};

export default EmployeeManagement;