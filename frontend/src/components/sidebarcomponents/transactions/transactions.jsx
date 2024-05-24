import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Axios } from "../../../../utils/axios.mjs";
import Table from "../../commoncomponents/tableComponent/table";
import "./transactions.css";
import {  formatpaidOptionInfo, returnCategoryEle, returnConvertedDate, returnPaymentTableIcon } from "../../../commonfn";
import { transactionItems } from "../orders/allOrders/staticOptions";
import StackedImages from "../../../assets/singlecomponents/stackedimages/stackedimages";

const Transaction = () => {

    
    const [allTansactionsinfo, setallTansactionsinfo] = useState([]);
    const [tableData, settableData] = useState(null);



    const returnFilteredTransactions = async(filters) => {

      try {

        let body = {
          filters
        }

        let res = await Axios.post(`/transactions/getall`, body)
        if(res.data.success){
          console.log(res.data.data)
          let transactions = [...res.data.data]
          transactions = formatData(transactions)
          return convertTransactions(transactions);
        }
      } catch (error) {
        console.log(error)
      }

    }

    const convertTransactions = (transactions) => {

      const transaction = transactions.map((payment) => {
       return {
         Date: returnConvertedDate(payment.payment_date),
         Category:payment.category,
         Description:payment.description,
         Images:payment.images,
         Debit: payment.debit,
         Credit: payment.credit,
         via: payment.category==='Vendor payments'?"Refer to attachments":returnViaComp(payment.paidOptionInfo)
       }})
   
     return transaction;
   
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
          padding:"2px 5px", 
          borderRadius:"4px", 
          background:"antiquewhite",
          height:"fit-content"
        }}
        key={index}
      >
        {returnPaymentTableIcon(option)}-<div>Rs. {option.amount}</div>
      </div>
    ))
    
  }


  

    const setinitialData = async () => {
      getDataAndRefreshTable()
    }

    const getDataAndRefreshTable = async() => {

        const TransactionsArr = await returnFilteredTransactions([])
        setallTansactionsinfo(TransactionsArr)
        console.log(TransactionsArr)
        const tableobj = convertDataForTable(TransactionsArr);
        settableData(tableobj)
    }

  const convertDataForTable = (TansactionsArr) => {

    const Tansactionsarr = [...TansactionsArr]
    const header =  [
        {
       "columnName": "Payment date",
       "type": "date",
       "colNo": 1,
       "width": 100,
       "sorted":null
      },
      {
       "columnName": "Category",
       "type": "options",
       "colNo": 2,
       "width": 100,
       "sorted": null,
       "options": transactionItems
      },
      {
       "columnName": "Description",
       "type": "string",
       "colNo": 3,
       "width": 300,
       "sorted":null
      },
      {
        "columnName": "Attachment",
        "type": "attachment/link",
        "colNo": 4,
        "width": 100,
        "sorted":null
      },
      {
       "columnName": "Debit",
       "type": "number",
       "colNo": 5,
       "width": 100,
       "sorted":null
      },
      {
       "columnName": "Credit",
       "type": "number",
       "colNo": 6,
       "width": 100,
       "sorted":null
      },
      {
        "columnName": "via",
        "type": "attachment/link",
        "colNo": 7,
        "width": 300,
        "sorted":null
      }
    ]

      let rows = []
     
      Tansactionsarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.Date){
            row.push({ key:'date', value:obj.Date,   type:'date', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.Category){
            row.push({ key:'category', value: obj.Category, ele: returnCategoryEle(obj.Category), type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.Description){
            row.push({ key:'description', value: obj.Description,  type:'string', width:300, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.Images){
          row.push({ key:'images', value: <StackedImages key={index} images={obj.Images} imageSize={20} /> ,  type:'attachment/link', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.Debit || obj.Debit===0){
          row.push({ key:'debit', value: obj.Debit, type:'number', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.Credit || obj.Credit===0){
          row.push({ key:'credit', value: obj.Credit, type:'number', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
         if(obj.via){
          row.push({ key:'via', value: <div style={{display:"flex", gap:"5px", alignItems:"center"}}>{obj.via}</div>, type:'attachment/link', width:300, rowNo:index+1, colNo:7, id:obj.id })
         }
         
      if(row.length==7){
        rows.push(row) 
      }
    })

    const rowWiseFunctions = []


const groupFunctions = [];
const name = 'TransactionTable';

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows };
console.log(tableData)
return tableData


}


    useEffect(() => {
        setinitialData()
    },[])

    console.log(allTansactionsinfo)
    return (
        <div>
           <div className="transactionoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading"> Transactions </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
        </div>
        </div>
    )
}


export default Transaction;