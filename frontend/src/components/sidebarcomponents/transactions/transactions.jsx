import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import Table from "../../commoncomponents/tableComponent/table";
import "./transactions.css";
import {  formatpaidOptionInfo, returnCategoryEle, returnConvertedDate, returnPaymentTableIcon } from "../../../commonfn";
import { transactionItems } from "../orders/allOrders/staticOptions";
import StackedImages from "../../../assets/singlecomponents/stackedimages/stackedimages";
import { useFilterStore } from "../../../../strore/notificationStore";
import { returnTransactionStringifiedFilter } from "./transactionFilterFunctions";
import { useGetTransactions } from "./transactionQueryHooks";
import debounce from "lodash.debounce";

const Transaction = () => {

    const storeFilterData = useFilterStore(state => state[`TransactionTable`]);
    const TransactionTableRef = useRef(null);
    const tablesummary = { 
    debit:[
      {option:{via:"Cash"}, key:"negative_total_cash"}, 
      {option:{via:"UPI"}, key:"negative_total_upi"}, 
      {option:{via:"Cheque"}, key:"negative_total_cheque"}, 
      {option:{via:"Other"}, key:"negative_total_other"}
    ],
    credit:[
      {option:{via:"Cash"}, key:"positive_total_cash"}, 
      {option:{via:"UPI"}, key:"positive_total_upi"}, 
      {option:{via:"Cheque"}, key:"positive_total_cheque"}, 
      {option:{via:"Other"}, key:"positive_total_other"}
    ]}
    

    const returnTableData = (data) => {

      console.log("🚀 ~ returnTableData ~ data:", data)

      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);

      return { ...tableobj };
     
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
          background:"#fff4e5",
          height:"fit-content"
        }}
        key={index}
      >
        {returnPaymentTableIcon(option)}-<div>Rs. {option.amount}</div>
      </div>
    ))
    
  }

    const returnTransactionInfo = (transaction) => {
      console.log(transaction)
      const transactions = formatData(transaction)
      return convertTransactions(transactions)  
     }


    const { data, error: getOrdererr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getOrderIsLoading } = useGetTransactions(null, returnTransactionStringifiedFilter(storeFilterData, 'Transactions'));

    const allTansactionsinfo = returnTransactionInfo((data?.pages ?? []).flatMap(page => page?.data ?? []));
    const summary = (data?.pages[0]?.summary ?? [])

    // const returnFilteredTransactions = async(filters) => {

    //   try {

    //     let body = {
    //       filters
    //     }

    //     let res = await Axios.post(`/transactions/getall`, body)
    //     if(res.data.success){
    //       console.log(res.data.data)
    //       let transactions = [...res.data.data]
    //       transactions = formatData(transactions)
    //       return convertTransactions(transactions);
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

  

   


  

    // const setinitialData = async () => {
    //   getDataAndRefreshTable()
    // }

    // const getDataAndRefreshTable = async() => {

    //     const TransactionsArr = await returnFilteredTransactions([])
    //     setallTansactionsinfo(TransactionsArr)
    //     console.log(TransactionsArr)
    //     const tableobj = convertDataForTable(TransactionsArr);
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
      const table = TransactionTableRef.current;
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

    const table = TransactionTableRef.current;
    if (table) {
      table.addEventListener('scroll', onScroll);
      return () => table.removeEventListener('scroll', onScroll);
    }
  }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);



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
       "width": 200,
       "sorted": null,
       "options": transactionItems
      },
      {
       "columnName": "Description",
       "type": "string",
       "colNo": 3,
       "width": 350,
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
        "width": 500,
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
            row.push({ key:'category', value: obj.Category, ele: returnCategoryEle(obj.Category), type:'options', width:200, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.Description){
            row.push({ key:'description', value: obj.Description,  type:'string', width:350, rowNo:index+1, colNo:3, id:obj.id })
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
          row.push({ key:'via', value: <div style={{display:"flex", gap:"5px", alignItems:"center"}}>{obj.via}</div>, type:'attachment/link', width:500, rowNo:index+1, colNo:7, id:obj.id })
         }
         
      if(row.length==7){
        rows.push(row) 
      }
    })

    const rowWiseFunctions = []


const groupFunctions = [];
const name = 'TransactionTable';

const tableRef = TransactionTableRef;

const tableContainerStyle = {
  maxHeight:"calc(-430px + 100vh)"
}

const serverSideFiltering = true;

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows, tableRef, tableContainerStyle, serverSideFiltering };
console.log(tableData)
return tableData


}


    // useEffect(() => {
    //     setinitialData()
    // },[])

    console.log(allTansactionsinfo, data, summary)
    return (
        <div>
           <div className="transactionoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading"> <Icon
            icon="material-symbols-light:library-books-outline"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(60, 137, 255)",
              cursor: "pointer",
            }}
           
          /> Transactions </div>


      <div className="tablesummary">
      <div className="tablesummarytab">
      <div className="tablesummarytopic" style={{ background:"rgb(219 237 219 / 22%)"}}>   <Icon
    icon="flowbite:arrow-up-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(30, 197, 2)",
    cursor: "pointer",
   }} /> Credit ( Total ) </div>
      <div className="tablesummaryinfo">
      {tablesummary.credit.map((obj, index)=><div
       key={index}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding:"3px 5px", 
          borderRadius:"4px", 
          background:"#fff4e5",
          height:"fit-content",
          minWidth:"140px"
        }}
       
      >
        {returnPaymentTableIcon(obj.option)}-<div>Rs. {summary[obj.key]}</div>
      </div>)}
      </div>
      </div>
        <div className="tablesummarytab">
      <div className="tablesummarytopic" style={{ background:"rgb(255 226 221 / 22%)"}}>    <Icon
    icon="flowbite:arrow-down-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(228 8 8)",
    cursor: "pointer",
   }} /> Debit ( Total ) </div>
      <div className="tablesummaryinfo">
      {tablesummary.debit.map((obj, index)=><div
       key={index}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding:"2px 5px", 
          borderRadius:"4px", 
          background:"#fff4e5",
          height:"fit-content",
          minWidth:"140px"
        }}
       
      >
        {returnPaymentTableIcon(obj.option)}-<div>Rs. {summary[obj.key]}</div>
      </div>)}
      <div  
      style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding:"3px 5px", 
          borderRadius:"4px", 
          background:"#fff4e5",
          height:"fit-content",
          minWidth:"140px"
        }}
        >Vendor payments: {summary?.sum_vendor_payments ?? 0} </div>
      </div>
      </div>
      </div>    

         
       { allTansactionsinfo && <Table  data={returnTableData(allTansactionsinfo)} /> }

        
        </div>
        </div>
        </div>
    )
}


export default Transaction;