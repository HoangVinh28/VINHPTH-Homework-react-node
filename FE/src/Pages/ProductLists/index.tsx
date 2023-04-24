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

const initialState = {
  category: [],
  sup: [],
  product: "",
  stockStart: "",
  stockEnd: "",
  priceStart: "",
  priceEnd: "",
  discountStart: "",
  discountEnd: "",
};
const allOption = [{ _id: "", name: "----All----" }];

const apiName = "/products";

export default function ProductList() {
  const [items, setItems] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [suppliers, setSupplier] = React.useState<any[]>([]);

  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [updateForm] = Form.useForm();

  const [filter, setFilter] = React.useState<any>(initialState);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [total, setTotal] = React.useState<number>();
  const [deleteProductId, setDeleteProductId] = React.useState<number>(0);
  const [showDeleteConfirm, setShowDeleteConfirm] =
    React.useState<boolean>(false);

  const create = () => {
    window.location.href = "/products";
  };

  const onChangeFilter = useCallback((e: any) => {
    setFilter((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }, []);

  console.log("filter", filter);

  const callApi = useCallback((searchParams: any) => {
    console.log(
      "searchParams111",
      `${apiName}${`?${searchParams.toString()}`}`
    );
    axios
      .get(`${apiName}${`?${searchParams.toString()}`}`)
      .then((response) => {
        const { data } = response;
        setItems(data.payload);
        setTotal(data.total);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //   const onSearch = useCallback(() => {
  //     const filterFields = Object.keys(filter).filter(
  //       (key) => filter[key] !== undefined && filter[key] !== ""
  //     );

  //     const searchParams = new URLSearchParams(
  //       filterFields.map((key) => {
  //         return [key, filter[key]];
  //       })
  //     );

  //     callApi(searchParams);
  //   }, [callApi, filter]);

  const onSearch = useCallback(() => {
    const checkInputData = (input: any, name: any) => {
      if ((input && isNaN(input)) || (input && input < 0)) {
        message.error(`Dữ liệu nhập vào ô ${name} không hợp lệ!`);

        return true;
      }

      return false;
    };
    // Kiểm tra dữ liệu nhập vào từng ô tìm kiếm
    const isInvalidData =
      checkInputData(filter.stockStart, "Tồn kho") ||
      checkInputData(filter.stockEnd, "Tồn kho") ||
      checkInputData(filter.priceStart, "Giá bán") ||
      checkInputData(filter.priceEnd, "Giá bán") ||
      checkInputData(filter.discountStart, "Giảm giá") ||
      checkInputData(filter.discountEnd, "Giảm giá");

    if (isInvalidData) return;
    // Lọc các trường có giá trị để tạo query params
    const filterFields = Object.keys(filter).filter(
      (key) => filter[key] !== undefined && filter[key] !== ""
    );

    // Tạo query params từ các trường đã lọc
    const searchParams = new URLSearchParams(
      filterFields.map((key) => {
        return [key, filter[key]];
      })
    );

    // Gọi API với các query params đã tạo
    callApi(searchParams);
  }, [callApi, filter]);

  const resetFilter = useCallback(() => {
    setFilter(initialState);
    // callApi(URLSearchParams);
    callApi(initialState)
  }, [callApi]);

  // Hàm hiển thị xác nhận xóa
  const showConfirmDelete = (productId: number) => {
    setDeleteProductId(productId);
    setShowDeleteConfirm(true);
  };
  // Hàm xóa sản phẩm
  const handleDeleteProduct = () => {
    axios.delete(apiName + "/" + deleteProductId).then((response) => {
      setRefresh((f) => f + 1);
      message.success("Xóa sản phẩm thành công!", 1.5);
      setShowDeleteConfirm(false);
    });
  };

  // Modal xác nhận xóa sản phẩm
  const deleteConfirmModal = (
    <Modal
      title="Xóa sản phẩm"
      open={showDeleteConfirm}
      onOk={handleDeleteProduct}
      onCancel={() => setShowDeleteConfirm(false)}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa sản phẩm?</p>
    </Modal>
  );

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
                // console.log(record.id);
                // axios.delete(apiName + "/" + record._id).then((response) => {
                //   setRefresh((f) => f + 1);
                //   message.success("Xóa danh mục thành công!", 1.5);
                // });
                showConfirmDelete(record._id);
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
        setItems(data.payload);
        setTotal(data.total);
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
        // setCategories(data);
        setCategories([...allOption, ...data]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Get suppliers
  React.useEffect(() => {
    axios
      .get("/suppliers")
      .then((response) => {
        const { data } = response;
        // setSupplier(data);
        setSupplier([...allOption, ...data]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  React.useEffect(() => {
    let filters: {
      skip: any;
      limit: any;
    } = {
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
    };
    // const searchParams: URLSearchParams = new URLSearchParams(filters);

    // callApi(searchParams);
    callApi(filters);
  }, [callApi, currentPage, pageSize]);

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
      <div
        style={{
          padding: 24,
          display: "flex",
          border: "1px solid #ccc",
          marginBottom: "20px",
          borderRadius: "5px",
          backgroundColor: "#ffcccc",
        }}
      >
        <Input
          placeholder="Tìm kiếm tên sản phẩm"
          name="product"
          onChange={onChangeFilter}
          value={filter.product}
          allowClear
        />

        <select
          id="cars"
          name="sup"
          value = {filter.sup}
          onChange={onChangeFilter}
          style={{
            width: "100px",
            borderRadius: "5px",
            height: "30px",
            marginLeft: "10px",
          }}
        >
          {suppliers.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>

        <select
          id="cars"
          name="category"
          value = {filter.category}
          onChange={onChangeFilter}
          style={{
            width: "150px",
            borderRadius: "5px",
            height: "30px",
            marginLeft: "10px",
          }}
        >
          {categories.map((item: { _id: string; name: string }) => {
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Stock Min"
          name="stockStart"
          onChange={onChangeFilter}
          value={filter.stockStart}
          allowClear
        />

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Stock Max"
          name="stockEnd"
          value={filter.stockEnd}
          onChange={onChangeFilter}
          allowClear
        />

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Price Min"
          name="priceStart"
          value={filter.priceStart}
          onChange={onChangeFilter}
          allowClear
        />

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Price Max"
          name="priceEnd"
          value={filter.priceEnd}
          onChange={onChangeFilter}
          allowClear
        />

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Discount Min"
          name="discountStart"
          value={filter.discountStart}
          onChange={onChangeFilter}
          allowClear
        />

        <Input
          style={{ marginLeft: "10px" }}
          placeholder="Discount Max"
          name="discountEnd"
          value={filter.discountEnd}
          onChange={onChangeFilter}
          allowClear
        />

        <Button
          type="primary"
          onClick={onSearch}
          style={{ marginLeft: "10px" }}
        >
          Search
        </Button>

        <Button
          type="primary"
          onClick={resetFilter}
          style={{ marginLeft: "10px" }}
        >
          Refresh
        </Button>

        <Button type="primary" onClick={create} style={{ marginLeft: "10px" }}>
          Create
        </Button>
      </div>

      <Table
        style={{ border: "1px solid black", borderRadius: "5px" }}
        rowKey={"_id"}
        dataSource={items}
        columns={columns}
        pagination={{
          total: total,
          current: currentPage,
          pageSize: pageSize,
          onChange: (page) => setCurrentPage(page),
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />
      {deleteConfirmModal}

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
