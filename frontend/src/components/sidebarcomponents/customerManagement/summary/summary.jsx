import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import "./summary.css";
import Table from "../../../commoncomponents/tableComponent/table";
import { Axios } from "../../../../../utils/axios.mjs";
import { returnPaymenStatusEle } from "../../../../commonfn";
import { paymentItems } from "../../orders/allOrders/staticOptions";



const CustomerSummary = () => {

  
    const [allCustomerAccountinfo, setallCustomerAccountinfo] = useState([]);
    const [tableData, settableData] = useState(null);


    const returnCustomerSummary = async() => {

      try {

        let res = await Axios.get(`/order/getcustomersummary`)

        if(res.data.success){
          console.log(res.data.data)
          let CustomerAccountarr = [...res.data.data]
          return CustomerAccountarr;
        }

      } catch (error) {
        console.log(error)
      }

    }

    const setinitialData = async () => {
      getDataAndRefreshTable()
    }

    const getDataAndRefreshTable = async() => {

        const CustomerAccountArr = await returnCustomerSummary()
        setallCustomerAccountinfo(CustomerAccountArr)

        const tableobj = convertDataForTable(CustomerAccountArr);
        settableData(tableobj)
    }

  const convertDataForTable = (CustomerAccountArr) => {

    const CustomerAccountarr = [...CustomerAccountArr]
    const header =  [
        {
       "columnName": "Name",
       "type": "string",
       "colNo": 1,
       "width": 100,
       "sorted":null
      },
      {
       "columnName": "Mobile number",
       "type": "string",
       "colNo": 2,
       "width": 100,
       "sorted": null
      },
      {
       "columnName": "Whatsapp number",
       "type": "string",
       "colNo": 3,
       "width": 300,
       "sorted":null
      },
      {
        "columnName": "Payment status",
        "type": "options",
        "colNo": 4,
        "width": 300,
        "sorted":null,
        "options": paymentItems
      },
      {
        "columnName": "Total bill",
        "type": "number",
        "colNo": 5,
        "width": 100,
        "sorted":null
      },
      {
       "columnName": "Total paid",
       "type": "number",
       "colNo": 6,
       "width": 100,
       "sorted":null
      },
      {
       "columnName": "Outstanding amount",
       "type": "number",
       "colNo": 7,
       "width": 100,
       "sorted":null
      }
    
    ]

      let rows = []
     
      CustomerAccountarr.forEach((obj, index) => {
        let row = [];
            const bill = parseFloat(obj.total_bill) || 0;
            const paid = parseFloat(obj.total_paid) || 0;
            const payment_status = returnPaymentstatus(bill, paid)
       
            row.push({ key:'customer_name', value:obj.customer_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
            row.push({ key:'mobile_number', value: obj.mobile_number,  type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
            row.push({ key:'whatsapp_number', value: obj.whatsapp_number,  type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
            row.push({ key:'payment_status', value: payment_status, ele: returnPaymenStatusEle(payment_status) , type:'options', width:100, rowNo:index+1, colNo:4, id:obj.id })
            row.push({ key:'total_bill', value: bill, type:'number', width:100, rowNo:index+1, colNo:5, id:obj.id })
            row.push({ key:'total_paid', value: paid, type:'number', width:100, rowNo:index+1, colNo:6, id:obj.id })
            row.push({ key:'outstanding', value: bill - paid  , type:'number', width:100, rowNo:index+1, colNo:7, id:obj.id })
      
      if(row.length==7){
        rows.push(row) 
      }

    })

const rowWiseFunctions = []


const groupFunctions = [];


const name = 'customer_account_summary';

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows };
console.log(tableData)
return tableData


}

const returnPaymentstatus = (bill, paid)=>{

if(parseFloat(bill)-parseFloat(paid)<=0){
    return "paid"
}else{
    return "payment pending"
}
}





   

  


 

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allCustomerAccountinfo)
    return (
       
  <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading"> Customer account </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
        </div>
      
    )
}


export default CustomerSummary;