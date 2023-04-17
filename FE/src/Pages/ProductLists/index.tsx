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
import axios from "../../libraries/axiosClient";
import React, { useCallback } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import numeral from "numeral";

const apiName = "/products";

export default function ProductList() {
  const [items, setItems] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSupplier] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [category, setCategory] = React.useState<any[]>();
  const [supplier, setSuppliers]= React.useState<any[]>();
  const [product, setProduct] = React.useState<any[]>();

  const [updateForm] = Form.useForm();

  const onSelectProductFilter = useCallback((e: any) => {
    setProduct(e.target.value);
    setCategory(e.target.value);
    setSuppliers(e.target.value);
  }, []);

  const callApi = useCallback((searchParams: any) => {
    console.log("searchParams", searchParams);
    console.log(
      "searchParams111",
      `${apiName}${`?${searchParams.toString()}`}`
    );
    axios
      .get(`${apiName}${`?${searchParams.toString()}`}`)
      .then((response) => {
        const { data } = response;
        setItems(data);
        setCategories(data);
        setSupplier(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onSearch = useCallback(() => {
    let filters: { product: any,  category: any ,supplier : any} = {
      product,
      category,
      supplier
    };

    const searchParams: URLSearchParams = new URLSearchParams(filters);

    callApi(searchParams);
  }, [callApi, product, category,supplier]);

  //   const [filterName, setFilterName] = React.useState<any[]>([]);

  //   const handleSearch = (e: any) => {
  //     setFilterName(e.target.value);
  //   };

  //   const filteredData = items.filter(
  //     (item) => item.name.indexOf(filterName) !== -1 // kiểm tra nếu tên của danh mục chứa từ khóa tìm kiếm
  //   );

  //   const dataSource = filteredData.map((item) => ({
  //     key: item.id,
  //     name: item.name,
  //     price: item.price,
  //     discount: item.discount,
  //     stock: item.stock,
  //     categoryId: item.categoryId,
  //     supplierId: item.supplierId,
  //   }));

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
    {
      title: "Tên danh mục",
      dataIndex: "category.name",
      key: "category.name",
      render: (text, record, index) => {
        // console.log("record", record);
        // console.log('index',index)
        return <span>{record?.category?.name}</span>;
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier.name",
      key: "supplier.name",
      render: (text, record, index) => {
        return <span>{record?.supplier?.name}</span>;
      },
    },
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
                setUpdateId(record._id);
                updateForm.setFieldsValue(record);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                console.log(record.id);
                axios.delete(apiName + "/" + record._id).then((response) => {
                  setRefresh((f) => f + 1);
                  message.success("Xóa danh mục thành công!", 1.5);
                });
              }}
            />
          </Space>
        );
      },
    },
  ];

  // Get products
  React.useEffect(() => {
    axios
      .get(apiName)
      .then((response) => {
        const { data } = response;
        setItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  // Get categories
  React.useEffect(() => {
    axios
      .get("/categories")
      .then((response) => {
        const { data } = response;
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get("/suppliers")
      .then((response) => {
        const { data } = response;
        setSupplier(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

  const onUpdateFinish = (values: any) => {
    axios
      .patch(apiName + "/" + updateId, values)
      .then((response) => {
        setRefresh((f) => f + 1);
        updateForm.resetFields();
        message.success("Cập nhật thành công!", 1.5);
        setOpen(false);
      })
      .catch((err) => {});
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <select id="cars" onChange={onSelectProductFilter}>
          {items.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>

        <button onClick={onSearch}> TÌM KIẾM</button>
      </div>

      <div>
        <select id="cars" onChange={onSelectProductFilter}>
          {suppliers.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>

        <button onClick={onSearch}> TÌM KIẾM</button>
      </div>
      
      <div>
        <select id="cars" onChange={onSelectProductFilter}>
          {categories.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>

        <button onClick={onSearch}> TÌM KIẾM</button>
      </div>
      {/* <Input
          placeholder="Tìm kiếm danh mục"
          onChange={handleSearch}
          allowClear
        /> */}

      <Table
        rowKey={"_id"}
        dataSource={items}
        columns={columns}
        // pagination={false}
        // dataSource={dataSource}
      />

      {/* EDIT FORM */}

      <Modal
        open={open}
        title="Cập nhật danh mục"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Đóng"
        okText="Lưu thông tin"
        onOk={() => {
          updateForm.submit();
        }}
      >
        <Form
          form={updateForm}
          name="update-form"
          onFinish={onUpdateFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
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
          </Form.Item>

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
        </Form>
      </Modal>
    </div>
  );
}
