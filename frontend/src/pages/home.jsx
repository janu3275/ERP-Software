import { useState } from "react";
import "./home.css";
import Navbar from "../components/globalcomponents/navbar";
import Dashboard from "../components/sidebarcomponents/dashboard/dashboard";
import Sidebar from '../components/globalcomponents/sidebar';
import Notification from '../components/globalcomponents/notification';
import Vendor from "../components/sidebarcomponents/vendorAccounting/catalog/vendor";
import Transaction from '../components/sidebarcomponents/transactions/transactions';
import VendorAccounting from "../components/sidebarcomponents/vendorAccounting/vendorAccounting";
import EmployeeManagement from "../components/sidebarcomponents/employeeManagement/employeeManagement";
import OrderManagement from "../components/sidebarcomponents/orders/orderManagement";
import Catalog from "../components/sidebarcomponents/catalog/catalog";
import CustomerManagement from "../components/sidebarcomponents/customerManagement/customerManagement";
import OtherExpenses from "../components/sidebarcomponents/otherExpenses/OtherExpenses";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entertedSidebar, setenteredSidebar] = useState(false);
  const [openPage, setOpenPage] = useState({
    dashboard: false,
    orderPage: false,
    ordersNotYetStartedPage: false,
    ordersInProcessPage: false,
    ordersCompletedPage: false,
    ordersSentForDileveryPage: false,
    ordersDileveredPage: false,
    ordersHoldPage: false,
    ordersRemovedPage: false,
    customerPage: false,
    unitPage: false,
    colorPage:false,
    thicknessPage:false,
    sizePage:false,
    glassCompanyPage:false,
    glassTypePage: false,
    departmentPage:false,
    positionPage: false,
    employeePage:false,
    vendorPage: false,
    glassProductPage: false,
    glassInventoryPage: false,
    glassAccessoryPage: false,
    otherProductPage: false, 
    glassCustomizationpage: false,
    dileveryPage:false,
    fittingPage:false,
    measurementPage: false,
    transactionPage: false,
    vendorAccountingPage: false,
    employeeManagementPage: false,
    orderManagementPage: true,
    catalogPage: false,
    customerManagementPage: false,
    otherExpensePage: false

  });

  const sidebaropen = sidebarOpen || entertedSidebar;


  const openComponent = (pagename) => {

    if(openPage[pagename]){
      return
    }

    setOpenPage((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === pagename;
        return acc;
      }, {});
      return newState;
    });
  
  

  }

  const handleMenuClick = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const handleSidebarHover = () => {
    setenteredSidebar((prevState) => !prevState);
  };

  return (
    <>
      <Navbar open={sidebarOpen} onMenuClick={handleMenuClick} />
      <div className="maincomponent">
      <Sidebar
        sidebaropen={sidebaropen}
        handleSidebarHover={handleSidebarHover}
        openComponent={openComponent}
        open={sidebarOpen} 
        onMenuClick={handleMenuClick}
        openPage={openPage}
      />
      {/* <Notification /> */}
      <div  className={sidebarOpen?"rightcomponent adjust":"rightcomponent"}>
        
      {openPage.dashboard && <Dashboard />}
      {openPage.vendorPage && <Vendor />}
      {openPage.transactionPage && <Transaction />}
      {openPage.vendorAccountingPage && <VendorAccounting />}
      {openPage.employeeManagementPage && <EmployeeManagement />}
      {openPage.orderManagementPage && <OrderManagement />}
      {openPage.catalogPage && <Catalog />}
      {openPage.customerManagementPage && <CustomerManagement />}
      {openPage.otherExpensePage && <OtherExpenses />}
      </div>

      </div>
      
    </>
  );
};

export default Home ;
