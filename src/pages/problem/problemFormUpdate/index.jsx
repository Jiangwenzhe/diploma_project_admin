import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  InputNumber,
  Table,
  Button,
  Tooltip,
  Select,
  Form,
  Row,
  Col,
  Switch,
  Checkbox,
  Upload,
  message,
  Radio,
  Divider,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { connect } from 'umi';
import request from '@/utils/request';

const { Option } = Select;

const problem_detail_template = `题目描述
#### 示例1

\`\`\`
输入："1 1"
输出："2"
解释：description example
\`\`\`

#### 说明

* 说明细节1
* 说明细节2
`;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 2,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 2,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

const upload_testcase_table_columns = [
  {
    title: 'Input',
    dataIndex: 'input_name',
    key: 'input_name',
  },
  {
    title: 'Output',
    dataIndex: 'output_name',
    key: 'output_name',
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
];

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const ProblemForm = (props) => {
  const {
    dispatch,
    submitting,
    match,
    problem: { currentProblemInfo },
  } = props;
  const [form] = Form.useForm();
  const [problemDetail, setProblemDetail] = useState(problem_detail_template);
  const [test_case_id, setTestCaseId] = useState('');
  const [test_case_score, setTestCaseScore] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagname, setTagName] = useState('');

  useEffect(() => {
    request('/api/problemtag').then((response) => {
      const tagValue = response.data.map((item) => item.name);
      setTags(tagValue);
    });
  }, []);

  useEffect(() => {
    if (match.params.id) {
      dispatch({
        type: 'problem/getProblemInfo',
        payload: match.params.id,
      });
    }
  }, [dispatch, match]);

  useEffect(() => {
    form.setFieldsValue({
      title: currentProblemInfo.title,
      sample_input: currentProblemInfo.sample_input,
      sample_output: currentProblemInfo.sample_output,
      limit_time: currentProblemInfo.limit_time,
      limit_memory: currentProblemInfo.limit_memory,
      visible: currentProblemInfo.visible,
      difficulty: currentProblemInfo.difficulty,
      languages: currentProblemInfo.languages,
      tags: currentProblemInfo.tags,
    });
    setProblemDetail(currentProblemInfo.detail);
    setTestCaseId(currentProblemInfo.test_case_id);
    setTestCaseScore(currentProblemInfo.test_case_score);
  }, [currentProblemInfo, form]);

  function handleEditorChange({ html, text }) {
    setProblemDetail(text);
  }

  const fileUploadProps = {
    name: 'file',
    action: '/api/testcase',
    accetp: '.zip',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功。`);
        if (info.file && info.file.response.code === 0) {
          const testcase_res = info.file.response.data;
          const { test_case_id: upload_testcase_id, info: testcase_info } = testcase_res;
          // 设置 test_case_id
          setTestCaseId(upload_testcase_id);
          // 设置 test_case_score
          const newTestCaseInfo = testcase_info.map((item) => {
            const score = 100 / testcase_info.length;
            return { ...item, score };
          });
          setTestCaseScore(newTestCaseInfo);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传成功失败。`);
      }
    },
    onRemove() {
      setTestCaseId('');
      setTestCaseScore([]);
    },
  };
  const addTag = () => {
    const newTags = JSON.parse(JSON.stringify(tags));
    newTags.push(tagname);
    setTags([...new Set(newTags)]);
    setTagName('');
  };
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    if (test_case_id === '' || test_case_score.length === 0) {
      message.error('请上传执行用例');
      return;
    }
    const payload = { ...values, test_case_id, test_case_score, detail: problemDetail };
    dispatch({
      type: 'problem/updateProblem',
      payload: {
        data: payload,
        id: match.params.id,
      },
    });
  };
  return (
    <PageHeaderWrapper content="更新题目">
      <Card>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            limit_time: 1000,
            limit_memory: 256,
            visible: true,
            difficulty: 'Low',
            languages: ['C', 'C++', 'Java', 'Python2', 'Python3'],
          }}
        >
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="题目详情信息" rules={[{ required: true }]}>
            <MdEditor
              value={problemDetail}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </Form.Item>

          <Form.Item
            name="sample_input"
            label="sample_input"
            rules={[{ required: true, message: '请输入 sample_input' }]}
          >
            <Input.TextArea placeholder="请输入样例输入" />
          </Form.Item>

          <Form.Item
            name="sample_output"
            label="sample_output"
            rules={[{ required: true, message: '请输入 sample_input' }]}
          >
            <Input.TextArea placeholder="请输入样例输出" />
          </Form.Item>
          <Form.Item label="Limit Time">
            <Form.Item
              name="limit_time"
              rules={[
                {
                  required: true,
                  message: 'Input something!',
                },
              ]}
              noStyle
            >
              <InputNumber min={1000} max={10000} />
            </Form.Item>
            <span className="ant-form-text"> ms</span>
          </Form.Item>
          <Form.Item label="Limit Memory">
            <Form.Item name="limit_memory" noStyle>
              <InputNumber min={256} max={256 * 4} />
            </Form.Item>
            <span className="ant-form-text">MB</span>
          </Form.Item>
          <Form.Item name="visible" label="Visible" valuePropName="checked">
            <Switch checkedChildren="可见" unCheckedChildren="不可见" />
          </Form.Item>
          <Form.Item name="difficulty" label="题目难度">
            <Radio.Group>
              <Radio.Button value="Low">Low</Radio.Button>
              <Radio.Button value="Mid">Mid</Radio.Button>
              <Radio.Button value="High">High</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="tags" label="tags">
            <Select
              mode="multiple"
              placeholder="Select..."
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                    <Input
                      style={{ flex: 'auto' }}
                      value={tagname}
                      onChange={(e) => setTagName(e.target.value)}
                    />
                    <a
                      style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                      onClick={addTag}
                    >
                      <PlusOutlined /> 添加 tag
                    </a>
                  </div>
                </div>
              )}
            >
              {tags.map((item) => (
                <Option key={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="languages" label="支持语言">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={3}>
                  <Checkbox
                    value="C"
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Tooltip placement="top" title="GCC 5.4">
                      C
                    </Tooltip>
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="C++"
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Tooltip placement="top" title="G++ 5.4">
                      C++
                    </Tooltip>
                  </Checkbox>
                </Col>
                <Col span={4}>
                  <Checkbox
                    value="Java"
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Tooltip placement="top" title="OpenJDK 1.8">
                      Java
                    </Tooltip>
                  </Checkbox>
                </Col>
                <Col span={5}>
                  <Checkbox
                    value="Python2"
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Tooltip placement="top" title="Python 2.7">
                      Python2
                    </Tooltip>
                  </Checkbox>
                </Col>
                <Col span={5}>
                  <Checkbox
                    value="Python3"
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    <Tooltip placement="top" title="Python 3.5">
                      Python2
                    </Tooltip>
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="上传执行用例">
            <Upload {...fileUploadProps}>
              <Button>
                <UploadOutlined /> Click to Upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label="执行用例信息">
            <Table
              columns={upload_testcase_table_columns}
              dataSource={test_case_score}
              size="small"
              rowKey="stripped_output_md5"
            />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              更新题目信息
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ problem, loading }) => ({
  problem,
  submitting: loading.effects['problem/createProblem'],
}))(ProblemForm);
