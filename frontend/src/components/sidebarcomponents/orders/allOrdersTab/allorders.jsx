import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { orderItems, paymentItems } from "../allOrders/staticOptions";
import { Axios } from "../../../../../utils/axios.mjs";

import { blobToBase64, generatePDF, returnConvertedDate, returnOrderStatusEle, returnPaymenStatusEle } from "../../../../commonfn";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import ViewOrder from "../viewOrder/vieworder";
import CustomerView from "../allOrders/customerview/customerview";
import Table from "../../../commoncomponents/tableComponent/table";
import React from "react";


const Allorders = () => {

    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [allordersinfo, setallordersinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedOrder, setselectedOrder] = useState(null);
    const [viewOrder, setviewOrder] = useState(false);
    const [openCustomerView, setOpenCustomerView] = useState(false);
    const [customerInfo, setcustomerInfo] = useState(null);
  

    const returnAllorders = async() => {
      try {
       
        const url = `/Order/getallOrders`;
        const res = await Axios.get(url)
        if(res.data.success){
          console.log(res.data.data)
          let Orderarr = [...res.data.data]
          return Orderarr
        }
      } catch (error) {
        console.log(error)
      }
    }

    const setinitialData = async() => {
       getDataAndRefreshTable()
    }

    const getDataAndRefreshTable = async() => {

        let Orderarr = await returnAllorders()
    
        setallordersinfo(Orderarr)
        const tableobj = convertDataForTable(Orderarr);
        settableData(tableobj)

    }

   
  
    const convertDataForTable = (data) => {

       let Orderarr = [...data]

       const header =  [
    {
      "columnName": "Order number",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
    },
    {
        "columnName": "Order status",
        "type": "options",
        "colNo": 2,
        "width": 100,
        "sorted": null,
        "options": orderItems
      },
    {
        "columnName": "Customer name",
        "type": "string",
        "colNo": 3,
        "width": 100,
        "sorted": null
    },
    {
        "columnName": "Order date",
        "type": "date",
        "colNo": 4,
        "width": 100,
        "sorted":null
      },
     { 
         "columnName": "Completion date",
         "type": "date",
         "colNo": 5,
         "width": 100,
         "sorted":null
      },
     { 
        "columnName": "Final bill after discount",
        "type": "number",
        "colNo": 6,
        "width": 100,
        "sorted":null
      }
      // { 
      //   "columnName": "Payment status",
      //   "type": "options",
      //   "colNo": 7,
      //   "width": 100,
      //   "sorted":null,
      //   "options": paymentItems
      // },
      // { 
      //   "columnName": "Paid",
      //   "type": "number",
      //   "colNo": 8,
      //   "width": 100,
      //   "sorted":null
      // },
      // { 
      //     "columnName": "Pending amount",
      //     "type": "number",
      //     "colNo": 9,
      //     "width": 100,
      //     "sorted":null
      // }
    ]
    
      let rows = []
    
      Orderarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.order_number){
            row.push({ key:'order_number', value:obj.order_number, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.order_status){
            row.push({ key:'order_status', value:obj.order_status, ele:returnOrderStatusEle(obj.order_status) , type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.customer_name){
            row.push({ key:'customer_name', value:obj.customer_name, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.order_date){
            row.push({ key:'order_date', value:returnConvertedDate(obj.order_date), type:'date', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.completion_date){
            row.push({ key:'completion_date', value: returnConvertedDate(obj.completion_date), type:'date', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount){
            row.push({ key:'total_bill', value: returnBill(obj.product_charges ,obj.measurement_charges, obj.dilevery_charges, obj.labour_charges, obj.fitting_charges, obj.discount), type:'number', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
        //  if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount && obj.payment_info){
        //   const payment_status = returnPaymentStatus(obj.product_charges , obj.measurement_charges , obj.dilevery_charges , obj.labour_charges , obj.fitting_charges , obj.discount , obj.payment_info)
        //   row.push({ key:'payment_status', value:payment_status , ele: returnPaymenStatusEle(payment_status), type:'options', width:100, rowNo:index+1, colNo:7, id:obj.id })
        //  }
        //  if(obj.payment_info){
        //     console.log(obj.payment_info)
        //     row.push({ key:'paid', value: returnTotalPaid(obj.payment_info), type:'number', width:100, rowNo:index+1, colNo:8, id:obj.id })
        //  }
        //  if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount && obj.payment_info){
        //     row.push({ key:'pending', value: parseFloat(returnBill(obj.product_charges ,obj.measurement_charges, obj.dilevery_charges, obj.labour_charges, obj.fitting_charges, obj.discount) - returnTotalPaid(obj.payment_info)), type:'number', width:100, rowNo:index+1, colNo:9, id:obj.id })
        //  }
         
        
       console.log(row)

      if(row.length===6){
        rows.push(row) 
      }

    })

let rowWiseFunctions = [{funcName:'View order details', funct:(Order)=>viewOrderDetails(Order[0]?.id), icon: <Icon
    icon="fluent-mdl2:full-view"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    Order: "#3f3f3f",
    cursor: "pointer"
   }}

  />},

  {funcName:'View customer details', funct:(Order)=>viewCustomerDetails(Order, Orderarr), icon: <Icon
   icon="fluent-mdl2:full-view"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   Order: "#3f3f3f",
   cursor: "pointer"
  }}
  />}

  

]


let groupFunctions = [];

const name = 'Orders'
console.log(rowWiseFunctions)
rowWiseFunctions = rowWiseFunctions.filter((ele)=>ele!=="")
groupFunctions = groupFunctions.filter((ele)=>ele!=="")
const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


    }

    const returnBill = ( product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount ) => {
      console.log(product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount)
          return (parseFloat(product_charges) + parseFloat(measurement_charges.total) + parseFloat(dilevery_charges.total) + parseFloat(labour_charges) + parseFloat(fitting_charges.total) - parseFloat(discount))
    }

    // const returnTotalPaid = ( paymentinfo ) => {
    //   if(!paymentinfo){
    //     console.log("paymentinfo -->", paymentinfo)
    //     return 0
    //   }
    //  let total = 0;
    //  paymentinfo.forEach((payment) => {
    //    const {cash, cheque, upi, other} = payment
    //    total = total + parseFloat(cash) + parseFloat(cheque) + parseFloat(upi) + parseFloat(other)
    //  })

    //  return parseFloat(total);

    // }

    // const returnPaymentStatus = ( product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount, payments ) => {
    //   console.log("jklhnjkl", product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount, payments)
    //  const bill = returnBill(product_charges ,measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount)
    //  const totalPaid = returnTotalPaid(payments)

    //  if( parseFloat(bill - totalPaid) <=0 ){
    //    return 'paid'
    //  }else{
    //    return 'payment pending'
    //  }

    // }

 


   

  

  
   
    
 

    const viewCustomerDetails = (Order,Orderarr) => {

      const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null

      if(!selctedOrderRow){
        console.log(selctedOrderRow)
        return 
      } 

      const {customer_name, customer_mobile_number, customer_whatsapp_number, customer_email_address, customer_company_name, customer_address } = selctedOrderRow
      let obj = {
      "Customer name": customer_name, 
      "Company name": customer_company_name, 
      "Email adress": customer_email_address, 
      "Mobile number": customer_mobile_number, 
      "Whatsapp number": customer_whatsapp_number, 
      "Address": customer_address
    }

      setcustomerInfo(obj)

      setOpenCustomerView(true)

    }

    const viewOrderDetails = async( orderid ) => {

        
        await handleOrderFormOpen(orderid, 'view')

    }

   

  
   
    const handleOrderFormOpen = async( orderid, component ) => {

      let params = new URLSearchParams();
      params.append('orderid', orderid);

     try {

          let res = await Axios.get(
            `/order/getbyid?${params.toString()}`,
          );

          if (res.data.success) {
            console.log(res.data.data);
            setselectedOrder(res.data.data);
            if(component==='view'){
              setviewOrder(true)
            }else if(component==='update'){
              setOpenOrderForm(true)
            }
            
          }

        } catch (error) {
          console.log(error);
        }

    }

    const closeOrderForm = ( component ) => {

   
      if(component==='view'){
        setviewOrder(false)
      }else if(component==='update'){
        setOpenOrderForm(false)
        
      } 
      setselectedOrder(null)

    }

    
    useEffect(() => {
        console.log("entered")
      setinitialData()
    },[])

    console.log(allordersinfo)

    return (

        <div>

         <div> 
       

         <DialogDemo Open={viewOrder} setOpen={(e)=>e?setviewOrder(e):closeOrderForm('view')} buttontext="" btnclass = 'primarybtndiv'> 
         {(props) => (
             <ViewOrder
             {...props}
             
             selectedorder={selectedOrder}
             
          />
            )}

         </DialogDemo>

         <DialogDemo Open={openCustomerView} setOpen={setOpenCustomerView} buttontext="" btnclass = 'primarybtndiv'> 
         {(props) => (

             <CustomerView
             {...props}
             customerInfo={customerInfo}
             />

            )}

         </DialogDemo>


         </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}





export default Allorders;



