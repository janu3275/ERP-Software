import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import StackedImages from "../../../../../assets/singlecomponents/stackedimages/stackedimages";
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import { calculatePaid, formatpaidOptionInfo, returnConvertedDate, returnPaymentTableIcon } from "../../../../../commonfn";
import print from 'print-js';
import "./payments.css";
import CustomerPaymentform from "./paymentsform";

const CustomerPayments = ({CustomerId}) => { 

    const [openCustomerPaymentsForm, setOpenPaymentsForm] = useState(false);
    const [allCustomerPaymentsinfo, setCustomerPaymentsinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedCustomerPayment, setselectedCustomerPayment] = useState(null);

    
    const createNewPayment = async (data) => {

     try {

        let body = {
          ...data,
          customer_id: CustomerId,
          paidOptionInfo: data.paidOptionInfo
          .map((option) => {
            return {
              via: option.via,
              checked: true,
              amount: parseFloat(option.amount),
            };
          })
        }

        let res = await Axios.post(`/CustomerPayment/add`, body)

        if(res.data.success){
          getCustomerPayments()
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

const getCustomerPayments = async() => {

      try {

        let res = await Axios.get(`/CustomerPayment/getall/${CustomerId}`)
        if(res.data.success){
          console.log(res.data.data)
          let CustomerPaymentsarr = [...res.data.data]
          CustomerPaymentsarr = formatData(CustomerPaymentsarr)
          setCustomerPaymentsinfo(CustomerPaymentsarr)
          let tableobj = convertDataForTable(CustomerPaymentsarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }

    }

const formatData = (paymentarr) => {

    const newPaymentArr = paymentarr.map((payment) => {
      return {
        ...payment,
        paidOptionInfo: formatpaidOptionInfo(payment.paidOptionInfo)
      }
    })

    return newPaymentArr
   
  };

 

const convertDataForTable = (data) => {

       let CustomerPaymentsarr = [...data]
       const header =  [
      { 
        "columnName": "Payment date",
        "type": "date",
        "colNo": 1,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Attachment",
        "type": "attachment/link",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
      { 
         "columnName": "Amount",
         "type": "number",
         "colNo": 3,
         "width": 100,
         "sorted":null
       },
       { 
        "columnName": "via",
        "type": "attachment/link",
        "colNo": 4,
        "width": 100,
        "sorted":null
      },
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 5,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      CustomerPaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.payment_date){
          row.push({ key:'payment_date', value:returnConvertedDate(obj.payment_date), type:'date', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.paidOptionInfo){
            row.push({ key:'amount', value: calculatePaid(obj.paidOptionInfo), type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.paidOptionInfo){
          row.push({ key:'via', value: <div style={{display:"flex", gap:"15px"}}>{returnViaComp(obj.paidOptionInfo)}</div>, type:'attachment/link', width:400, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.description || obj.description===''){
            row.push({ key:'description', value: obj.description, type:'string', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
        
      console.log(row)
      if(row.length==5){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(CustomerPayment)=>PaymentsFormOpen(CustomerPayment, CustomerPaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      CustomerPayments: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(CustomerPayment)=>printPayment(CustomerPayment, CustomerPaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     CustomerPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(CustomerPayment)=>DeleteCustomerPayment(CustomerPayment, CustomerPaymentsarr), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     CustomerPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(CustomerPayments)=>printMultiplePayments(CustomerPayments, CustomerPaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
CustomerPayments: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'CustomerPayments'

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows}
console.log(tableData)
return tableData


    }


    const returnViaComp = (paidOptionInfo) => {

      if(!paidOptionInfo){
        return <> no data </>
      }

      return paidOptionInfo
        .filter((option) => option.checked)
        .map((option, index) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            key={index}
          >
            {returnPaymentTableIcon(option)}-<div>Rs. {option.amount}</div>
          </div>
        ))
        
    }


    


    const printPayment = ( CustomerPayment, CustomerPaymentsarr ) => { 

      const selctedCustomerPayment = CustomerPaymentsarr.filter((row)=>row.id===CustomerPayment[0].id)[0] || null
      const imageSrcArr = selctedCustomerPayment.images.map((image)=>image.imageSrc)

      if(imageSrcArr.length ===0){
        console.log("no image to print", imageSrcArr)
        return 
      }

      print({
        printable: [...imageSrcArr],
        type: 'image',
        headerStyle: 'display: none',
        footerStyle: 'display: none',
        targetStyles: ['*'],
        scanStyles: false,
      })

    }

    const printMultiplePayments = (CustomerPayments, CustomerPaymentsarr) => {
     console.log(CustomerPayments)
    
      let totalimageSrcArr = [];

      CustomerPayments.forEach((payment) => {
        const selctedCustomerPayment = CustomerPaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedCustomerPayment)
        const imageSrcArr = selctedCustomerPayment.images.map((image)=>image.imageSrc)
        totalimageSrcArr = [...totalimageSrcArr, ...imageSrcArr]
      })

      if(totalimageSrcArr.length === 0){
        console.log("no image to print", totalimageSrcArr)
        return 
      }

      print({
        printable: [...totalimageSrcArr],
        type: 'image',
        headerStyle: 'display: none',
        footerStyle: 'display: none',
        targetStyles: ['*'],
        scanStyles: false
      })

    }




const DeleteCustomerPayment = async(CustomerPayment, CustomerPaymentsarr) => {
      try {
        const selctedCustomerPaymentsRow = CustomerPaymentsarr.filter((row)=>row.id===CustomerPayment[0].id)[0] || null
        if(!selctedCustomerPaymentsRow){
          console.log(selctedCustomerPaymentsRow)
          return 
        }
        let res = await Axios.delete(`/CustomerPayment/delete?payment_id=${selctedCustomerPaymentsRow.id}`)
        if(res.data.success){
          getCustomerPayments()
          
        }
      } catch (error) {
        console.log(error)
      }
    }
   

const UpdateCustomerPayment = async(data) => {
      console.log(data)
      try {
        let body = {
          ...data.data,
            payment_id: `${data.Paymentid}`, 
            paidOptionInfo: data.data.paidOptionInfo
           .map((option) => {
              return {
                via: option.via,
                checked: true,
                amount: parseFloat(option.amount),
              };
            }),
          
        }

        let res = await Axios.post( `/CustomerPayment/update`, body )
        if(res.data.success){
          getCustomerPayments()
          setselectedCustomerPayment(null)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const PaymentsFormOpen = ( CustomerPayments, CustomerPaymentsarr ) => {

      console.log(CustomerPayments, CustomerPaymentsarr, tableData)
      const selctedCustomerPayment = CustomerPaymentsarr.filter((row)=>row.id===CustomerPayments[0].id)[0] || null
      console.log(selctedCustomerPayment)
      setselectedCustomerPayment(selctedCustomerPayment)
      setOpenPaymentsForm(true)

    }

const openForm = () => {
      setselectedCustomerPayment(null)
      setOpenPaymentsForm(true)
    }

    useEffect(() => {
      getCustomerPayments()
    },[CustomerId])

    console.log(allCustomerPaymentsinfo)
    return (

      <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1 }}> 

        <DialogDemo Open={openCustomerPaymentsForm} setOpen={(e)=> e?openForm():setOpenPaymentsForm(e) } buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <CustomerPaymentform
                {...props}
                createNewCustomerPayment={createNewPayment}
                selectedCustomerPayment={selectedCustomerPayment}
                UpdateCustomerPayment={UpdateCustomerPayment}
              />
            )}
         </DialogDemo>

        </div>

         
       { tableData && <Table  data={tableData} /> }

      </div>
    )
}

CustomerPayments.propTypes = {

    CustomerId: PropTypes.any.isRequired
  
  };



export default CustomerPayments;