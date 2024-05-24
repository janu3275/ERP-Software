import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

import Cashicon from "../../../../assets/icons/reshot-icon-money-2AJCZGWB6U.svg";
import Chequeicon from "../../../../assets/icons/cheque-finance-business-svgrepo-com.svg";
import UPIIcon from "../../../../assets/icons/upi-payment-icon.svg";
import OtherIcon from "../../../../assets/icons/apps-grid-icon.svg";
import "./neworder.css";
import { Axios } from "../../../../../utils/axios.mjs";
import { generateRandomId, removeObjectKey, uploadPdfToS3 } from "../../../../commonfn";
import { useNotificationStore } from "../../../../../strore/notificationStore";
import Generalinfo from './generalinfo/generalinfo';
import Productsinfo from "./products/products";
import Paymentinfo from "./payment/paymentinfo";
// import Paymenthis from "./paymenthis/paymenthis";

const NewOrder = ({ selectedorder}) => {
  const {addNotification} = useNotificationStore(
    // (state) => state.addNotification
  );

  const [openOrderForm, setOpenOrderForm] = useState(false);
  // const [openPaymentForm, setOpenPaymentForm] = useState(false);


//  const handleOpenPaymentForm = (bool)=>{
//    if(bool){
//     setOpenPaymentForm(bool)
//    }else{
//     setOpenPaymentForm(bool)
//     setselectedpaymenthis(null)
//    }
   

//  }

  const handleDateChange = (date) => {
    setGeneralInfo((prev) => {
      return {
        ...prev,
        completionDate: date,
      };
    });
    // Update the state with the selected date
  };



  const getTodaysdate = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = today.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    const mindate = `${year}-${month}-${day}`;

    return { formattedDate, mindate };
  };

  const getFormattedDate = (inputDate) => {
    const dateComponents = inputDate.split("-");

    // Rearrange the components into the "YYYY-MM-DD" format
    const formattedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
    return formattedDate;
  };
  const [initialgeneralInfo, setinitialgeneralInfo] = useState({
    orderno: generateRandomId(10),
    date: getTodaysdate().formattedDate,
    customer: {
      name: "",
      id: "",
    },
    measuredby: "",
    completionDate: "",
    products: [],
    payment: {
      productCharge: 0,
      MeasurementCharge: {
        noOfPersons:0,
        noofHours:0,
        distance:0,
        total:0
      },
      DileveryCharge: {
        vehichleType:"",
        distance:0,
        total:0
      },
      fittingCharge: {
        noOfPersons:0,
        noofHours:0,
        total:0
      },
      labourCharge:0,
      // paid: 0,
      
      // paidOptionInfo: [
      //   {
      //     via: "Cash",
      //     label: "Cash",
      //     icon: (
      //       <div className="cashdiv">
      //         <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "UPI",
      //     label: "Google Pay UPI",
      //     icon: (
      //       <div className="UPIdiv">
      //         <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "Cheque",
      //     label: "Cheque",
      //     icon: (
      //       <div className="chequediv">
      //         <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "Other",
      //     label: "Other",
      //     icon: (
      //       <div className="Otherdiv">
      //         <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   }
      // ],
      
      discount: 0,
    },
    // paymenthis: [],
  });
  const [generalInfo, setGeneralInfo] = useState({
    orderno: generateRandomId(10),
    date: getTodaysdate().formattedDate,
    customer: {
      name: "",
      id: "",
    },
    measuredby: "",
    completionDate: "",
    products: [],
    payment: {
      productCharge: 0,
      MeasurementCharge: {
        noOfPersons:0,
        noofHours:0,
        distance:0,
        total:0
      },
      DileveryCharge: {
        vehichleType:"",
        distance:0,
        total:0
      },
      fittingCharge: {
        noOfPersons:0,
        noofHours:0,
        total:0
      },
      labourCharge:0,
      // paid: 0,
      
      // paidOptionInfo: [
      //   {
      //     via: "Cash",
      //     label: "Cash",
      //     icon: (
      //       <div className="cashdiv">
      //         <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "UPI",
      //     label: "Google Pay UPI",
      //     icon: (
      //       <div className="UPIdiv">
      //         <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "Cheque",
      //     label: "Cheque",
      //     icon: (
      //       <div className="chequediv">
      //         <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
      //   {
      //     via: "Other",
      //     label: "Other",
      //     icon: (
      //       <div className="Otherdiv">
      //         <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
      //       </div>
      //     ),
      //     checked: true,
      //     amount: 0,
      //   },
    
      // ],
      
      discount: 0
    },
    // paymenthis: [],
  });

  // const [addpaymentinfo, setaddpaymentinfo] = useState({
  //   paymentid: generateRandomId(10),
  //   paid: 0,
  //   date: "",
  //   paidOptionInfo: [
  //     {
  //       via: "Cash",
  //       label: "Cash",
  //       icon: (
  //         <div className="cashdiv">
  //           <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount: 0
  //     },
  //     {
  //       via: "UPI",
  //       label: "Google Pay UPI",
  //       icon: (
  //         <div className="UPIdiv">
  //           <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount: 0,
  //     },
  //    {
  //       via: "Cheque",
  //       label: "Cheque",
  //       icon: (
  //         <div className="chequediv">
  //           <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount: 0,
  //     }, {
  //       via: "Other",
  //       label: "Other",
  //       icon: (
  //         <div className="Otherdiv">
  //           <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount: 0,
  //     }
  //   ],
  //   note: ""
  // });

  // const [selectedpaymenthis, setselectedpaymenthis] = useState(null);
  const [selectedobj, setselectedobj] = useState(null);

  const additem = (newitem) => {
    console.log(newitem);

    setGeneralInfo((prev) => {
      return {
        ...prev,
        products: [...prev.products, newitem],
      };
    });

    setOpenOrderForm(false);
  };

  const deleteitem = (id, product) => {
    setGeneralInfo((prev) => {
      return {
        ...prev,
        products: prev.products.filter((item) => item.id !== id),
      };
    });
  };

  const updateitem = (id, updateditem) => {
    setGeneralInfo((prev) => {
      return {
        ...prev,
        products: prev.products.map((item) => {
          if (item.id === id) {
            return updateditem;
          }

          return item;
        }),
      };
    });

    setOpenOrderForm(false);
  };

  // const handlePaymentAmountChange = (e, via, index) => {
  //   let newamount = e.target.value;

  //   newamount = parseFloat(newamount);
  //   console.log(typeof newamount, newamount, e);

  //   if (!(Number.isInteger(newamount) && newamount >= 0)) {
  //     return;
  //   }
  //   console.log(newamount);
  //   let paymentinfo = generalInfo.payment;
  //   let newpaymentinfo = {
  //     ...paymentinfo,
  //     paidOptionInfo: paymentinfo.paidOptionInfo.map((option) => {
  //       if (option.via === via) {
  //         return {
  //           ...option,
  //           amount: newamount,
  //         };
  //       }
  //       return option;
  //     }),
  //   };

  //   let totalpaid = 0;
  //   newpaymentinfo.paidOptionInfo
  //     .forEach((option) => {
  //       totalpaid = totalpaid +parseFloat(option.amount);
  //     });

  //   //    setpaymentoptions(newpaymentinfo)
  //   //    setpaymentinfo({
  //   //     ...newpaymentinfo,
  //   //     paid: totalpaid
  //   // })

  //   setGeneralInfo((prev) => {
  //     return {
  //       ...prev,
  //       payment: {
  //         ...newpaymentinfo,
  //         paid: totalpaid,
  //       },
  //     };
  //   });
  // };

  // const handlePaymentcheckchange = (check, via) => {
  //   console.log(check);
  //   let paymentinfo = generalInfo.payment;
  //   let newpaymentinfo = {
  //     ...paymentinfo,
  //     paidOptionInfo: paymentinfo.paidOptionInfo.map((option) => {
  //       if (option.via === via) {
  //         return {
  //           ...option,
  //           checked: check,
  //           amount: check ? option.amount : 0,
  //         };
  //       }
  //       return option;
  //     }),
  //   };

  //   let totalpaid = 0;

  //   // setpaymentoptions(newpaymentinfo)

  //   newpaymentinfo.paidOptionInfo
  //     .filter((option) => option.checked)
  //     .forEach((option) => {
  //       totalpaid = totalpaid +parseFloat(option.amount);
  //     });

  //   //    setpaymentinfo({
  //   //  ...newpaymentinfo,
  //   //     paid: totalpaid
  //   // })

  //   setGeneralInfo((prev) => {
  //     return {
  //       ...prev,
  //       payment: {
  //         ...newpaymentinfo,
  //         paid: totalpaid,
  //       },
  //     };
  //   });
  // };

  // const handlePaymenthisAmountChange = (e, via, index) => {
  //   let newamount = e.target.value;
  //   console.log("🚀 ~ handlePaymenthisAmountChange ~ newamount:", newamount);
    
  //   newamount =parseFloat(newamount);
  //   console.log(typeof newamount, newamount);

  //   if (!(Number.isInteger(newamount) && newamount >= 0)) {
  //     return;
  //   }
  //   console.log(newamount);

  //   let newpaymentinfo = {
  //     ...addpaymentinfo,
  //     paidOptionInfo: addpaymentinfo.paidOptionInfo.map((option) => {
  //       if (option.via === via) {
  //         return {
  //           ...option,
  //           amount: newamount,
  //         };
  //       }
  //       return option;
  //     }),
  //   };

  //   let totalpaid = 0;
  //   newpaymentinfo.paidOptionInfo
  //     .filter((option) => option.checked)
  //     .forEach((option) => {
  //       totalpaid = totalpaid +parseFloat(option.amount);
  //     });

  //   setaddpaymentinfo({
  //     ...newpaymentinfo,
  //     paid: totalpaid,
  //   });
  // };

  // const handlePaymenthischeckchange = (check, via) => {
  //   console.log(check);
  //   let newpaymentinfo = {
  //     ...addpaymentinfo,
  //     paidOptionInfo: addpaymentinfo.paidOptionInfo.map((option) => {
  //       if (option.via === via) {
  //         return {
  //           ...option,
  //           checked: check,
  //           amount: check ? option.amount : 0,
  //         };
  //       }
  //       return option;
  //     }),
  //   };

  //   let totalpaid = 0;

  //   // setpaymentoptions(newpaymentinfo)

  //   newpaymentinfo.paidOptionInfo
  //     .filter((option) => option.checked)
  //     .forEach((option) => {
  //       totalpaid = totalpaid +parseFloat(option.amount);
  //     });

  //   setaddpaymentinfo({
  //     ...newpaymentinfo,
  //     paid: totalpaid,
  //   });
  // };

  // const addPaymentHistory = (paymentinfo) => {
  //   const formattedPaymenthis = formatPaymentHis(paymentinfo)

  //   setGeneralInfo((prev) => {
  //     return {
  //       ...prev,
  //       paymenthis: [...prev.paymenthis, { ...formattedPaymenthis }],
  //     };
  //   });

  //   setOpenPaymentForm(false);
  //   setselectedpaymenthis(null)
  // };

  // const updatePaymentHistory = (paymentinfo) => {
  //   setGeneralInfo((prev) => {
  //     return {
  //       ...prev,
  //       paymenthis: prev.paymenthis.map((paymenthis) => {
  //         if (paymenthis.paymentid === paymentinfo.paymentid) {
  //           return paymentinfo;
  //         }
  //         return paymenthis;
  //       }),
  //     };
  //   });
  //   setOpenPaymentForm(false);
  //   setselectedpaymenthis(null)
   
  // };

  // const DeletePaymentHis = (paymentinfo, paid) => {
  //   setGeneralInfo((prev) => {
  //     console.log(prev)
  //     return {
  //       ...prev,
  //       paymenthis: prev.paymenthis.filter(
  //         (paymenthis) => paymenthis.paymentid !== paymentinfo.paymentid
  //       ),
  //       payment: {
  //         ...prev.payment,
  //         paid: paid,
  //       }
  //     };
  //   });
  // };

  const [allCustomer, setAllCustomer] = useState([]);
  const [allCustomerInfo, setallCustomerInfo] = useState([]);

  const getAllCustomers = async () => {
    try {
      let res = await Axios.get(
        `/customer/getall`
      );
      if (res.data.success) {
        setallCustomerInfo(res.data.data);
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: item.name,
            value: item.name,
            id: item.id,
          };
        });

        const items = [
          {
            label: "Customers",
            items: newarr,
          },
        ];
        setAllCustomer(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateProductCharge = () => {
    let total = 0;
    generalInfo.products.forEach((product) => {
      let totalofsize = product.sizearr
        .map((item) =>parseFloat(item.total))
        .reduce((acc, currentValue) => acc + currentValue, 0);
      let totalofaccessory = product.accessoryarr
        .map((acc) =>parseFloat(acc.total))
        .reduce((acc, currentValue) => acc + currentValue, 0);
      let producttotal = totalofaccessory + totalofsize;
      total = total + producttotal;
    });

    return total
  };

  const calculateSingleProductCharge = (product) => {
    let totalofsize = product.sizearr
      .map((item) =>parseFloat(item.total))
      .reduce((acc, currentValue) => acc + currentValue, 0);
    let totalofaccessory = product.accessoryarr
      .map((acc) =>parseFloat(acc.total))
      .reduce((acc, currentValue) => acc + currentValue, 0);
    let producttotal = totalofaccessory + totalofsize;

    return producttotal;
  };

  // const calculateTotalPaid = () => {
  //   if(selectedorder){
  //     let total = 0
  //     generalInfo.paymenthis.forEach((payment)=>{
  //       let paidOptionInfo = payment.paidOptionInfo
  //       let cash = paidOptionInfo[0].checked?paidOptionInfo[0].amount:0
  //       let upi = paidOptionInfo[1].checked?paidOptionInfo[1].amount:0
  //       let cheque = paidOptionInfo[2].checked?paidOptionInfo[2].amount:0
  //       let other = paidOptionInfo[3].checked?paidOptionInfo[3].amount:0
  //       total = total + cash + upi + cheque + other
  //     });
  
  //     return total
  //   }else{
  //     return parseFloat(generalInfo.payment.paid)
  //   }
   
  // }

  // const calculatePending = () => {
  //   return (
  //     calculateProductCharge() +
  //   parseFloat(generalInfo.payment.MeasurementCharge.total) +
  //   parseFloat(generalInfo.payment.DileveryCharge.total) +
  //   parseFloat(generalInfo.payment.fittingCharge.total) +
  //   parseFloat(generalInfo.payment.labourCharge) - 
  //   calculateTotalPaid() -
  //   parseFloat(generalInfo.payment.discount)
  //   );
  // };

  // const calculateNetPending = () => {
   
  //   return (
  //     calculateProductCharge() +
  //   parseFloat(generalInfo.payment.MeasurementCharge.total) +
  //   parseFloat(generalInfo.payment.DileveryCharge.total) +
  //   parseFloat(generalInfo.payment.fittingCharge.total)+ 
  //   parseFloat(generalInfo.payment.labourCharge) -
  //   calculateTotalPaid() -
  //   parseFloat(generalInfo.payment.discount)
  //   );
  // }

  const calculateTotalBill = () => {
    return (
      calculateProductCharge() +
    parseFloat(generalInfo.payment.MeasurementCharge.total) +
    parseFloat(generalInfo.payment.DileveryCharge.total) +
    parseFloat(generalInfo.payment.fittingCharge.total) +
    parseFloat(generalInfo.payment.labourCharge)
    );
  };

  const calculateFinalBill = () => {
    return (
      calculateTotalBill() - parseFloat(generalInfo.payment.discount)
    );
  };

  

  const createOrder = async () => {
    let newpaymentinfo = {
      ...generalInfo.payment,
      MeasurementCharge: JSON.stringify(generalInfo.payment.MeasurementCharge),
      DileveryCharge: JSON.stringify(generalInfo.payment.DileveryCharge),
      fittingCharge: JSON.stringify(generalInfo.payment.fittingCharge),
      labourCharge: parseFloat(generalInfo.payment.labourCharge),
      discount: parseFloat(generalInfo.payment.discount),
      // paidOptionInfo: generalInfo.payment.paidOptionInfo
      //   .filter((option) => option.checked)
      //   .map((option) => {
      //     return {
      //       via: option.via,
      //       checked: option.checked,
      //       amount: option.amount,
      //     };
      //   }),
      productCharge: calculateProductCharge(),
      note: "first transaction"
    };

    let body = {
      ...generalInfo,
      date: getFormattedDate(generalInfo.date),
      payment: newpaymentinfo
    };

    body = removeObjectKey(body, "paymenthis");
    console.log(body);

    try {
      let res = await Axios.post(`/order/add`, body);
      if (res.data.success) {
        console.log(res.data.data);
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Order Created successfully !",
          displaytime: 3000,
        });
        
        setGeneralInfo(initialgeneralInfo);
        // uploadPdfToS3(body, body.orderno)
      }else{
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Order Creation failed !",
          displaytime: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Order Creation failed !",
        displaytime: 3000,
      });
    }

  };



  // const formatpaidOptionInfo = (optionarr) => {
  //   console.log(optionarr)
  //   return [
  //     {
  //       via: "Cash",
  //       label: "Cash",
  //       icon: (
  //         <div className="cashdiv">
  //           <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
  //         </div>
  //       ),
  //       checked:true, 
  //       amount:
  //         optionarr.filter((opt) => opt.via === "Cash").length > 0
  //           ? optionarr.filter((opt) => opt.via === "Cash")[0].amount
  //           : 0,
  //     },
  //     {
  //       via: "UPI",
  //       label: "UPI payments",
  //       icon: (
  //         <div className="UPIdiv">
  //           <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
  //         </div>
  //       ),
  //       checked: true, 
  //       amount:
  //         optionarr.filter((opt) => opt.via === "UPI").length > 0
  //           ? optionarr.filter((opt) => opt.via === "UPI")[0].amount
  //           : 0,
  //     },{
  //       via: "Cheque",
  //       label: "Cheque",
  //       icon: (
  //         <div className="chequediv">
  //           <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount:
  //         optionarr.filter((opt) => opt.via === "Cheque").length > 0
  //           ? optionarr.filter((opt) => opt.via === "Cheque")[0].amount
  //           : 0,
  //     },{
  //       via: "Other",
  //       label: "Other",
  //       icon: (
  //         <div className="Otherdiv">
  //           <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
  //         </div>
  //       ),
  //       checked: true,
  //       amount:
  //         optionarr.filter((opt) => opt.via === "Other").length > 0
  //           ? optionarr.filter((opt) => opt.via === "Other")[0].amount
  //           : 0,
  //     }
  //   ];
  // };

  const formatData = (selectedobj) => {
    console.log(selectedobj);
    let obj = {
      ...selectedobj,
      // payment: {
      //   ...selectedobj.payment,
      //   MeasurementCharge: JSON.parse(selectedobj.payment.MeasurementCharge),
      //   DileveryCharge: JSON.parse(selectedobj.payment.DileveryCharge),
      //   fittingCharge: JSON.parse(selectedobj.payment.fittingCharge),
      // }
      // paymenthis: selectedobj.paymenthis.map((payhis) => {
      //   return {
      //     ...payhis,
      //     paidOptionInfo: formatpaidOptionInfo(payhis.paidOptionInfo),
      //   };
      // }),
    };
    return obj;
  };

  // const formatPaymentHis = (paymenthis) => {
  //   return {
  //     ...paymenthis,
  //     paidOptionInfo: formatpaidOptionInfo(paymenthis.paidOptionInfo),
  //   };
  // }

  // ****************************************************************************************************************************************************************************************

  const [items, setitems] = useState({
    productItems:[],
    serviceItems:[],
    accessoryItems:[]
  })
  
  const getinitialData = () => {
    getAllProducts()
    getAllServices()
    getAllAccessories()
  }

  const getAllProducts = async () => {
    try {
      let res = await Axios.get(
        `/glassProduct/getall`
      );
      if (res.data.success) {
        
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
            value: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
            id: item.id
          };
        });
  
        const items = [
          {
            label: "Products",
            items: newarr
          },
        ];
        setitems((prev)=>{
         return {
          ...prev,
          productItems: items
         }
        })
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getAllAccessories = async () => {
    try {
      let res = await Axios.get(
        `/glassAccessory/getall`
      );
      if (res.data.success) {
       
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: item.name,
            value: item.name,
            id: item.id
          };
        });
  
        const items = [
          {
            label: "Accessories",
            items: newarr,
          },
        ];
  
        setitems((prev)=>{
          return {
           ...prev,
           accessoryItems: items
          }
         })
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const getAllServices = async () => {
    try {
      let res = await Axios.get(
        `/glassCustomization/getall`
      );
      if (res.data.success) {
        
        let arr = [...res.data.data];
        let newarr = arr.map((item) => {
          return {
            label: item.service_name,
            value: item.service_name,
            id: item.id
          };
        });
  
        const items = [
          {
            label: "Services",
            items: newarr,
          }
        ];
  
        setitems((prev) => {
          return {
           ...prev,
           serviceItems: items
          }
         })
  
      }
    } catch (error) {
      console.log(error);
    }
  };

  //**************************************************** Update functions ****************************************************/

  const UpdateGeneralInfo = async () => {
    let body = {
      orderid: generalInfo.orderid,
      completionDate: generalInfo.completionDate,
      measuredby: generalInfo.measuredby,
      customer: generalInfo.customer
    };

    try {
      let response = await Axios.post(`/order/updateGeneralInfo`, body);
      if (response.data.success) {
        console.log("true");
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "General Information updated successfully !",
          displaytime: 3000,
        });
      } else {
        
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "General Information updation failed !",
          displaytime: 3000,
        });
      }
    } catch (error) {

      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "General Information updation failed !",
        displaytime: 3000,
      });
    }
  };

  const UpdateProduct = async (id, product) => {
    let prevProduct = generalInfo.products.filter(
      (product) => product.id === id
    )[0];
    console.log(prevProduct, product, id);
    let finalproduct = {
      id: product.id,
      product_id: product.product_id,
      servicearr: product.servicearr,
      sizearr: product.sizearr.map((size) => {
        return {
          length: size.length,
          width: size.width,
          area: size.area,
          quantity: size.quantity,
          charge: size.charge,
          total: size.total,
          id: size.id,
          images: size.images
        };
      }),
      accessoryarr: product.accessoryarr.map((access) => {
        return {
          accessory_id: access.accessory_id,
          quantity: access.quantity,
          total: access.total,
        };
      }),
    };

    let body = {
      orderno: generalInfo.orderno,
      customer: generalInfo.customer,
      orderid: generalInfo.orderid,
      product: finalproduct,
      productCharge:
        generalInfo.payment.productCharge -
        calculateSingleProductCharge(prevProduct) +
        calculateSingleProductCharge(product),
      // productCharge: calculateProductCharge([finalproduct])
    };

    try {
      let response = await Axios.post(`/order/updateProduct`, body);
      if (response.data.success) {
        console.log("true");
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Product Updated successfully !",
          displaytime: 3000,
        });
        updateitem(id, product);
      } else {
        console.log("false");
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Product updation failed !",
          displaytime: 3000,
        });
        
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Product updation failed !",
        displaytime: 3000,
      });
    }
  };

  const UpdatePayment = async () => {
    let body = {
      orderid: generalInfo.orderid,
      MeasurementCharges: JSON.stringify(generalInfo.payment.MeasurementCharge),
      DileveryCharges: JSON.stringify(generalInfo.payment.DileveryCharge),
      fittingCharges: JSON.stringify(generalInfo.payment.fittingCharge),
      labourCharges: parseFloat(generalInfo.payment.labourCharge),
      productCharge: calculateProductCharge(),
      discount: parseFloat(generalInfo.payment.discount)
     
    };
   
    try {
      let response = await Axios.post(`/order/updatePayment`, body);
      if (response.data.success) {
        console.log("true");
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Payment information updated successfully !",
          displaytime: 3000,
        });
      } else {
        console.log("false");
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Payment information updation failed !",
          displaytime: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Payment information updation failed !",
        displaytime: 3000,
      });
    }
  };

  // const UpdatePaymenthis = async (updatedpayment) => {
  //   let body = {
  //     orderid: (generalInfo.orderid).toString(),
      
  //     paymentid: (updatedpayment.paymentid).toString(),
  //     paid: updatedpayment.paid,
  //     date: updatedpayment.date,
  //     note: updatedpayment.note,
  //     paidOptionInfo: updatedpayment.paidOptionInfo.map((option)=>{
  //       let {via, checked, amount} = option
  //       return {
  //        via,
  //        checked,
  //        amount
  //       }
  //     }),
  //   };

  //   try {
  //     let response = await Axios.post(`/order/updatePaymenthis`, body);
  //     if (response.data.success) {
  //       console.log("true");
  //       updatePaymentHistory(updatedpayment);
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "success",
  //         message: "Payment history updated successfully !",
  //         displaytime: 3000,
  //       });
  //     } else {
  //       console.log("false");
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "error",
  //         message: "Payment history updation failed !",
  //         displaytime: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     addNotification({
  //       id: generateRandomId(5),
  //       type: "error",
  //       message: "Payment history updation failed !",
  //       displaytime: 3000,
  //     });
  //   }
  // };

  // const AddPaymenthis = async (addedpayment) => {
  //   let finalPaidOptionInfo = addedpayment.paidOptionInfo
  //     .filter((option) => option.checked)
  //     .map((option) => {
  //       return {
  //         via: option.via,
  //         amount: option.amount,
  //         checked: option.checked,
  //       };
  //     });

  //   let body = {
  //     orderid: (generalInfo.orderid).toString(),
      
  //     paid: addedpayment.paid,
  //     date: addedpayment.date,
  //     note: addedpayment.note,
  //     paidOptionInfo: finalPaidOptionInfo,
  //   };

  //   try {
  //     let response = await Axios.post(`/order/addPaymenthis`, body);
  //     if (response.data.success) {
  //       console.log("true");
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "success",
  //         message: "Payment history added successfully !",
  //         displaytime: 3000,
  //       });
  //       addPaymentHistory(addedpayment);
  //     } else {
  //       console.log("false");
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "error",
  //         message: "Payment history addition failed !",
  //         displaytime: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     addNotification({
  //       id: generateRandomId(5),
  //       type: "error",
  //       message: "Payment history addition failed !",
  //       displaytime: 3000,
  //     });
  //   }
  // };

  const AddProduct = async (product) => {
    let finalproduct = {
      product_id: product.product_id,
      servicearr: product.servicearr,
      sizearr: product.sizearr.map((size) => {
        return {
          ...size,
          length:parseFloat(size.length),
          width:parseFloat(size.width),
          area:parseFloat(size.area),
          quantity:parseFloat(size.quantity),
          charge:parseFloat(size.charge),
          total:parseFloat(size.total),

        };
      }),

      accessoryarr: product.accessoryarr.map((access) => {
        return {
          accessory_id: access.accessory_id,
          quantity:parseFloat(access.quantity),
          total:parseFloat(access.total),
        };
      }),
    };

    let body = {
      orderno: generalInfo.orderno,
      customer: generalInfo.customer,
      orderid: generalInfo.orderid,
      product: finalproduct,
      productCharge:
        generalInfo.payment.productCharge +
        calculateSingleProductCharge(product),
    };

    try {
      let response = await Axios.post(`/order/addProduct`, body);
      if (response.data.success) {
        console.log("true");
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Product added successfully !",
          displaytime: 3000,
        });
        additem(product);
      } else {
        console.log("false");
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Product addition failed !",
          displaytime: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Product addition failed !",
        displaytime: 3000,
      });
    }
  };

  const DeleteProduct = async (id, product) => {
    let body = {
      productid: id,
      productCharge:
        generalInfo.payment.productCharge -
        calculateSingleProductCharge(product),
      orderid: generalInfo.orderid,
    };
   let query = `?productid=${body.productid}&productCharge=${body.productCharge}&orderid=${body.orderid}`
    try {
      let response = await Axios.delete(`/order/delproduct${query}`);
      if (response.data.success) {
        console.log("true");
        addNotification({
          id: generateRandomId(5),
          type: "success",
          message: "Product deleted successfully !",
          displaytime: 3000,
        });
        deleteitem(id, product);
      } else {
        console.log("false");
        addNotification({
          id: generateRandomId(5),
          type: "error",
          message: "Product deletion failed !",
          displaytime: 3000,
        });
      }
    } catch (error) {
      console.log(error);
      addNotification({
        id: generateRandomId(5),
        type: "error",
        message: "Product deletion failed !",
        displaytime: 3000,
      });
    }
  };

  // const DeletePaymenthis = async (payment) => {
  //   let body = {
  //     orderid: generalInfo.orderid,
  //     paymentid: payment.paymentid,
  //   };
  //  console.log(body)
  //   let query = `?orderid=${body.orderid}&paymentid=${body.paymentid}`
  //   try {
  //     let response = await Axios.delete(`/order/delPaymenthis${query}`);
  //     if (response.data.success) {
  //       console.log("true");
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "success",
  //         message: "Payment deleted successfully !",
  //         displaytime: 3000,
  //       });
  //       let paid = generalInfo.payment.paid - payment.paid
       
  //       DeletePaymentHis(payment, paid);
  //     } else {
  //       console.log("false");
  //       addNotification({
  //         id: generateRandomId(5),
  //         type: "error",
  //         message: "Payment deletion failed !",
  //         displaytime: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     addNotification({
  //       id: generateRandomId(5),
  //       type: "error",
  //       message: "Payment deletion failed !",
  //       displaytime: 3000,
  //     });
  //   }
  // };

  // ******************************************** Dilevery pop function *************************************//
  const handleVehichleTypeField = (vehichle, glassDileveryinfo) => {

    setGeneralInfo((prev) => {
         return {
           ...prev,
           payment: {
             ...prev.payment,
             DileveryCharge: {
                 ...prev.payment.DileveryCharge,
                 vehichleType: vehichle,
                 total: parseFloat(prev.payment.DileveryCharge.distance)*parseFloat(returnVehichleCharge(vehichle, glassDileveryinfo))
             }
           },
         };
       })
 }

 const returnVehichleCharge = (vehichle, glassDileveryinfo) => {
    console.log(vehichle)
     console.log( glassDileveryinfo.filter((item) => item.vehicle_type===vehichle) )

     return (
         parseInt(
             glassDileveryinfo.filter((item) => item.vehicle_type===vehichle)[0]?.rate_per_km
         ) || 0
       );

 }

 const handleDistanceField = (e, glassDileveryinfo) => {
     let newdistance = e.target.value;
     e.stopPropagation()

       setGeneralInfo((prev) => {
         return {
           ...prev,
           payment: {
             ...prev.payment,
             DileveryCharge: {
                 ...prev.payment.DileveryCharge,
                 distance: newdistance,
                 total: parseFloat(newdistance)*parseFloat(returnVehichleCharge(prev.payment.DileveryCharge.vehichleType, glassDileveryinfo))
             }
           },
         };
       })


 }

  //**************************************************************************************************************************/

  // useEffect(() => {
  //   if (!openOrderForm) {
  //     setselectedobj(null);
  //   }
  // }, [openOrderForm]);

  useEffect(() => {
    console.log("jhbj");
    if (selectedorder) {
      console.log("jhbj");
      // let data = formatData(selectedorder);
      console.log(selectedorder);
      setGeneralInfo(selectedorder);
    }
    getinitialData()
  }, [selectedorder]);

  useEffect(() => {
    getAllCustomers();
  }, []);

  console.log("jhbj", generalInfo);

  return (
    <div className="detailoutercomp" style={{margin:selectedorder && "auto", padding:selectedorder && "20px", maxHeight:"calc(90vh - 0px)"}}>
      <div
        style={{ padding: "40px", border: "2px solid rgb(233, 233, 231)", borderRadius: "6px", minWidth:"1000px" }}
        className="infocomp"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0px 20px",
            paddingBottom: "20px",
            marginBottom: "20px",
            borderBottom: "2px solid rgb(233, 233, 231)",
            color:"rgb(55, 53, 47)",
            fontWeight:"600"
          }}
        >
          <div>Order No: {generalInfo.orderno}</div>
          <div>Date: {generalInfo.date}</div>
        </div>

      <Generalinfo

       generalInfo={generalInfo}
       setGeneralInfo={setGeneralInfo}
       allCustomer={allCustomer}
       handleDateChange={handleDateChange}
       UpdateGeneralInfo={UpdateGeneralInfo}
       selectedorder={selectedorder}
       getTodaysdate={getTodaysdate}
       allCustomerInfo={allCustomerInfo}
       />

      <Productsinfo

       openOrderForm={openOrderForm}
       setOpenOrderForm={setOpenOrderForm}
       selectedorder={selectedorder}
       AddProduct={AddProduct}
       additem={additem}
       UpdateProduct={UpdateProduct}
       updateitem={updateitem}
       DeleteProduct={DeleteProduct}
       deleteitem={deleteitem}
       selectedobj={selectedobj}
       generalInfo={generalInfo}
       setselectedobj={setselectedobj}
       calculateProductCharge={calculateProductCharge}
       items={items}
       />

       <Paymentinfo

      //  handlePaymentAmountChange={handlePaymentAmountChange}
      //  handlePaymentcheckchange={handlePaymentcheckchange}
      //  calculatePending={calculatePending}
       calculateTotalBill={calculateTotalBill}
       setGeneralInfo={setGeneralInfo}
       calculateProductCharge={calculateProductCharge}
       generalInfo={generalInfo}
       selectedorder={selectedorder}
       UpdatePayment={UpdatePayment}
       handleVehichleTypeField={handleVehichleTypeField}
       handleDistanceField={handleDistanceField}
       calculateFinalBill={calculateFinalBill}

       />

