import PropTypes from "prop-types";
import "./sidebar.css";
import { useState } from "react";
import { checkToken } from "../../commonfn";
import { Icon } from "@iconify/react/dist/iconify.js";

const Sidebar = ({
     sidebaropen,

     handleSidebarHover, 
   
     openComponent,
     open,
     onMenuClick,
     openPage
    
    }) => {

   
      const { CompanyTokenValid, UserTokenValid, marketTokenValid } = checkToken();
  
  return (
    <aside
      className={`sidebar ${sidebaropen ? "open" : ""}`}
      // onMouseEnter={handleSidebarHover}
      // onMouseLeave={handleSidebarHover}

    >
      
      <ul className="menu">
      <li className="top-item">
      <div style={{display:"flex", gap:"10px", alignItems:"center"}}>
      {CompanyTokenValid && UserTokenValid && marketTokenValid && <button className={open?"menu-button open":"menu-button"} onClick={onMenuClick}>
        ☰
      </button> }
      <h2 className={sidebaropen ? "brand" : "brand close"}>AasanVyapaar</h2>
      </div>
        </li>
        {/* <li onClick={()=>openComponent('dashboard')}  className="menu-item">
          <span className="icon">&#9733;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            {" "}
            Dashboard{" "}
          </div>
          
        </li> */}
        <li onClick={()=>openComponent('orderManagementPage')}  className={openPage.orderManagementPage?"menu-item selecteditem":"menu-item"}>
          {/* <span className="icon">&#9733;</span> */}
          <Icon
            icon="lets-icons:order"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            {" "}
            Order management{" "}
          </div>
        </li>
        {/* <li onClick={()=>openComponent('orderPage')} className="menu-item">
          <span className="icon">&#9733;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            {" "}
            New Order{" "}
          </div>
        </li>
        <li onClick={()=>setopenorder((prev)=>!prev)} className="menu-item">
          <span className="icon">&#9734;</span>
          <div  className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Orders
          </div>
        </li>
        {openOrder && <>
        <li onClick={()=>openComponent('ordersNotYetStartedPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Not yet started</div>
        </li>
         <li onClick={()=>openComponent('ordersInProcessPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>In process</div>
        </li>
        <li onClick={()=>openComponent('ordersCompletedPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Completed</div>
        </li>
        <li onClick={()=>openComponent('ordersSentForDileveryPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Sent for dilevery</div>
        </li>
        <li onClick={()=>openComponent('ordersDileveredPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Dilevered</div>
        </li>
        <li onClick={()=>openComponent('ordersHoldPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Hold</div>
        </li>
        <li onClick={()=>openComponent('ordersRemovedPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Removed</div>
        </li>
         </>
        } */}
        {/* <li onClick={()=>setopenServices((prev)=>!prev)} className="menu-item">
          <span className="icon">&#9734;</span>
          <div  className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Services
          </div>
        </li>
         {openServices && <>
        <li onClick={()=>openComponent('glassCustomizationpage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Glass customization</div>
        </li>
         <li onClick={()=>openComponent('dileveryPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Dilevery</div>
        </li>
        <li onClick={()=>openComponent('fittingPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Fitting</div>
        </li>
        <li onClick={()=>openComponent('measurementPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Measurement</div>
        </li>
         </>
        }
        <li onClick={()=>openComponent('customerPage')} className="menu-item">
          <span className="icon">&#9998;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Customers
          </div>
        </li>

        <li onClick={()=>setopenProducs((prev)=>!prev)} className="menu-item">
          <span className="icon">&#9734;</span>
          <div  className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Products
          </div>
        </li>
        {openproducts && <>
        <li onClick={()=>openComponent('glassProductPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Glass Products</div>
        </li>
        <li onClick={()=>openComponent('glassInventoryPage')} className={sidebaropen?"sub-menu-item":"menu-item"} >
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Glass Inventory</div>
        </li>
         <li onClick={()=>openComponent('glassAccessoryPage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Glass Accessories</div>
         </li>
         <li onClick={()=>openComponent('otherProductPage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Other Products</div>
         </li>
         </>
        }

        <li onClick={()=>openComponent('unitPage')} className="menu-item">
          <span className="icon">&#9734;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Units
          </div>
        </li>
        <li onClick={()=>openComponent('positionPage')} className="menu-item">
          <span className="icon">&#9734;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Positions
          </div>
        </li>
        <li onClick={()=>openComponent('departmentPage')} className="menu-item">
          <span className="icon">&#9734;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Departments
          </div>
        </li>
        <li onClick={()=>openComponent('vendorPage')} className="menu-item">
          <span className="icon">&#9734;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Vendors
          </div>
        </li>
        <li onClick={()=>openComponent('employeePage')} className="menu-item">
          <span className="icon">&#9734;</span>
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Employees
          </div>
        </li>

     

      
        <li onClick={()=>setopenGlassProperties((prev)=>!prev)} className="menu-item">
          <span className="icon">&#9734;</span>
          <div  className={sidebaropen ? "sidebarlist" : "sidebarlist close"} >
            Glass properties
          </div>
        </li>
        {openGlassProperties && <>
        <li onClick={()=>openComponent('colorPage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Color</div>
        </li>
         <li onClick={()=>openComponent('thicknessPage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Thickness</div>
        </li>
        <li onClick={()=>openComponent('sizePage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Size</div>
        </li>
         <li onClick={()=>openComponent('glassCompanyPage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Company</div>
        </li>
        <li onClick={()=>openComponent('glassTypePage')} className={sidebaropen?"sub-menu-item":"menu-item"}>
          <span  className="icon">&#9734;</span>
           <div className={sidebaropen ? 'sidebarlist' : 'sidebarlist close'}>Glass type</div>
        </li>
         </>
        } */}

         <li onClick={()=>openComponent('customerManagementPage')} className={openPage.customerManagementPage?"menu-item selecteditem":"menu-item"} >
          {/* <span className="icon">&#9998;</span> */}
          <Icon
            icon="bi:people"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"} >
            Customer Management
          </div>
        </li>

       

        <li onClick={()=>openComponent('vendorAccountingPage')} className={openPage.vendorAccountingPage?"menu-item selecteditem":"menu-item"}>
          {/* <span className="icon">&#9998;</span> */}
          <Icon
            icon="clarity:employee-line"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Vendor Management
          </div>
        </li>

        <li onClick={()=>openComponent('employeeManagementPage')} className={openPage.employeeManagementPage?"menu-item selecteditem":"menu-item"}>
          {/* <span className="icon">&#9998;</span> */}
          <Icon
            icon="bi:person-vcard"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Employee Management
          </div>
        </li>

        <li onClick={()=>openComponent('otherExpensePage')} className={openPage.otherExpensePage?"menu-item selecteditem":"menu-item"}>
          {/* <span className="icon">&#9733;</span> */}
          <Icon
            icon="ph:money-wavy"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            {" "}
            Other expenses{" "}
          </div>
        </li>

        <li onClick={()=>openComponent('transactionPage')} className={openPage.transactionPage?"menu-item selecteditem":"menu-item"} >
          {/* <span className="icon">&#9998;</span> */}
          <Icon
            icon="material-symbols-light:library-books-outline"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            Transactions
          </div>
        </li>

        
        <li onClick={()=>openComponent('catalogPage')} className={openPage.catalogPage?"menu-item selecteditem":"menu-item"}>
          {/* <span className="icon">&#9733;</span> */}
          <Icon
            icon="hugeicons:catalogue"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
           
          />
          <div className={sidebaropen ? "sidebarlist" : "sidebarlist close"}>
            {" "}
            Catalogue{" "}
          </div>
        </li>

      
        

        {/* Add more sidebar items as needed */}
      </ul>
    </aside>
  );
};



Sidebar.propTypes = {

  sidebaropen: PropTypes.bool,
  handleSidebarHover: PropTypes.func,
  open: PropTypes.bool,
  onMenuClick: PropTypes.func,
  openComponent: PropTypes.func,
  openPage: PropTypes.any
  
};

export default Sidebar;
