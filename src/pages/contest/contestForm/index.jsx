import React, { useState, useEffect } from 'react';
import { Card, Input, InputNumber, Button, message, Form, Switch, DatePicker } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { connect } from 'umi';
import moment from 'moment';

const { RangePicker } = DatePicker;

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

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

const ContestForm = (props) => {
  const {
    dispatch,
    submitting,
    match,
    contest: { contestDetail },
  } = props;
  const [form] = Form.useForm();
  const [contestDescription, setContestDescription] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleEditorChange({ html, text }) {
    setContestDescription(text);
  }

  useEffect(() => {
    if (match.path.includes('update')) {
      setIsUpdate(true);
      dispatch({
        type: 'contest/fetchContentDetail',
        payload: { id: match.params.id },
      });
    }
    if (match.path.includes('create')) {
      setIsUpdate(false);
      dispatch({
        type: 'contest/cleanContestDetail',
      });
    }
  }, [dispatch, match]);

  useEffect(() => {
    if (isUpdate) {
      form.setFieldsValue({
        title: contestDetail.title,
        need_pass: contestDetail.need_pass,
        need_facialRecognition: contestDetail.need_facialRecognition,
        password: contestDetail.need_pass ? contestDetail.password : '',
        visible: contestDetail.visible,
        range_time: [moment(contestDetail.start_time), moment(contestDetail.end_time)],
      });
      setContestDescription(contestDetail.description);
    }
  }, [contestDetail, form, isUpdate]);

  const onFinish = (values) => {
    if (contestDetail === '') {
      message.error('请输入比赛详情信息！');
    }
    const { title, need_pass, need_facialRecognition, range_time, password, visible } = values;
    const start_time = range_time[0].format('YYYY-MM-DD HH:mm');
    const end_time = range_time[1].format('YYYY-MM-DD HH:mm');
    const payload = {
      title,
      need_pass,
      need_facialRecognition,
      start_time,
      end_time,
      password,
      visible,
      description: contestDescription,
    };
    if (!need_pass) {
      delete payload.password;
    }
    if (isUpdate) {
      dispatch({
        type: 'contest/updateContest',
        payload: {
          id: match.params.id,
          payload,
        },
      });
    } else {
      dispatch({
        type: 'contest/createContest',
        payload,
      });
    }
  };

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: '请选择比赛的时间段' }],
  };

  return (
    <div>
      <PageHeaderWrapper content="">
        <Card>
          <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              visible: true,
              need_pass: true,
              need_facialRecognition: false,
            }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="比赛详情信息" rules={[{ required: true }]}>
              <MdEditor
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: false,
                  },
                }}
                value={contestDescription}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
            </Form.Item>
            <Form.Item name="range_time" label="比赛时间" {...rangeConfig}>
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
            <Form.Item name="visible" label="Visible" valuePropName="checked">
              <Switch checkedChildren="可见" unCheckedChildren="不可见" />
            </Form.Item>
            <Form.Item name="need_pass" label="需要密码" valuePropName="checked">
              <Switch checkedChildren="开启密码" unCheckedChildren="关闭密码" />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.need_pass !== currentValues.need_pass
              }
            >
              {({ getFieldValue }) => {
                return getFieldValue('need_pass') === true ? (
                  <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            <Form.Item name="need_facialRecognition" label="需要面部识别" valuePropName="checked">
              <Switch checkedChildren="开启面部识别" unCheckedChildren="关闭面部识别" />
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.need_facialRecognition !== currentValues.need_facialRecognition
              }
            >
              {({ getFieldValue }) => {
                return getFieldValue('need_facialRecognition') === true ? (
                  <Form.Item
                    name="infractions"
                    label="违规次数"
                    rules={[{ required: true, message: '请输入违规次数' }]}
                  >
                    <InputNumber min={1} max={10} />
                  </Form.Item>
                ) : null;
              }}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" loading={submitting} block>
                {isUpdate ? '更新比赛信息' : '添加比赛信息'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(({ contest, loading }) => ({
  contest,
  submitting: loading.effects['problem/createContest'],
}))(ContestForm);
