//import 'antd/dist/reset.css';
//import React from 'react';
//import './App.css';
//import Categories from './Pages/Categories';
//import Customer from './Pages/Customer';
//import Employee from './Pages/Employee';
//import Product from './Pages/Product';
//import Supplier from './Pages/Supplier';

//function App() {
//  return (
//    <div>
//      <Categories/>
//    {/*  <Product/> */}
//   {/*  <Customer/> */}
//  {/* <Supplier/> */}
//   {/*  <Employee/> */}
//    </div>
//  );
//}

//export default App;
import { Layout } from "antd";
import "antd/dist/reset.css";
import { Content, Footer } from "antd/es/layout/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import Categories from "./Pages/Categories";
import Homes from "./Pages/Homes";
import Product from "./Pages/Product";
import ProductLists from "./Pages/ProductLists";
import Supplier from "./Pages/Supplier";
import Employee from "./Pages/Employee";
import Customer from "./Pages/Customer";
import CategoryList from "./Pages/CategoryList";

import numeral from "numeral";
import "numeral/locales/vi";



const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  backgroundColor: "white",
};
const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#7dbcea",
};
const contentStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
};

numeral.locale("vi");

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Header style={headerStyle}>
          <NavigationBar />
        </Header>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/" element={<Homes />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Product />} />
            <Route path="/suppliers" element={<Supplier />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/product-list" element={<ProductLists />} />
            <Route path="/category-list" element={<CategoryList />} />
          </Routes>
        </Content>
        <Footer style={footerStyle}></Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
