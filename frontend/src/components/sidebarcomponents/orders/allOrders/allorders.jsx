import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "./allorders.css";
import NewOrder from "../neworder/neworder";
import CustomerView from "./customerview/customerview";
import ViewOrder from "../viewOrder/vieworder";
import { PDFViewer } from '@react-pdf/renderer';
import PropTypes from "prop-types";
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import { removeSpaces, returnConvertedDate, returnPaymenStatusEle, sendWhatsappMessageForOrdeDilevered, sendWhatsappMessageForOrderConfirmation } from "../../../../commonfn";
import { useCommonInfoStore, useFilterStore } from "../../../../../strore/notificationStore";
import { useQueryClient } from "@tanstack/react-query";
import { returnOrderStringifiedFilter } from "../orderfilterFunctions";
import { useAddOrder, useDeleteAllOrder, useDeleteOrder, useGetOrders, useUpdateOrder, useUpdateOrderStatus } from "./orderQueryHooks";
import debounce from "lodash.debounce";
import TaskPDF from "../taskmanager/taskpdf";
import InvoicePDF from "../invoicePDF/invoicepdf";


const AllOrder = ({status}) => {

    const storeFilterData = useFilterStore(state => state[`Order${removeSpaces(status)}`]);
    const company = useCommonInfoStore(state=>state.company);
    const [openOrderForm, setOpenOrderForm] = useState(false);
    const [selectedOrder, setselectedOrder] = useState(null);
    const [viewOrder, setviewOrder] = useState(false);
    const [openCustomerView, setOpenCustomerView] = useState(false);
    const [openTaskView, setOpenTaskView] = useState(false);
    const [openInvoiceView, setOpenInvoiceView] = useState(false);
    const [customerInfo, setcustomerInfo] = useState(null);
    const OrderTableRef = useRef(null);
    const queryClient = useQueryClient();

    const returnTableData = (data) => {

      console.log("🚀 ~ returnTableData ~ data:", data)

      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);

      return { ...tableobj };
     
    }

   

   const UpdateOrderStatusSuccessfn = () => {
   console.log("order status updated")
   queryClient.invalidateQueries({ queryKey:[`Orders-${status}`, returnOrderStringifiedFilter(storeFilterData, 'Order')], exact: true });
   queryClient.invalidateQueries({ queryKey:[`Orders-all`, returnOrderStringifiedFilter(storeFilterData, 'OrderAll')], exact: true });
   }

    const deleteOrderSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`Orders-${status}`, returnOrderStringifiedFilter(storeFilterData, 'Order')], exact: true });
      queryClient.invalidateQueries({ queryKey:[`Orders-all`, returnOrderStringifiedFilter(storeFilterData, 'OrderAll')], exact: true });
      
    }

    const deleteAllOrderSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`Orders-${status}`, returnOrderStringifiedFilter(storeFilterData, 'Order')], exact: true });
      queryClient.invalidateQueries({ queryKey:[`Orders-all`, returnOrderStringifiedFilter(storeFilterData, 'OrderAll')], exact: true });
      
    }

 
    const { data, error: getOrdererr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getOrderIsLoading } = useGetOrders(null, returnOrderStringifiedFilter(storeFilterData, 'Order'), status);

    const allOrderinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);

    const { mutate: triggerUpdateOrderStatus , error: updateOrderStatuserr, isLoading: updateOrderStatusIsLoading } = useUpdateOrderStatus(UpdateOrderStatusSuccessfn);
    
    const { mutate: triggerDeleteOrder , error: deleteOrdererr, isLoading: deleteOrderIsLoading } = useDeleteOrder(deleteOrderSuccessfn);

    const { mutate: triggerDeleteAllOrder , error: deleteAllOrdererr, isLoading: deleteAllOrderIsLoading } = useDeleteAllOrder(deleteAllOrderSuccessfn);


    // const returnAllOrder = async() => {

    //   try {
       
    //     const url = `/Order/getall?status=${status}`;
    //     const res = await Axios.get(url)

    //     if(res.data.success){
    //       console.log(res.data.data)
    //       let Orderarr = [...res.data.data]
    //       return Orderarr
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

    // const setinitialData = async() => {
    //    getDataAndRefreshTable()
    // }

    // const getDataAndRefreshTable = async() => {

    //     let Orderarr = await returnAllOrder()
      
    //     setallOrderinfo(Orderarr)

    //     const tableobj = convertDataForTable(Orderarr);
    //     settableData(tableobj)

    // }

       // Infinite scroll event handler for loading next page
       const loadNextPage = () => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      };
    
      // Infinite scroll event handler for loading previous page
      // const loadPreviousPage = () => {
      //   if (hasPreviousPage && !isFetchingPreviousPage) {
      //     fetchPreviousPage();
      //   }
      // };
    
       // Attach scroll event for loading next or previous page on table scroll
       useEffect(() => {
        const onScroll = debounce(() => {
          const table = OrderTableRef.current;
          if (table) {
            const { scrollTop, clientHeight, scrollHeight } = table;
            // if (scrollTop === 0 && hasPreviousPage && !isFetchingPreviousPage) {
            //   loadPreviousPage();
            // } else
              console.log(scrollTop, clientHeight, scrollHeight)
             if (scrollTop + clientHeight + 20 >= scrollHeight && hasNextPage && !isFetchingNextPage) {
              loadNextPage();
            }
          }
        }, 200);
    
        const table = OrderTableRef.current;
        if (table) {
          table.addEventListener('scroll', onScroll);
          return () => table.removeEventListener('scroll', onScroll);
        }
      }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);

   
  
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

  (status === 'Not yet started' || status === 'hold' || status === 'removed') ? {funcName:'Start Order', funct:(Order)=>triggerUpdateOrderStatus({ orderid: Order[0]?.id, status: 'In process', Order, Orderarr}), icon: <Icon
   icon="gis:flag-start-b"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'In process' || status === 'hold' || status === 'removed' ? {funcName:'Order completed', funct:(Order)=>triggerUpdateOrderStatus({orderid: Order[0]?.id, status: 'completed', Order, Orderarr}), icon: <Icon
   icon="fluent-mdl2:completed"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'completed' || status === 'hold' || status === 'removed' ? {funcName:'Send order for dilevery', funct:(Order)=>triggerUpdateOrderStatus({orderid: Order[0]?.id, status: 'sent for dilevery', Order, Orderarr}), icon: <Icon
   icon="carbon:delivery-truck"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status === 'sent for dilevery' || status === 'hold' || status === 'removed' ? {funcName:'Order dilevered', funct:(Order)=>triggerUpdateOrderStatus({orderid: Order[0]?.id, status: 'dilevered', Order, Orderarr}), icon: <Icon
   icon="ep:finished"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status !== 'hold' ? {funcName:'Hold order', funct:(Order)=>triggerUpdateOrderStatus({orderid: Order[0]?.id, status: 'hold', Order, Orderarr}), icon: <Icon
   icon="icon-park-outline:pause-one"
   style={{
   width: "1.2rem",
   height: "1.2rem",
   color: "#3f3f3f",
   cursor: "pointer",
  }}
  />}:"",

  status !== 'removed' ? {funcName:'Remove Order', funct:(Order)=>triggerUpdateOrderStatus({orderid: Order[0]?.id, status: 'removed', Order, Orderarr}), icon: <Icon
  icon="gg:remove"
  style={{
  width: "1.2rem",
  height: "1.2rem",
  color: "#3f3f3f",
  cursor: "pointer",
 }}
 />}:"",

 status === 'removed' ? {funcName:'Delete Order', funct:(Order)=>triggerDeleteOrder({Order, Orderarr}), icon: <Icon
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

  {funcName:'View task plan', funct:(Order)=>handleOrderFormOpen(Order[0]?.id, 'task'), icon: <Icon
    icon="fluent-mdl2:full-view"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "#3f3f3f",
    cursor: "pointer",
   }}

  />},

  // {funcName:'View Invoice', funct:(Order)=>handleOrderFormOpen(Order[0]?.id, 'invoice'), icon: <Icon
  //   icon="fluent-mdl2:full-view"
  //   style={{
  //   width: "1.2rem",
  //   height: "1.2rem",
  //   color: "#3f3f3f",
  //   cursor: "pointer"
  //  }}

  // />}



  

]


let groupFunctions = [ status === 'removed' ? {funcName:'Delete all', funct:(OrderArr)=>triggerDeleteAllOrder({ OrderArr }), icon: <Icon
icon="mi:delete-alt"
style={{
width: "1.2rem",
height: "1.2rem",
color: "#3f3f3f",
cursor: "pointer",
}}
/>} : "" ];

const name = `Order${removeSpaces(status)}`
console.log(rowWiseFunctions)
rowWiseFunctions = rowWiseFunctions.filter((ele)=>ele!=="")
groupFunctions = groupFunctions.filter((ele)=>ele!=="")

const tableRef = OrderTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
}

const serverSideFiltering = true;

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows, tableRef, tableContainerStyle, serverSideFiltering }
console.log(tableData)
return tableData


    }



    const returnBill = ( product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount ) => {

      console.log(product_charges, measurement_charges, dilevery_charges, labour_charges, fitting_charges, discount)
          return (parseFloat(product_charges) + parseFloat(measurement_charges.total) + parseFloat(dilevery_charges.total) + parseFloat(labour_charges) + parseFloat(fitting_charges.total) - parseFloat(discount))

    }

    // const viewTaskPlan = (selectedOrder) => {
    //   console.log(selectedOrder)
    //   ReactPDF.render(<TaskPDF selectedOrder={selectedOrder}/>)
    // }

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
   
    // const DeleteAll = async(orderArr) => {
    //   let orderIdArr = orderArr.map((order)=>order[0].id)
    //   const body = {
    //     orderIdArr
    //   }
    //   try {
    //     let res = await Axios.post(`/Order/multipleDelete`, body)
    //     if(res.data.success){
    //       getDataAndRefreshTable()
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

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

    // const UpdateOrderStatus = async( orderid, status, Order, Orderarr ) => {

    //   const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null

    //   if(!selctedOrderRow){
    //     console.log(selctedOrderRow)
    //     return 
    //   } 

    //   const { customer_name, customer_whatsapp_number, order_number, completion_date } = selctedOrderRow
    //   const recipient = "91" + customer_whatsapp_number

    //   const body = {
    //     orderid,
    //     status
    //   }

    //   try {
    //     let res = await Axios.post(`/Order/updateOrderStatus`, body)
    //     if(res.data.success){
    //       getDataAndRefreshTable()
    //       if(status==='In process'){
    //         sendWhatsappMessageForOrderConfirmation(recipient, customer_name, order_number, orderid, completion_date)
    //       }else if(status==='dilevered'){
    //         sendWhatsappMessageForOrdeDilevered(recipient, customer_name, order_number)
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }


    // }

    // const DeleteOrder = async( Order, Orderarr ) => {
    //   try {
    //     const selctedOrderRow = Orderarr.filter((row)=>row.id===Order[0].id)[0] || null
    //     if(!selctedOrderRow){
    //       console.log(selctedOrderRow)
    //       return 
    //     }
    //     let res = await Axios.delete(`/Order/delete?orderid=${selctedOrderRow.id}`)
    //     if(res.data.success){
    //       getDataAndRefreshTable()
          
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }

    // }
   
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
            }else if(component==='task'){
              setOpenTaskView(true) 
            }else if(component==='invoice'){
              setOpenInvoiceView(true) 
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
        deleteOrderSuccessfn()
        setOpenOrderForm(false)
        
      } 
      setselectedOrder(null)

    }

    
    // useEffect(() => {
    //   setinitialData()
    // },[status])

    console.log(allOrderinfo, storeFilterData)

    return (

        <div>

         <div> 
            
        <DialogDemo Open={openOrderForm} setOpen={(e) => e?setOpenOrderForm(e):closeOrderForm('update')} buttontext="" contentclass='neworderdialog'  btnclass = 'primarybtndiv'> 
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

         <DialogDemo Open={openTaskView} setOpen={setOpenTaskView} buttontext="" btnclass = 'primarybtndiv'> 
         {(props) => (

          <PDFViewer style={{minHeight:"80vh", minWidth:"996px"}}>
          <TaskPDF
          {...props}
          selectedOrder={selectedOrder}
          company={company}
          />
          </PDFViewer>

            )}

         </DialogDemo>

         <DialogDemo Open={openInvoiceView} setOpen={setOpenInvoiceView} buttontext="" btnclass = 'primarybtndiv'> 
         {(props) => (

          <PDFViewer style={{minHeight:"80vh", minWidth:"996px"}}>
          <InvoicePDF
          {...props}
          selectedOrder={selectedOrder}
          company={company}
          />
          </PDFViewer>

            )}

         </DialogDemo>

         </div>

         
       { allOrderinfo && <Table  data={returnTableData(allOrderinfo)} /> }

        
        </div>
    )
}


AllOrder.propTypes = {
  status: PropTypes.string,
};


export default AllOrder;



