import { DatabaseOutlined, HomeOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import React from "react";

import { useNavigate } from "react-router-dom";

const items: MenuProps["items"] = [
  {
    label: "Home",
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: "Management",
    key: "management",
    icon: <UnorderedListOutlined />,
    children: [
      {
        label: "Categories",
        key: "categories",
      },
      {
        label: "Suppliers",
        key: "suppliers",
      },
      {
        label: "Product",
        key: "/product-list",
      },
      {
        label: "Customers",
        key: "customers",
      },
      {
        label: "Employees",
        key: "employees",
      },
    ],
  },
  {
    label: "Create",
    key: "create",
    icon: <DatabaseOutlined /> ,
    children: [
      {
        label: "Products",
        key: "products",
      },
    ],
  },
  {
    label: "Orders",
    key: "orders",
  },
];

export default function NavigationBar() {
  const navigate = useNavigate();

  const [current, setCurrent] = React.useState("home");

  return (
    <Menu
      //   theme='#ffccc7'
    //   style={{ backgroundColor: "#ffccc7", borderRadius : '5px' }}
      onClick={(e) => {
        console.log(e);
        setCurrent(e.key);
        navigate(e.key);
      }}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
}
