import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
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
  const [sup, setSup] = React.useState<any[]>();
  const [product, setProduct] = React.useState<any[]>();
  const [stockStart, setStockStart] = React.useState("");
  const [stockEnd, setStockEnd] = React.useState("");
  const [priceStart, setPriceStart] = React.useState("");
  const [priceEnd, setPriceEnd] = React.useState("");
  const [discountStart, setDiscountStart] = React.useState("");
  const [discountEnd, setDiscountEnd] = React.useState("");
  const [skip, setSkip] = React.useState(0);
  const [limit, setLimit] = React.useState(5);

  const [updateForm] = Form.useForm();

//   const nextPage = () => {
//     setSkip(skip + limit);
//   };

//   const previousPage = () => {
//     setSkip(skip - limit);
//   };

  const onSelectPriceStartFilter = useCallback((e: any) => {
    setPriceStart(e.target.value);
  }, []);

  const onSelectPriceEndFilter = useCallback((e: any) => {
    setPriceEnd(e.target.value);
  }, []);

  const onSelectDiscountStartFilter = useCallback((e: any) => {
    setDiscountStart(e.target.value);
  }, []);

  const onSelectDiscountEndFilter = useCallback((e: any) => {
    setDiscountEnd(e.target.value);
  }, []);

  const onSelectStockStartFilter = useCallback((e: any) => {
    setStockStart(e.target.value);
  }, []);

  const onSelectStockEndFilter = useCallback((e: any) => {
    setStockEnd(e.target.value);
  }, []);

  const onSelectProductFilter = useCallback((e: any) => {
    setProduct(e.target.value);
  }, []);

  const onSelectCategoryFilter = useCallback((e: any) => {
    setCategory(e.target.value);
  }, []);

  const onSelectSupplierFilter = useCallback((e: any) => {
    setSup(e.target.value);
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
        // setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onSearch = useCallback(() => {
    let filters: {
      product: any;
      category: any;
      sup: any;
      stockStart: any;
      stockEnd: any;
      priceStart: any;
      priceEnd: any;
      discountStart: any;
      discountEnd: any;
      skip: any;
      limit: any;
    } = {
      product,
      category,
      sup,
      stockStart: stockStart || 0,
      stockEnd: stockEnd || 2000000,
      priceStart: priceStart || 0,
      priceEnd: priceEnd || 1000000000,
      discountStart: discountStart || 0,
      discountEnd: discountEnd || 75,
      skip: 0,
      limit: 5,
    };

    const searchParams: URLSearchParams = new URLSearchParams(filters);

    callApi(searchParams);
  }, [
    callApi,
    product,
    category,
    sup,
    stockStart,
    stockEnd,
    priceStart,
    priceEnd,
    discountStart,
    discountEnd,
    skip,
    limit,
  ]);

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
      <div style={{ padding: 24, display: "flex" }}>
        <Input
          placeholder="Tìm kiếm tên sản phẩm"
          onChange={onSelectProductFilter}
          value={product}
          allowClear
        />

        <select
          id="cars"
          onChange={onSelectSupplierFilter}
          style={{
            width: "50%",
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
          onChange={onSelectCategoryFilter}
          style={{
            width: "50%",
            borderRadius: "5px",
            height: "30px",
            marginLeft: "10px",
          }}
        >
          {categories.map((item: { _id: string; name: string }) => {
            console.log("item", item);
            return (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>

        <Input
          placeholder="Tồn kho nhỏ nhất"
          onChange={onSelectStockStartFilter}
          value={stockStart}
          allowClear
        />

        <Input
          placeholder="Tồn kho lớn nhất"
          onChange={onSelectStockEndFilter}
          value={stockEnd}
          allowClear
        />

        <Input
          placeholder="Giá nhỏ nhất"
          onChange={onSelectPriceStartFilter}
          value={priceStart}
          allowClear
        />

        <Input
          placeholder="Giá lớn nhất"
          onChange={onSelectPriceEndFilter}
          value={priceEnd}
          allowClear
        />

        <Input
          placeholder="Giảm giá nhỏ nhất"
          onChange={onSelectDiscountStartFilter}
          value={discountStart}
          allowClear
        />

        <Input
          placeholder="Giảm giá lớn nhất"
          onChange={onSelectDiscountEndFilter}
          value={discountEnd}
          allowClear
        />

        <Button
          type="primary"
          onClick={onSearch}
          style={{ marginLeft: "10px" }}
        >
          Search
        </Button>
      </div>

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
        <Pagination
          defaultCurrent={0}
          total={50}
        //   pageSize={limit}
          onChange={(skip, limit) => {
            const start = (skip - 1) * limit;
            const end = start + limit; //start +
            setItems(items.slice(start, end));
          }}
        />
      </Modal>
      
      {/* <div onClick={nextPage}> Previous Page </div>
     <div onClick={previousPage}> Next Page </div>  */}
    </div>
    
  );
}
