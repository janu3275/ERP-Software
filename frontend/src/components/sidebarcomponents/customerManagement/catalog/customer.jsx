import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Customerform from './Customerform';
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import { useQueryClient } from "@tanstack/react-query";
import { useAddCustomer, useDeleteCustomer, useGetCustomers, useUpdateCustomer } from "../customerQueryHooks";
import { useFilterStore } from "../../../../../strore/notificationStore";
import { returnStringifiedFilter } from "../customerFilterFunctions";
import debounce from "lodash.debounce";




const Customer = () => {
    const storeFilterData = useFilterStore(state => state['Customer']);
    const [openCustomerForm, setOpenCustomerForm] = useState(false);
    const [selectedCustomer, setselectedCustomer] = useState(null);
    const customerTableRef = useRef(null);

    const queryClient = useQueryClient();
   

    const returnTableData = (data) => {
      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }
      const tableobj = convertDataForTable(data);
      return {...tableobj};
     
    }

    const addCustomerSuccessfn = () => {    
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : ['customers', returnStringifiedFilter(storeFilterData)], exact: true });
      queryClient.invalidateQueries({ queryKey:['panelcustomers', returnStringifiedFilter(null)], exact: true });
      // Close the vendor form
      setOpenCustomerForm(false)
    }

    const updateCustomerSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey:['customers', returnStringifiedFilter(storeFilterData)], exact: true });
       queryClient.invalidateQueries({ queryKey:['panelcustomers', returnStringifiedFilter(null)], exact: true });
       setselectedCustomer(null)
       // Close the vendor form
       setOpenCustomerForm(false);

    }

    const deleteCustomerSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:['customers', returnStringifiedFilter(storeFilterData)], exact: true });
      queryClient.invalidateQueries({ queryKey:['panelcustomers', returnStringifiedFilter(null)], exact: true });
    }

 
    const { data , error: getCustomererr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getCustomerIsLoading } = useGetCustomers(null, returnStringifiedFilter(storeFilterData));

    const allCustomerinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);

    const { mutate: triggerCreateCustomer , error: addCustomererr, isLoading: addCustomerIsLoading } = useAddCustomer(addCustomerSuccessfn);

    const { mutate: triggerUpdateCustomer , error: updateCustomererr, isLoading: updateCustomerIsLoading } = useUpdateCustomer(updateCustomerSuccessfn);

    const { mutate: triggerDeleteCustomer , error: deleteCustomererr, isLoading: deleteCustomerIsLoading } = useDeleteCustomer(deleteCustomerSuccessfn);

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

const rowWiseFunctions = [{funcName:'edit', funct:(Customer)=>CustomerFormOpen(Customer, Customerarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Customer: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Customer)=>triggerDeleteCustomer({ Customer, Customerarr }), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Customer: "#3f3f3f",
     cursor: "pointer"
    }}
    />}]


const groupFunctions = [];

const serverSideFiltering = true;

const name = 'Customer';

const tableRef = customerTableRef;

const tableContainerStyle = {
  height:"calc(100vh - 236px)"
}

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows, serverSideFiltering, tableRef, tableContainerStyle }
console.log(tableData)
return tableData


    }






 const CustomerFormOpen = ( Customer, Customerarr ) => {

      console.log(Customer, Customerarr)
      const selctedCustomerRow = Customerarr.filter((row)=>row.id===Customer[0].id)[0] || null
      console.log(selctedCustomerRow)
      setselectedCustomer(selctedCustomerRow)
      setOpenCustomerForm(true)

    }





    console.log(allCustomerinfo, selectedCustomer, storeFilterData, returnTableData(allCustomerinfo))

    return (

      <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading">Customer Catalog</div>
   { allCustomerinfo && <div style={{position:"relative"}}>
     <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openCustomerForm} setOpen={setOpenCustomerForm} buttontext="Add customer" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Customerform
                {...props}
                createNewCustomer={triggerCreateCustomer}
                selectedCustomer={selectedCustomer}
                UpdateCustomer={triggerUpdateCustomer}
              />
            )}
         </DialogDemo>
         </div>
     
         
        <Table data={returnTableData(allCustomerinfo)} /> 

        
        </div> }
        </div>
        </div>
    )
}


export default Customer;