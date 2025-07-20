import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

import "./summary.css";
import Table from "../../../commoncomponents/tableComponent/table";
import { useFilterStore } from "../../../../../strore/notificationStore";
import { useGetVendorSummary } from "./vendorSummaryHooks";
import { returnVendorStringifiedFilter } from "../vendorFilterFunctions";
import debounce from "lodash.debounce";
import { paymentItems } from "../../orders/allOrders/staticOptions";
import { returnPaymenStatusEle } from "../../../../commonfn";

const VendorSummary = () => {
    const storeFilterData = useFilterStore(state => state[`VendorSummary`]);
    const vendorSummaryTableRef = useRef(null);

    const returnTableData = (data) => {

      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);
      return { ...tableobj };
     
    }

    const { data , error: getVendorAccounterr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getVendorAccountIsLoading } = useGetVendorSummary( null, returnVendorStringifiedFilter(storeFilterData, 'VendorSummary'));

    const allVendorAccountinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);

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
          const table = vendorSummaryTableRef.current;
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
    
        const table = vendorSummaryTableRef.current;
        if (table) {
          table.addEventListener('scroll', onScroll);
          return () => table.removeEventListener('scroll', onScroll);
        }
      }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);
    // const returnVendorSummary = async() => {

    //   try {

    //     let res = await Axios.get(`/order/getvendorsummary`)

    //     if(res.data.success){
    //       console.log(res.data.data)
    //       let VendorAccountarr = [...res.data.data]
    //       return VendorAccountarr;
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

    // const setinitialData = async () => {
    //   getDataAndRefreshTable()
    // }

    // const getDataAndRefreshTable = async() => {

    //     const VendorAccountArr = await returnVendorSummary()
    //     setallVendorAccountinfo(VendorAccountArr)

    //     const tableobj = convertDataForTable(VendorAccountArr);
    //     settableData(tableobj)
    // }

  const convertDataForTable = (VendorAccountArr) => {

    const VendorAccountarr = [...VendorAccountArr]
    const header =  [
        {
       "columnName": "Vendor",
       "type": "string",
       "colNo": 1,
       "width": 100,
       "sorted":null
      },
      {
        "columnName": "Contact person",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted":null
       },
      {
       "columnName": "Mobile number",
       "type": "string",
       "colNo": 3,
       "width": 100,
       "sorted": null
      },
      {
       "columnName": "Whatsapp number",
       "type": "string",
       "colNo": 4,
       "width": 100,
       "sorted":null
      },
      {
        "columnName": "Payment status",
        "type": "options",
        "colNo": 5,
        "width": 200,
        "sorted":null,
        "options": paymentItems
      },
      {
        "columnName": "Total bill",
        "type": "number",
        "colNo": 6,
        "width": 100,
        "sorted":null
      },
      {
       "columnName": "Total paid",
       "type": "number",
       "colNo": 7,
       "width": 100,
       "sorted":null
      },
      {
       "columnName": "Outstanding amount",
       "type": "number",
       "colNo": 8,
       "width": 100,
       "sorted":null
      }
    
    ]

      let rows = []
     
      VendorAccountarr.forEach((obj, index) => {
        let row = [];
            const bill = parseFloat(obj.total_bill) || 0;
            const paid = parseFloat(obj.total_paid) || 0;
            const payment_status = returnPaymentstatus(bill, paid)
       
            row.push({ key:'vendor_name', value:obj.vendor_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
            row.push({ key:'contact_person', value:obj.contact_person, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
            row.push({ key:'phone_number', value: obj.phone_number,  type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
            row.push({ key:'whatsapp_number', value: obj.whatsapp_number,  type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
            row.push({ key:'payment_status', value: payment_status, ele: returnPaymenStatusEle(payment_status) , type:'options', width:200, rowNo:index+1, colNo:5, id:obj.id })
            row.push({ key:'total_bill', value: bill, type:'number', width:100, rowNo:index+1, colNo:6, id:obj.id })
            row.push({ key:'total_paid', value: paid, type:'number', width:100, rowNo:index+1, colNo:7, id:obj.id })
            row.push({ key:'outstanding', value: bill - paid  , type:'number', width:100, rowNo:index+1, colNo:8, id:obj.id })
      
      if(row.length==8){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [];


const groupFunctions = [];


const name = 'VendorSummary';

const tableRef = vendorSummaryTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
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

const returnTotalOutstanding = (allVendorAccountinfo) => {
    let count = 0
    allVendorAccountinfo.filter((obj)=>obj.payment_status==='payment pending').forEach((obj)=>{
     count = count + parseFloat(obj.outstanding) 
    })
    return count

}





   

  


 

    // useEffect(() => {
    //     setinitialData()
    // },[])

    console.log(allVendorAccountinfo)
  
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
        />  Vendor account </div>
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
  Rs. {returnTotalOutstanding(allVendorAccountinfo)}
   </div>
   </div>
   </div> 
       
    { allVendorAccountinfo && <Table  data={returnTableData(allVendorAccountinfo)} /> }

      
      </div>
     

        
        </div>
    )
}


export default VendorSummary;