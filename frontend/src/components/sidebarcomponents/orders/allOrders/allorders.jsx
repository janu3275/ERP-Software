import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import "./allorders.css";
import NewOrder from "../neworder/neworder";
import CustomerView from "./customerview/customerview";
import { paymentItems} from "./staticOptions";
import ViewOrder from "../viewOrder/vieworder";
import PropTypes from "prop-types";
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import { returnConvertedDate, returnPaymenStatusEle, sendWhatsappMessageForOrdeDilevered, sendWhatsappMessageForOrderConfirmation } from "../../../../commonfn";


const AllOrder = ({status}) => {

    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [allOrderinfo, setallOrderinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedOrder, setselectedOrder] = useState(null);
    const [viewOrder, setviewOrder] = useState(false);
    const [openCustomerView, setOpenCustomerView] = useState(false);
    const [customerInfo, setcustomerInfo] = useState(null);
  

    const returnAllOrder = async() => {
      try {
       
        const url = `/Order/getall?status=${status}`;
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

        let Orderarr = await returnAllOrder()
      
        setallOrderinfo(Orderarr)
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
        "columnName": "Customer name",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted": null
    },
    {
        "columnName": "Order date",
        "type": "date",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
     { 
         "columnName": "Completion date",
         "type": "date",
         "colNo": 4,
         "width": 100,
         "sorted":null
      },
     { 
        "columnName": "Final bill after discount ",
        "type": "number",
        "colNo": 5,
        "width": 100,
        "sorted":null
      }
      // { 
      //   "columnName": "Payment status",
      //   "type": "options",
      //   "colNo": 6,
      //   "width": 100,
      //   "sorted":null,
      //   "options": paymentItems
      // },
      // { 
      //   "columnName": "Paid",
      //   "type": "number",
      //   "colNo": 7,
      //   "width": 100,
      //   "sorted":null
      // },
      // { 
      //     "columnName": "Pending amount",
      //     "type": "number",
      //     "colNo": 8,
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
         if(obj.customer_name){
            row.push({ key:'customer_name', value:obj.customer_name, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.order_date){
            row.push({ key:'order_date', value:returnConvertedDate(obj.order_date), type:'date', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.completion_date){
            row.push({ key:'completion_date', value: returnConvertedDate(obj.completion_date), type:'date', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount){
            row.push({ key:'total_bill', value: returnBill(obj.product_charges ,obj.measurement_charges, obj.dilevery_charges, obj.labour_charges, obj.fitting_charges, obj.discount), type:'number', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
        //  if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount && obj.payment_info){
        //   const payment_status = returnPaymentStatus(obj.product_charges , obj.measurement_charges , obj.dilevery_charges , obj.labour_charges , obj.fitting_charges , obj.discount , obj.payment_info)
        //   row.push({ key:'payment_status', value: payment_status, ele: returnPaymenStatusEle(payment_status), type:'options', width:100, rowNo:index+1, colNo:6, id:obj.id })
        //  }
        //  if(obj.payment_info){
        //     console.log(obj.payment_info)
        //     row.push({ key:'paid', value: returnTotalPaid(obj.payment_info), type:'number', width:100, rowNo:index+1, colNo:7, id:obj.id })
        //  }
        //  if(obj.product_charges && obj.measurement_charges && obj.dilevery_charges && obj.labour_charges && obj.fitting_charges && obj.discount && obj.payment_info){
        //     row.push({ key:'pending', value: parseFloat(returnBill(obj.product_charges ,obj.measurement_charges, obj.dilevery_charges, obj.labour_charges, obj.fitting_charges, obj.discount) - returnTotalPaid(obj.payment_info)), type:'number', width:100, rowNo:index+1, colNo:8, id:obj.id })
        //  }
         
        
       console.log(row)

      if(row.length===5){
        rows.push(row) 
      }

    })

let rowWiseFunctions = [

  (status === 'Not yet started' || status === 'hold' || status === 'removed') ? {funcName:'Start Order', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'In process', Order, Orderarr), icon: <Icon
   icon="gis:flag-start-b"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'In process' || status === 'hold' || status === 'removed' ? {funcName:'Order completed', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'completed', Order, Orderarr), icon: <Icon
   icon="fluent-mdl2:completed"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'completed' || status === 'hold' || status === 'removed' ? {funcName:'Send order for dilevery', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'sent for dilevery', Order, Orderarr), icon: <Icon
   icon="carbon:delivery-truck"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'sent for dilevery' || status === 'hold' || status === 'removed' ? {funcName:'Order dilevered', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'dilevered', Order, Orderarr), icon: <Icon
   icon="ep:finished"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status !== 'hold' ? {funcName:'Hold order', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'hold', Order, Orderarr), icon: <Icon
   icon="icon-park-outline:pause-one"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status !== 'removed' ? {funcName:'Remove Order', funct:(Order)=>updateOrderStatus(Order[0]?.id, 'removed', Order, Orderarr), icon: <Icon
  icon="gg:remove"
  style={{
  width: "1.2rem",
  height: "1.2rem",
  color: "#3f3f3f",
  cursor: "pointer",
 }}
 />}:"",

 status === 'removed' ? {funcName:'Delete Order', funct:(Order)=>DeleteOrder(Order, Orderarr), icon: <Icon
 icon="mi:edit-alt"
 style={{
 width: "1.2rem",
 height: "1.2rem",
 color: "#3f3f3f",
 cursor: "pointer"
}}
/>}:"",


  status !== 'removed' ? {funcName:'Update Order', funct:(Order)=>handleOrderFormOpen(Order[0]?.id, 'update') , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "#3f3f3f",
      cursor: "pointer"
    }}
  />}:"",

  {funcName:'View order details', funct:(Order)=>viewOrderDetails(Order[0]?.id), icon: <Icon
    icon="fluent-mdl2:full-view"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "#3f3f3f",
    cursor: "pointer",
   }}

  />},

  {funcName:'View customer details', funct:(Order)=>viewCustomerDetails(Order, Orderarr), icon: <Icon
   icon="fluent-mdl2:full-view"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />},

  

]


let groupFunctions = [ status === 'removed' ? {funcName:'Delete all', funct:(OrderArr)=>DeleteAll(OrderArr), icon: <Icon
icon="mi:delete-alt"
style={{
width: "1.2rem",
height: "1.2rem",
color: "#3f3f3f",
cursor: "pointer",
}}
/>} :""];

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
   
    const DeleteAll = async(orderArr) => {
      let orderIdArr = orderArr.map((order)=>order[0].id)
      const body = {
        orderIdArr
      }
      try {
        let res = await Axios.post(`/Order/multipleDelete`, body)
        if(res.data.success){
          getDataAndRefreshTable()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const viewCustomerDetails = ( Order, Orderarr ) => {

      const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null

      if(!selctedOrderRow){
        console.log(selctedOrderRow)
        return 
      } 
      console.log(selctedOrderRow)
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

    const updateOrderStatus = async( orderid, status, Order, Orderarr ) => {

      const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null

      if(!selctedOrderRow){
        console.log(selctedOrderRow)
        return 
      } 

      const { customer_name, customer_whatsapp_number, order_number, completion_date } = selctedOrderRow
      const recipient = "91" + customer_whatsapp_number

      const body = {
        orderid,
        status
      }

      try {
        let res = await Axios.post(`/Order/updateOrderStatus`, body)
        if(res.data.success){
          getDataAndRefreshTable()
          if(status==='In process'){
            sendWhatsappMessageForOrderConfirmation(recipient, customer_name, order_number, orderid, completion_date)
          }else if(status==='dilevered'){
            sendWhatsappMessageForOrdeDilevered(recipient, customer_name, order_number)
          }
        }
      } catch (error) {
        console.log(error)
      }


    }

    const DeleteOrder = async( Order, Orderarr ) => {
      try {
        const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null
        if(!selctedOrderRow){
          console.log(selctedOrderRow)
          return 
        }
        let res = await Axios.delete(`/Order/delete?orderid=${selctedOrderRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }

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
      setinitialData()
    },[status])

    console.log(allOrderinfo)

    return (

        <div>

         <div> 
            
        <DialogDemo Open={openOrderForm} setOpen={(e)=>e?setOpenOrderForm(e):closeOrderForm('update')} buttontext="" contentclass='neworderdialog' btnclass = 'primarybtndiv'> 
         {(props) => (
             <NewOrder
             {...props}
             
             selectedorder={selectedOrder}
             
             
           />
            )}

         </DialogDemo>

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


AllOrder.propTypes = {
  status: PropTypes.string,
};


export default AllOrder;



