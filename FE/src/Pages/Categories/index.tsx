import { Button, Form, Input, message } from "antd";

import axios from "../../libraries/axiosClient";
import React from "react";

const apiName = "/categories";

export default function Categories() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);

  const [createFrom] = Form.useForm();

  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setCategories(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onFinish = (values: any) => {
    console.log(values);
    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createFrom.resetFields();
        message.success("Thêm mới danh mục thành công", 1.5);
        window.location.href = "/category-list";
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 25 }}>
      <div style={{}}>
        <Form
          form={createFrom}
          name="create-form"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Tên danh mục"
            name="name"
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng nhập đầy đủ thông tin!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả / Ghi chú"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập đầy đủ thông tin!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu Thông Tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
