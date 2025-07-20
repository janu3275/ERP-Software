import { useEffect, useRef } from "react";
import Table from "../../../commoncomponents/tableComponent/table";
import { useGetCustomers} from "../customerQueryHooks";
import { useFilterStore } from "../../../../../strore/notificationStore";
import { returnStringifiedFilter } from "../customerFilterFunctions";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";




const CustomerSearchComp = ({selectCustomer}) => {

    const storeFilterData = useFilterStore(state => state['Customer']);

    const customerTableRef = useRef(null);

    const returnTableData = (data) => {
      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }
      const tableobj = convertDataForTable(data);
      return {...tableobj};
     
    }


 
    const { data , error: getCustomererr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getCustomerIsLoading } = useGetCustomers(null, returnStringifiedFilter(storeFilterData, 'customerCatalog'));

    const allCustomerinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);



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
      const table = customerTableRef.current;
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

    const table = customerTableRef.current;
    if (table) {
      table.addEventListener('scroll', onScroll);
      return () => table.removeEventListener('scroll', onScroll);
    }
  }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);


  

const convertDataForTable = (data) => {

       let Customerarr = [...data]

       const header =  [{
      "columnName": "Name",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
      },
    {
        "columnName": "Mobile Number",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
     { 
        "columnName": "Whatsapp Number",
        "type": "string",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
      { 
         "columnName": "Email address",
         "type": "string",
         "colNo": 4,
         "width": 200,
         "sorted":null
       },
       { 
          "columnName": "Address",
          "type": "string",
          "colNo": 5,
          "width": 300,
          "sorted":null
        },
        { 
          "columnName": "GST number",
          "type": "string",
          "colNo": 6,
          "width": 100,
          "sorted":null
        },
        { 
          "columnName": "PAN number",
          "type": "string",
          "colNo": 7,
          "width": 100,
          "sorted":null
        },
        { 
          "columnName": "Adhaar number",
          "type": "string",
          "colNo": 8,
          "width": 100,
          "sorted":null
        },
        { 
           "columnName": "Note",
           "type": "string",
           "colNo": 9,
           "width": 300,
           "sorted":null
         }]
    
      let rows = []
    
      Customerarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.name){
            row.push({ key:'name', value:obj.name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.mobile_number){
            row.push({ key:'mobile_number', value: obj.mobile_number, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.whatsapp_number){
            row.push({ key:'whatsapp_number', value: obj.whatsapp_number, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.email_address){
          row.push({ key:'email_address', value:obj.email_address, type:'string', width:200, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.address){
          row.push({ key:'address', value: obj.address, type:'string', width:300, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.gstin || obj.gstin===null || obj.gstin===""){
          row.push({ key:'gstin', value: obj.gstin || "nil", type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
         if(obj.pan || obj.pan===null || obj.pan===""){
          row.push({ key:'pan', value: obj.pan || "nil", type:'string', width:100, rowNo:index+1, colNo:7, id:obj.id })
         }
         if(obj.adhaar_number || obj.adhaar_number===null || obj.adhaar_number===""){
          row.push({ key:'adhaar_number', value: obj.adhaar_number || "nil", type:'string', width:100, rowNo:index+1, colNo:8, id:obj.id })
         }
         if(obj.note){
          row.push({ key:'note', value: obj.note, type:'string', width:300, rowNo:index+1, colNo:9, id:obj.id })
         }

         console.log(row)

      if(row.length==9){
        rows.push(row) 
      }

    })

const rowWiseFunctions = []

const groupFunctions = [];

const onrowclick = selectCustomer;

const serverSideFiltering = true;

const name = 'Customer';

const tableRef = customerTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
}





const tableData = { name, groupFunctions, rowWiseFunctions, header, rows, serverSideFiltering, tableRef, tableContainerStyle, onrowclick }
console.log(tableData)
return tableData


    }






 







    return (

      <div className="detailoutercomp" style={{margin:"0"}}>
      <div className="infocomp" style={{padding:"0", maxWidth:"90%"}}>
  
     
    
   { allCustomerinfo && <div style={{position:"relative"}}>

     
         
        <Table data={returnTableData(allCustomerinfo)} /> 

        
        </div> }
        </div>
        </div>
    )
}

CustomerSearchComp.propTypes = {


    selectCustomer: PropTypes.func.isRequired,
   
    

  };


export default CustomerSearchComp;