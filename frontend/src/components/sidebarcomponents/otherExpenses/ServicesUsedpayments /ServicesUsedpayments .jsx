import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { calculatePaid, formatpaidOptionInfo, returnConvertedDate, returnItems, returnOtherEle, returnPaymentTableIcon } from "../../../../commonfn";
import { Axios } from "../../../../../utils/axios.mjs";
import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import print from 'print-js';
import ServiceUsedPaymentform from './ServicesUsedpaymentsform';



const ServicesUsedPayments = () => { 

    const [openServicesUsedPaymentsForm, setOpenPaymentsForm] = useState(false);
    const [allServicesUsedPaymentsinfo, setServicesUsedPaymentsinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedServicesUsedPayments, setselectedServicesUsedPayments] = useState(null);
    const [allServiceUsedTypeItems, setallServiceUsedTypeItems] = useState([]);
    
    const createNewPayment = async (data) => {
     const expense_service_types_id = returnid(data.service_name, allServiceUsedTypeItems)
     try {

        let body = {
          ...data,
          expense_service_types_id,
          paidOptionInfo: data.paidOptionInfo
          .map((option) => {
            return {
              via: option.via,
              checked: true,
              amount: parseFloat(option.amount),
            };
          })
        }

        let res = await Axios.post(`/ServicesUsedPayments/add`, body)

        if(res.data.success){
          getDataAndRefreshTable(allServiceUsedTypeItems)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }


    const setinitialData = async () => {

      const serviceUsedTypeArr = await returnAllServiceUsedType()
      const serviceUsedTypeItems = returnItems(serviceUsedTypeArr, 'service_name', 'service_name', 'Service name')
      setallServiceUsedTypeItems(serviceUsedTypeItems)
      getDataAndRefreshTable( serviceUsedTypeItems )
       
     
}


  const getDataAndRefreshTable = async(serviceUsedTypeItems) => {
        
    const ServicesUsedPaymentsarr = await returnServicesUsedPayments()
    setServicesUsedPaymentsinfo(ServicesUsedPaymentsarr)

    let tableobj = convertDataForTable(ServicesUsedPaymentsarr, serviceUsedTypeItems);
    settableData(tableobj)

}

const returnServicesUsedPayments = async() => {
      try {

        let res = await Axios.get(`/ServicesUsedPayments/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let ServicesUsedPaymentsarr = [...res.data.data]
          ServicesUsedPaymentsarr = formatData(ServicesUsedPaymentsarr)
          return ServicesUsedPaymentsarr;
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const returnAllServiceUsedType = async() => {
      try {
        let res = await Axios.get(`/ExpenseService/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let ServiceUsedTypearr = [...res.data.data]
          return ServiceUsedTypearr;
        
        }
      } catch (error) {
        console.log(error)
      }
    }

    const returnid = (originalValue, items)=>{
        
      const id = items[0].items.filter((item)=>item.value===originalValue)[0].id
      if(id){
          return id
      }
      return null
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

 

const convertDataForTable = ( data, serviceUsedTypeItems ) => {

       let ServicesUsedPaymentsarr = [...data]

       const header =  [
        { 
          "columnName": "Service used",
          "type": "options",
          "colNo": 1,
          "width": 100,
          "sorted": null,
          "options": serviceUsedTypeItems
        },
      { 
        "columnName": "Payment date",
        "type": "date",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Attachment",
        "type": "attachment/link",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
      { 
         "columnName": "Amount",
         "type": "number",
         "colNo": 4,
         "width": 100,
         "sorted":null
       },
       { 
        "columnName": "via",
        "type": "attachment/link",
        "colNo": 5,
        "width": 100,
        "sorted":null
      },
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 6,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      ServicesUsedPaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.service_name){
          row.push({ key:'service_name', value: obj.service_name, ele:returnOtherEle(obj.service_name), type:'options', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.payment_date){
          row.push({ key:'payment_date', value:returnConvertedDate(obj.payment_date), type:'date', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.paidOptionInfo){
            row.push({ key:'amount', value: calculatePaid(obj.paidOptionInfo), type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.paidOptionInfo){
          row.push({ key:'via', value: <div style={{display:"flex", gap:"15px"}}>{returnViaComp(obj.paidOptionInfo)}</div>, type:'attachment/link', width:400, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.note || obj.note===''){
            row.push({ key:'note', value: obj.note || "No note added", type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
        
      console.log(row)

      if(row.length==6){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(ServicesUsedPayments)=>PaymentsFormOpen(ServicesUsedPayments, ServicesUsedPaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      ServicesUsedPayments: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(ServicesUsedPayments)=>printPayment(ServicesUsedPayments, ServicesUsedPaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     ServicesUsedPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(ServicesUsedPayments)=>DeleteServiceUsedPayment(ServicesUsedPayments, ServicesUsedPaymentsarr), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     ServicesUsedPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(ServicesUsedPayments)=>printMultiplePayments(ServicesUsedPayments, ServicesUsedPaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
ServicesUsedPayments: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'ServicesUsedPayments'

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


    


    const printPayment = ( ServicesUsedPayments, ServicesUsedPaymentsarr ) => { 

      const selctedServiceUsedPayment = ServicesUsedPaymentsarr.filter((row)=>row.id===ServicesUsedPayments[0].id)[0] || null
      const imageSrcArr = selctedServiceUsedPayment.images.map((image)=>image.imageSrc)

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

    const printMultiplePayments = (ServicesUsedPaymentss, ServicesUsedPaymentsarr) => {
     console.log(ServicesUsedPaymentss)
    
      let totalimageSrcArr = []
      ServicesUsedPaymentss.forEach((payment) => {
        const selctedServiceUsedPayment = ServicesUsedPaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedServiceUsedPayment)
        const imageSrcArr = selctedServiceUsedPayment.images.map((image)=>image.imageSrc)
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




const DeleteServiceUsedPayment = async(ServicesUsedPayments, ServicesUsedPaymentsarr) => {
      try {
        const selctedServicesUsedPaymentsRow = ServicesUsedPaymentsarr.filter((row)=>row.id===ServicesUsedPayments[0].id)[0] || null
        if(!selctedServicesUsedPaymentsRow){
          console.log(selctedServicesUsedPaymentsRow)
          return 
        }
        let res = await Axios.delete(`/ServicesUsedPayments/delete?payment_id=${selctedServicesUsedPaymentsRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable(allServiceUsedTypeItems)
          
        }
      } catch (error) {
        console.log(error)
      }
    }
   
// add id
const UpdateServicesUsedPayments = async(data) => {
      console.log(data)
      const expense_service_types_id = returnid(data.data.service_name, allServiceUsedTypeItems)
      try {
        let body = {
          ...data.data,
            payment_id: `${data.Paymentid}`, 
            expense_service_types_id,
            paidOptionInfo: data.data.paidOptionInfo
           .map((option) => {
              return {
                via: option.via,
                checked: true,
                amount: parseFloat(option.amount),
              };
            }),
          
        }

        let res = await Axios.post( `/ServicesUsedPayments/update`, body )
        if(res.data.success){
          getDataAndRefreshTable(allServiceUsedTypeItems)
          setselectedServicesUsedPayments(null)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const PaymentsFormOpen = ( ServicesUsedPayments, ServicesUsedPaymentsarr ) => {

      console.log(ServicesUsedPayments, ServicesUsedPaymentsarr, tableData)
      const selctedServiceUsedPayment = ServicesUsedPaymentsarr.filter((row)=>row.id===ServicesUsedPayments[0].id)[0] || null
      console.log(selctedServiceUsedPayment)
      setselectedServicesUsedPayments(selctedServiceUsedPayment)
      setOpenPaymentsForm(true)

    }

const openForm = () => {
      setselectedServicesUsedPayments(null)
      setOpenPaymentsForm(true)
    }

    useEffect(() => {
      setinitialData()
    },[])

    console.log(allServicesUsedPaymentsinfo)
    return (

      <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading">Used service payments </div>

      <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1 }}> 

        <DialogDemo Open={openServicesUsedPaymentsForm} setOpen={(e)=> e?openForm():setOpenPaymentsForm(e) } buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <ServiceUsedPaymentform
                {...props}
                createNewServiceUsedPayment={createNewPayment}
                selectedServiceUsedPayment={selectedServicesUsedPayments}
                UpdateServiceUsedPayment={UpdateServicesUsedPayments}
                allServiceUsedTypeItems={allServiceUsedTypeItems}
              />
            )}
         </DialogDemo>

        </div>

         
       { tableData && <Table  data={tableData} /> }

      </div>
      </div>
      </div>
    )
}

ServicesUsedPayments.propTypes = {

  
  
  };



export default ServicesUsedPayments;