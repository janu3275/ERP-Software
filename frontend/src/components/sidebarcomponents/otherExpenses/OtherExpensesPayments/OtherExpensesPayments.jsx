import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { calculatePaid, formatpaidOptionInfo, returnConvertedDate, returnPaymentTableIcon } from "../../../../commonfn";
import { Axios } from "../../../../../utils/axios.mjs";
import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import print from 'print-js'
import OtherExpensePaymentform from "./OtherExpensesPaymentsform";



const OtherExpensePayments = () => { 

    const [openOtherExpensePaymentsForm, setOpenPaymentsForm] = useState(false);
    const [allOtherExpensePaymentsinfo, setOtherExpensePaymentsinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedOtherExpensePayments, setselectedOtherExpensePayments] = useState(null);
    
    
    const createNewPayment = async (data) => {
     
     try {

        let body = {
          ...data,
          
          paidOptionInfo: data.paidOptionInfo
          .map((option) => {
            return {
              via: option.via,
              checked: true,
              amount: parseFloat(option.amount),
            };
          })
        }

        let res = await Axios.post(`/OtherExpensePayments/add`, body)

        if(res.data.success){
          getDataAndRefreshTable()
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }


    const setinitialData = async () => {

     
      
      
      getDataAndRefreshTable(  )
       
     
}


  const getDataAndRefreshTable = async() => {
        
    const OtherExpensePaymentsarr = await returnOtherExpensePayments()
    setOtherExpensePaymentsinfo(OtherExpensePaymentsarr)

    let tableobj = convertDataForTable(OtherExpensePaymentsarr);
    settableData(tableobj)

}

const returnOtherExpensePayments = async() => {
      try {

        let res = await Axios.get(`/OtherExpensePayments/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let OtherExpensePaymentsarr = [...res.data.data]
          OtherExpensePaymentsarr = formatData(OtherExpensePaymentsarr)
          return OtherExpensePaymentsarr;
          
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

 

const convertDataForTable = ( data ) => {

       let OtherExpensePaymentsarr = [...data]

       const header =  [
        { 
          "columnName": "Expense",
          "type": "string",
          "colNo": 1,
          "width": 100,
          "sorted": null
          
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
    
      OtherExpensePaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.expense_name){
          row.push({ key:'expense_name', value: obj.expense_name, type:'options', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.payment_date){
          row.push({ key:'payment_date', value:returnConvertedDate(obj.payment_date), type:'date', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} /> , type:'attachment/link', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.paidOptionInfo){
            row.push({ key:'amount', value: calculatePaid(obj.paidOptionInfo), type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.paidOptionInfo){
          row.push({ key:'via', value: <div style={{display:"flex", gap:"15px"}}>{returnViaComp(obj.paidOptionInfo)}</div>, type:'attachment/link', width:400, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.description || obj.description===''){
            row.push({ key:'description', value: obj.description || "No description added", type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
        
      console.log(row)

      if(row.length==6){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(OtherExpensePayments)=>PaymentsFormOpen(OtherExpensePayments, OtherExpensePaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      OtherExpensePayments: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(OtherExpensePayments)=>printPayment(OtherExpensePayments, OtherExpensePaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     OtherExpensePayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(OtherExpensePayments)=>DeleteOtherExpensePayment(OtherExpensePayments, OtherExpensePaymentsarr), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     OtherExpensePayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(OtherExpensePayments)=>printMultiplePayments(OtherExpensePayments, OtherExpensePaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
OtherExpensePayments: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'OtherExpensePayments'

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


    


    const printPayment = ( OtherExpensePayments, OtherExpensePaymentsarr ) => { 

      const selctedOtherExpensePayment = OtherExpensePaymentsarr.filter((row)=>row.id===OtherExpensePayments[0].id)[0] || null
      const imageSrcArr = selctedOtherExpensePayment.images.map((image)=>image.imageSrc)

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

    const printMultiplePayments = (OtherExpensePaymentss, OtherExpensePaymentsarr) => {
     console.log(OtherExpensePaymentss)
    
      let totalimageSrcArr = []
      OtherExpensePaymentss.forEach((payment) => {
        const selctedOtherExpensePayment = OtherExpensePaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedOtherExpensePayment)
        const imageSrcArr = selctedOtherExpensePayment.images.map((image)=>image.imageSrc)
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




const DeleteOtherExpensePayment = async(OtherExpensePayments, OtherExpensePaymentsarr) => {
      try {
        const selctedOtherExpensePaymentsRow = OtherExpensePaymentsarr.filter((row)=>row.id===OtherExpensePayments[0].id)[0] || null
        if(!selctedOtherExpensePaymentsRow){
          console.log(selctedOtherExpensePaymentsRow)
          return 
        }
        let res = await Axios.delete(`/OtherExpensePayments/delete?payment_id=${selctedOtherExpensePaymentsRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }
    }
   
// add id
const UpdateOtherExpensePayments = async(data) => {
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

        let res = await Axios.post( `/OtherExpensePayments/update`, body )
        if(res.data.success){
          getDataAndRefreshTable()
          setselectedOtherExpensePayments(null)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const PaymentsFormOpen = ( OtherExpensePayments, OtherExpensePaymentsarr ) => {

      console.log(OtherExpensePayments, OtherExpensePaymentsarr, tableData)
      const selctedOtherExpensePayment = OtherExpensePaymentsarr.filter((row)=>row.id===OtherExpensePayments[0].id)[0] || null
      console.log(selctedOtherExpensePayment)
      setselectedOtherExpensePayments(selctedOtherExpensePayment)
      setOpenPaymentsForm(true)

    }

const openForm = () => {
      setselectedOtherExpensePayments(null)
      setOpenPaymentsForm(true)
    }

    useEffect(() => {
      setinitialData()
    },[])

    console.log(allOtherExpensePaymentsinfo)
    return (

      <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading"> Other expenses payments </div>
      <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1 }}> 

        <DialogDemo Open={openOtherExpensePaymentsForm} setOpen={(e)=> e?openForm():setOpenPaymentsForm(e) } buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <OtherExpensePaymentform
                {...props}
                createNewOtherExpensePayment={createNewPayment}
                selectedOtherExpensePayment={selectedOtherExpensePayments}
                UpdateOtherExpensePayment={UpdateOtherExpensePayments}
                
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

OtherExpensePayments.propTypes = {

  
  
  };



export default OtherExpensePayments;