{/*        
      {selectedorder && 

       <Paymenthis 
       openPaymentForm={openPaymentForm} 
       handleOpenPaymentForm={handleOpenPaymentForm}
       selectedpaymenthis={selectedpaymenthis}
       generalInfo={generalInfo}
       updatePaymentHistory={updatePaymentHistory}
       addPaymentHistory={addPaymentHistory}
       setselectedpaymenthis={setselectedpaymenthis}
       setOpenPaymentForm={setOpenPaymentForm}
       selectedorder={selectedorder}
       DeletePaymenthis={DeletePaymenthis}
       DeletePaymentHis={DeletePaymentHis}
       />

        } */}
        
        {/* {selectedorder && <div 
       style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            borderBottom:"1px solid rgb(233, 233, 231)",
            width:"fit-content",
            gap:"20px",
            color:"rgb(55, 53, 47)"
          }}>
        <div>Net Pending : {" "} </div>
        <div > Rs. {calculateNetPending()}</div>
        </div>} */}

        {!selectedorder && <div
          style={{
            marginTop: "20px",
            paddingBottom: "0px 20px",
            display: "flex",
            justifyContent: "end",
          }}
        >
          <button onClick={() => createOrder()} className="secondarybtn">
            Create Order
          </button>
          {/* <button onClick={() => sendBillToCustomer()} className="oksecondarybtn">
            Create Order
          </button> */}
        </div>}
      
      </div>
      
    </div>

  );
};

NewOrder.propTypes = {
  selectedorder: PropTypes.object,
  
};

export default NewOrder;
