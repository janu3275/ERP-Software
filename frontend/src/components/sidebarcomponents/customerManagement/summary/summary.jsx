import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import "./summary.css";
import Table from "../../../commoncomponents/tableComponent/table";
import { returnPaymenStatusEle } from "../../../../commonfn";
import { paymentItems } from "../../orders/allOrders/staticOptions";
import { useFilterStore } from "../../../../../strore/notificationStore";
import { useGetCustomerOrderSummary } from "./customerSummaryQueryHooks";
import { returnStringifiedFilter } from "../customerFilterFunctions";
import debounce from "lodash.debounce";



const CustomerSummary = () => {

    const storeFilterData = useFilterStore(state => state[`CustomerOrderSummary`]);
    // const [allCustomerAccountinfo, setallCustomerAccountinfo] = useState([]);
    // const [tableData, settableData] = useState(null);
    const customerOrderSummaryTableRef = useRef(null);

    const returnTableData = (data) => {

      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);
      return { ...tableobj };
     
    }

    const { data , error: getCustomerAccounterr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getCustomerAccountIsLoading } = useGetCustomerOrderSummary( null, returnStringifiedFilter(storeFilterData, 'CustomerSummary'));

    const allCustomerAccountinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);
    const summary = (data?.pages[0]?.summary ?? [])
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
          const table = customerOrderSummaryTableRef.current;
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
    
        const table = customerOrderSummaryTableRef.current;
        if (table) {
          table.addEventListener('scroll', onScroll);
          return () => table.removeEventListener('scroll', onScroll);
        }
      }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);
    // const returnCustomerSummary = async() => {

    //   try {

    //     let res = await Axios.get(`/order/getcustomersummary`)

    //     if(res.data.success){
    //       console.log(res.data.data)
    //       let CustomerAccountarr = [...res.data.data]
    //       return CustomerAccountarr;
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

    // const setinitialData = async () => {
    //   getDataAndRefreshTable()
    // }

    // const getDataAndRefreshTable = async() => {

    //     const CustomerAccountArr = await returnCustomerSummary()
    //     setallCustomerAccountinfo(CustomerAccountArr)

    //     const tableobj = convertDataForTable(CustomerAccountArr);
    //     settableData(tableobj)
    // }

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
       "width": 100,
       "sorted":null
      },
      {
        "columnName": "Payment status",
        "type": "options",
        "colNo": 4,
        "width": 200,
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
            row.push({ key:'payment_status', value: payment_status, ele: returnPaymenStatusEle(payment_status) , type:'options', width:200, rowNo:index+1, colNo:4, id:obj.id })
            row.push({ key:'total_bill', value: bill, type:'number', width:100, rowNo:index+1, colNo:5, id:obj.id })
            row.push({ key:'total_paid', value: paid, type:'number', width:100, rowNo:index+1, colNo:6, id:obj.id })
            row.push({ key:'outstanding', value: bill - paid  , type:'number', width:100, rowNo:index+1, colNo:7, id:obj.id })
      
      if(row.length==7){
        rows.push(row) 
      }

    })

const rowWiseFunctions = []


const groupFunctions = [];


const name = 'CustomerOrderSummary';

const tableRef = customerOrderSummaryTableRef;

const tableContainerStyle = {
  maxHeight:"calc(-266px + 100vh)"
}

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows, tableRef, tableContainerStyle };
console.log(tableData)
return tableData


}

const returnPaymentstatus = (bill, paid) => {

if(parseFloat(bill)-parseFloat(paid)<=0){
    return "paid"
}else{
    return "payment pending"
}

}





   

  


 

    // useEffect(() => {
    //     setinitialData()
    // },[])

    console.log(allCustomerAccountinfo)
    return (
       
  <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{ margin:0 }} className="tabheading"> <Icon
            icon="carbon:account"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(60, 137, 255)",
              cursor:"pointer"
              
              }}
          />  Customer account </div>

<div className="tablesummary">
     
        <div className="tablesummarytab">
      <div className="tablesummarytopic" style={{ background:"rgb(255 226 221 / 22%)"}}>    <Icon
    icon="flowbite:arrow-down-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(228 8 8)",
    cursor: "pointer",
   }} /> Total outstanding </div>
      <div className="tablesummaryinfo">
     Rs. {summary?.sum_outstanding ?? 0 }
      </div>
      </div>
      </div> 

         
      { allCustomerAccountinfo && <Table  data={returnTableData(allCustomerAccountinfo)} /> }

        
        </div>
        </div>
      
    )
}


export default CustomerSummary;