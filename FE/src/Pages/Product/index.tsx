import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import React from "react";
import axios from "../../libraries/axiosClient";
import numeral from "numeral";

const apiName = "/products";

export default function Product() {
  const [items, setItems] = React.useState<any[]>([]);
//   const [categories, setCategories] = React.useState<any[]>([]);
//   const [suppliers, setSupplier] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [createFrom] = Form.useForm();
  const [updateFrom] = Form.useForm();

  const columns: ColumnsType<any> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    // {
    //   title: "Tên danh mục",
    //   dataIndex: "category.name",
    //   key: "category.name",
    //   render: (text, record, index) => {
    //     return <span>{record.category.name}</span>;
    //   },
    // },
    // {
    //   title: "Nhà cung cấp",
    //   dataIndex: "supplier.name",
    //   key: "supplier.name",
    //   render: (text, record, index) => {
    //     return <span>{record.supplier.name}</span>;
    //   },
    // },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <strong>{text}</strong>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Giảm",
      dataIndex: "discount",
      key: "discount",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}%</span>;
      },
    },
    {
      title: () => {
        return <div style={{ whiteSpace: "nowrap" }}>Tồn kho</div>;
      },
      dataIndex: "stock",
      key: "stock",
      width: "1%",
      align: "right",
      render: (text, record, index) => {
        return <span>{numeral(text).format("0,0")}</span>;
      },
    },
    {
      title: "Mô tả / Ghi chú",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text, record, index) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setOpen(true);
                setUpdateId(record.id);
                updateFrom.setFieldsValue(record);
              }}
            />

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record.id);
                axios.delete(apiName + "/" + record.id).then((response) => {
                  setRefresh((f) => f + 1);

                  message.success("Xoa danh mục thành công", 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setItems(data);
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

//   React.useEffect(() => {
//     axios
//       .get("/categories")
//       .then((response) => {
//         const { data } = response;
//         setCategories(data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

//   React.useEffect(() => {
//     axios
//       .get("/suppliers")
//       .then((response) => {
//         const { data } = response;
//         setSupplier(data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }, []);

  const onFinish = (values: any) => {
    console.log(values);
    axios
      .post(apiName, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        createFrom.resetFields();
        message.success("Thêm mới danh mục thành công", 1.5);
      })
      .catch((err) => {});
  };
  const onUpdateFinish = (values: any) => {
    // console.log(values);

    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateFrom.resetFields();
        message.success("Cap nhat danh mục thành công", 1.5);
        setOpen(false);
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
          {/* <Form.Item
            label="Danh mục sản phẩm"
            name="categoryId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Danh mục sản phẩm bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhà cung cấp bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item> */}

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Lưu Thông Tin
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Table
        rowKey="id"
        dataSource={items}
        columns={columns}
        pagination={false}
      />

      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateFrom.submit();
        }}
      >
        <Form
          form={updateFrom}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          {/* <Form.Item
            label="Danh mục sản phẩm"
            name="categoryId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Danh mục sản phẩm bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={categories.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Nhà cung cấp"
            name="supplierId"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Nhà cung cấp bắt buộc phải chọn",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              options={suppliers.map((c) => {
                return { value: c._id, label: c.name };
              })}
            />
          </Form.Item> */}

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Tên sản phẩm bắt buộc phải nhập",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá bán"
            name="price"
            hasFeedback
            required={true}
            rules={[
              {
                required: true,
                message: "Giá bán bắt buộc phải nhập",
              },
            ]}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Giảm giá" name="discount" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Tồn kho" name="stock" hasFeedback>
            <InputNumber style={{ width: 200 }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
