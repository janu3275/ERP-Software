import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import print from 'print-js'
import EmiPaymentform from "./EmiPaymentsform";
import { calculatePaid, formatpaidOptionInfo, returnConvertedDate, returnItems, returnOtherEle, returnPaymentTableIcon } from "../../../../commonfn";
import { Axios } from "../../../../../utils/axios.mjs";
import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";

const EmiPayments = () => { 

    const [openEmiPaymentsForm, setOpenPaymentsForm] = useState(false);
    const [allEmiPaymentsinfo, setEmiPaymentsinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedEmiPayments, setselectedEmiPayments] = useState(null);
    const [allEmiTypeItems, setallEmiTypeItems] = useState([]);
    
    const createNewPayment = async (data) => {
     const emi_types_id = returnid(data.purpose, allEmiTypeItems)
     try {

        let body = {
          ...data,
          emi_types_id,
          paidOptionInfo: data.paidOptionInfo
          .map((option) => {
            return {
              via: option.via,
              checked: true,
              amount: parseFloat(option.amount),
            };
          })
        }

        let res = await Axios.post(`/EmiPayments/add`, body)

        if(res.data.success){
          getDataAndRefreshTable(allEmiTypeItems)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }


    const setinitialData = async () => {

      const emiTypeArr = await returnAllEmiType()
      const emiTypeItems = returnItems(emiTypeArr, 'purpose', 'purpose', 'Purpose')
      setallEmiTypeItems(emiTypeItems)
      
      getDataAndRefreshTable( emiTypeItems )
       
     
}


  const getDataAndRefreshTable = async(emiTypeItems) => {
        
    const EmiPaymentsarr = await returnEmiPayments()
    setEmiPaymentsinfo(EmiPaymentsarr)
     console.log(EmiPaymentsarr)
    let tableobj = convertDataForTable(EmiPaymentsarr, emiTypeItems);
    settableData(tableobj)

}

const returnEmiPayments = async() => {
      try {

        let res = await Axios.get(`/EmiPayments/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let EmiPaymentsarr = [...res.data.data]
          EmiPaymentsarr = formatData(EmiPaymentsarr)
          return EmiPaymentsarr;
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const returnAllEmiType = async() => {
      try {
        let res = await Axios.get(`/EmiType/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let EmiTypearr = [...res.data.data]
          return EmiTypearr;
        
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

 

const convertDataForTable = ( data, emiTypeItems ) => {

       let EmiPaymentsarr = [...data]

       const header =  [
        { 
          "columnName": "EMI type",
          "type": "options",
          "colNo": 1,
          "width": 100,
          "sorted": null,
          "options": emiTypeItems
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
    
      EmiPaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.purpose){
          row.push({ key:'purpose', value:obj.purpose, ele:returnOtherEle(obj.purpose),  type:'options', width:100, rowNo:index+1, colNo:1, id:obj.id })
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

const rowWiseFunctions = [{funcName:'Edit', funct:(EmiPayments)=>PaymentsFormOpen(EmiPayments, EmiPaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      EmiPayments: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(EmiPayments)=>printPayment(EmiPayments, EmiPaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     EmiPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(EmiPayments)=>DeleteEmiPayment(EmiPayments, EmiPaymentsarr), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     EmiPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(EmiPayments)=>printMultiplePayments(EmiPayments, EmiPaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
EmiPayments: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'EmiPayments'

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


    


    const printPayment = ( EmiPayments, EmiPaymentsarr ) => { 

      const selctedEmiPayment = EmiPaymentsarr.filter((row)=>row.id===EmiPayments[0].id)[0] || null
      const imageSrcArr = selctedEmiPayment.images.map((image)=>image.imageSrc)

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

    const printMultiplePayments = (EmiPaymentss, EmiPaymentsarr) => {
     console.log(EmiPaymentss)
    
      let totalimageSrcArr = []
      EmiPaymentss.forEach((payment) => {
        const selctedEmiPayment = EmiPaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedEmiPayment)
        const imageSrcArr = selctedEmiPayment.images.map((image)=>image.imageSrc)
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




const DeleteEmiPayment = async(EmiPayments, EmiPaymentsarr) => {
      try {
        const selctedEmiPaymentsRow = EmiPaymentsarr.filter((row)=>row.id===EmiPayments[0].id)[0] || null
        if(!selctedEmiPaymentsRow){
          console.log(selctedEmiPaymentsRow)
          return 
        }
        let res = await Axios.delete(`/EmiPayments/delete?payment_id=${selctedEmiPaymentsRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable(allEmiTypeItems)
          
        }
      } catch (error) {
        console.log(error)
      }
    }
   
// add id
const UpdateEmiPayments = async(data) => {
      console.log(data)
      const emi_types_id = returnid(data.data.purpose, allEmiTypeItems)
      try {
        let body = {
          ...data.data,
            payment_id: `${data.Paymentid}`, 
            emi_types_id,
            paidOptionInfo: data.data.paidOptionInfo
           .map((option) => {
              return {
                via: option.via,
                checked: true,
                amount: parseFloat(option.amount),
              };
            }),
          
        }

        let res = await Axios.post( `/EmiPayments/update`, body )
        if(res.data.success){
          getDataAndRefreshTable(allEmiTypeItems)
          setselectedEmiPayments(null)
          setOpenPaymentsForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const PaymentsFormOpen = ( EmiPayments, EmiPaymentsarr ) => {

      console.log(EmiPayments, EmiPaymentsarr, tableData)
      const selctedEmiPayment = EmiPaymentsarr.filter((row)=>row.id===EmiPayments[0].id)[0] || null
      console.log(selctedEmiPayment)
      setselectedEmiPayments(selctedEmiPayment)
      setOpenPaymentsForm(true)

    }

const openForm = () => {
      setselectedEmiPayments(null)
      setOpenPaymentsForm(true)
    }

    useEffect(() => {
      setinitialData()
    },[])

    console.log(allEmiPaymentsinfo)
    return (

      <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading"> EMI Payments </div>

      <div style={{position:"relative"}} >
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1 }}> 

        <DialogDemo Open={openEmiPaymentsForm} setOpen={(e)=> e?openForm():setOpenPaymentsForm(e) } buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <EmiPaymentform
                {...props}
                createNewEmiPayment={createNewPayment}
                selectedEmiPayment={selectedEmiPayments}
                UpdateEmiPayment={UpdateEmiPayments}
                allEmiTypeItems={allEmiTypeItems}
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

EmiPayments.propTypes = {

  
  
  };



export default EmiPayments;