import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Pagination,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import axios from "../../libraries/axiosClient";
import React, { useCallback } from "react";

const apiName = "/categories";

/* const API_URL = 'http://localhost:9000/categories'; */
export default function CategoryList() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [listSelect, setListSelect] = React.useState<any[]>([]);
  const [refresh, setRefresh] = React.useState<number>(0);
  const [open, setOpen] = React.useState<boolean>(false);
  const [updateId, setUpdateId] = React.useState<number>(0);

  const [category, setCategory] = React.useState<any[]>();
  const [updateFrom] = Form.useForm();

    const onSelectCategoryFilter = useCallback((e: any) => {
      setCategory(e.target.value);
    }, []);

    const callApi = useCallback((searchParams: any) => {
        console.log('searchParams', searchParams);
        console.log('searchParams111', `${apiName}${`?${searchParams.toString()}`}`);
      axios
        .get(`${apiName}${`?${searchParams.toString()}`}`)
        .then((response) => {
          const { data } = response;
          setCategories(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, []);

    const onSearch = useCallback(() => {
      let filters: { category: any } = {
        category,
      };

      const searchParams: URLSearchParams = new URLSearchParams(filters);
      console.log('filters', filters);
      console.log('searchParams', searchParams);
      

      callApi(searchParams);
    }, [callApi, category]);

  const [filterName, setFilterName] = React.useState<any[]>([]);

  const handleSearch = (e: any) => {
    setFilterName(e.target.value);
  };

  const filteredData = categories.filter(
    (item) => item.name.indexOf(filterName) !== -1 // kiểm tra nếu tên của danh mục chứa từ khóa tìm kiếm
  );


    const dataSource = filteredData.map((item) => ({
      key: item.id,
      name: item.name,
      description: item.description,
    }));

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
      title: "Ten danh muc",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return <strong style={{ color: "#fab1a0" }}>{text}</strong>;
      },
    },
    {
      title: "Ghi chu",
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
                setUpdateId(record._id);
                updateFrom.setFieldsValue(record);
              }}
            />

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                axios.delete(apiName + "/" + record._id).then((response) => {
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
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [refresh]);

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
      <div>
        <select id="cars" onChange={onSelectCategoryFilter}>
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
      <Input
        placeholder="Tìm kiếm danh mục"
        onChange={handleSearch}
        allowClear
      />

      <Table
        //key="_id"
        rowKey={"_id"}
        // dataSource={categories}
        columns={columns}
        // pagination={false}
        dataSource={dataSource}
      />

      {/* <TableRow key={item.id} item={item} /> */}

      <Modal
        open={open}
        title="Cap nhat danh muc"
        onCancel={() => {
          setOpen(false);
        }}
        cancelText="Dong"
        okText="Luu thong tin"
        onOk={() => {
          updateFrom.submit();
        }}
      >
        <Form
          form={updateFrom}
          name="update-form"
          onFinish={onUpdateFinish}
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
        </Form>
        <Pagination
          defaultCurrent={1}
          total={50}
          pageSize={10}
          onChange={(page, pageSize) => {
            const start = (page - 1) * pageSize;
            const end = start + pageSize; //start +
            setCategories(categories.slice(start, end));
          }}
        />
      </Modal>
    </div>
  );
}
