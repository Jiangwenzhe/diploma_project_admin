import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Input,
  Pagination,
  Avatar,
  Tooltip,
  Button,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Upload,
  message,
  Radio,
} from 'antd';
import { DeleteTwoTone, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';

const { Search } = Input;

const UserList = (props) => {
  const {
    dispatch,
    fetchAllUserLoading,
    userManage: { userList, total },
  } = props;

  const [form] = Form.useForm();
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [query, setQuery] = useState({
    name: '',
  });

  const [isUpdate, setIsUpdate] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'userManage/fetchAllUser',
      payload: { pagination, query },
    });
  }, [dispatch, pagination, query]);

  // 更改 pagination 中的 current 当前页码
  const paginationChangeHandler = (current) => {
    setPagination({ ...pagination, current });
  };

  // 更改 pagination 中的 pageSize 当前页面容量
  const handlePageSizeChange = (_, pageSize) => {
    setPagination({ ...pagination, pageSize });
  };

  const handleTitleQuery = (value) => {
    setQuery({ ...query, name: value });
    setPagination({ current: 1, pageSize: 10 });
  };

  const handleSearchTextisNull = (e) => {
    const { value } = e.target;
    if (value === '') {
      dispatch({
        type: 'userManage/fetchAllUser',
        payload: { pagination: { current: 1, pageSize: 10 }, query: { ...query, name: '' } },
      });
    }
  };

  const showUserForm = () => {
    setUserFormVisible(true);
  };

  const hideUserForm = () => {
    setUserFormVisible(false);
  };

  const onUpdateFormFinish = (values) => {
    const formValue = values;
    if (avatarImageUrl) {
      formValue.avatar = avatarImageUrl;
    }
    if (isUpdate && updateUserId) {
      dispatch({
        type: 'userManage/updateUserInfo',
        payload: {
          id: updateUserId,
          data: formValue,
          getUserPayload: {
            pagination,
            query,
          },
        },
      }).then((msg) => {
        if (msg === 'success') {
          hideUserForm();
          form.resetFields();
          setIsUpdate(false);
          setAvatarImageUrl(null);
          setUpdateUserId(null);
        } else {
          hideUserForm();
          form.resetFields();
          setIsUpdate(false);
          setAvatarImageUrl(null);
          setUpdateUserId(null);
        }
      });
    } else {
      dispatch({
        type: 'userManage/createUser',
        payload: {
          data: formValue,
          getUserPayload: {
            pagination,
            query,
          },
        },
      }).then((msg) => {
        if (msg === 'success') {
          hideUserForm();
          form.resetFields();
          setIsUpdate(false);
          setAvatarImageUrl(null);
          setUpdateUserId(null);
        }
      });
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imagrUrl) => {
        setAvatarImageUrl(imagrUrl);
        setAvatarLoading(false);
      });
    }
  };

  const handleUpdateUser = (record) => {
    setIsUpdate(true);
    // eslint-disable-next-line no-underscore-dangle
    setUpdateUserId(record._id);
    setAvatarImageUrl(record.avatar);
    form.setFieldsValue({
      name: record.name,
      password: record.password,
      motto: record.motto,
      mail: record.mail,
      privilege: record.privilege,
      school: record.school,
      company: record.company,
    });
    showUserForm();
  };

  const handleDeleteUser = (id) => {
    dispatch({
      type: 'userManage/deleteUser',
      payload: {
        pagination,
        query,
        id,
      },
    });
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 5, span: 16 },
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'uid',
    },
    {
      title: '名字',
      dataIndex: 'name',
      // width: '50%',
      render: (text) => {
        return <a>{text}</a>;
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: (avatar) => {
        return <Avatar src={avatar} size="small" />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      render: (createdAt) => {
        return <span>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: '学校',
      dataIndex: 'school',
      render: (school) => {
        return school || '/';
      },
    },
    {
      title: '公司',
      dataIndex: 'company',
      render: (company) => {
        return company || '/';
      },
    },
    {
      title: '权限',
      dataIndex: 'privilege',
      render: (privilege) => {
        return privilege === 3 ? (
          <Tag color="error">管理员</Tag>
        ) : (
          <Tag color="success">普通用户</Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip placement="top" title="编辑用户">
              <Button
                style={{ marginRight: '4px' }}
                size="small"
                onClick={() => handleUpdateUser(record)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip placement="right" title="删除比赛">
              <Popconfirm
                arrowPointAtCenter
                placement="topRight"
                title={`确定要删除名字为 「${record.name}」 的用户吗?`}
                // eslint-disable-next-line no-underscore-dangle
                onConfirm={() => handleDeleteUser(record._id)}
                okText="确定"
                cancelText="取消"
              >
                <Button size="small">
                  <DeleteTwoTone twoToneColor="#eb2f96" />
                </Button>
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const uploadButton = (
    <div>
      {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <div>
      <PageHeaderWrapper content=" 这个页面只有 admin 权限才能查2">
        <Card>
          <Search
            placeholder="请输入关键字"
            enterButton="搜索"
            size="large"
            onChange={(value) => handleSearchTextisNull(value)}
            onSearch={(value) => handleTitleQuery(value)}
          />
          <div style={{ marginTop: '20px' }}>
            <Table
              columns={columns}
              rowKey="_id"
              dataSource={userList}
              loading={fetchAllUserLoading}
              pagination={false}
            />
          </div>
          <div className={styles.operation}>
            <Button style={{ marginTop: '10px' }} onClick={showUserForm}>
              添加用户
            </Button>
            <Pagination
              style={{ marginTop: '10px', display: 'inline-block' }}
              current={pagination.current}
              pageSize={pagination.pageSize}
              onChange={(current) => paginationChangeHandler(current)}
              onShowSizeChange={handlePageSizeChange}
              showSizeChanger
              total={total}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
      <Modal
        title={isUpdate ? '编辑用户' : '创建用户'}
        visible={userFormVisible}
        onCancel={hideUserForm}
        footer={null}
        destroyOnClose
      >
        <div>
          <Form
            form={form}
            {...layout}
            name="basic"
            onFinish={onUpdateFormFinish}
            initialValues={{
              privilege: 1,
              motto: '',
              school: '',
              mail: '',
              company: '',
            }}
          >
            <Form.Item label="头像">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
              >
                {avatarImageUrl ? (
                  <img src={avatarImageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              label="用户名"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入你的用户名',
                },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item name="privilege" label="用户权限">
              <Radio.Group>
                <Radio value={1}>普通用户</Radio>
                <Radio value={3}>管理员</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="签名" name="motto">
              <Input placeholder="请输入签名" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="mail"
              rules={[{ type: 'email', message: '请输入正确的电子邮箱格式' }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>

            <Form.Item label="学校" name="school">
              <Input placeholder="请输入学校" />
            </Form.Item>

            <Form.Item label="公司名" name="company">
              <Input placeholder="请输入公司" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" block htmlType="submit">
                {isUpdate ? '更新' : '创建'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ userManage, loading }) => ({
  userManage,
  fetchAllUserLoading: loading.effects['userManage/fetchAllUser'],
}))(UserList);
