import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import StackedImages from "../../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import VendorPaymentform from "./vendorPaymentsform";
import { returnConvertedDate } from "../../../../../commonfn";
import print from 'print-js'
import { useQueryClient } from "@tanstack/react-query";
import { useAddVendorPayment, useDeleteVendorPayment, useGetVendorPayments, useUpdateVendorPayment } from "../../../Vendorqueryhooks";
import { useFilterStore } from "../../../../../../strore/notificationStore";
import debounce from "lodash.debounce";
import { returnVendorStringifiedFilter } from "../../vendorFilterFunctions";


const VendorPayments = ({vendorId}) => { 

    const storeFilterData = useFilterStore(state => state[`VendorPayments${vendorId}`]);
    const [openVendorPaymentsForm, setOpenVendorPaymentsForm] = useState(false);
    const [selectedVendorPayment, setselectedVendorPayment] = useState(null);
    const vendorPaymentTableRef = useRef(null);
    const queryClient = useQueryClient();

  
    const returnTableData = (data) => {
      console.log(data)
      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);
      return tableobj
     
    }

    const addVendorPaymentSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : [`vendorPayments-${vendorId}`, returnVendorStringifiedFilter(storeFilterData, 'VendorPayments')], exact: true });
      // Close the vendor form
      setOpenVendorPaymentsForm(false)
    }

    const updateVendorPaymentSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey : [`vendorPayments-${vendorId}`, returnVendorStringifiedFilter(storeFilterData, 'VendorPayments')], exact: true });
       setselectedVendorPayment(null)
       setOpenVendorPaymentsForm(false)

    }

    const deleteVendorPaymentSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : [`vendorPayments-${vendorId}`, returnVendorStringifiedFilter(storeFilterData, 'VendorPayments')], exact: true });

    }

    
    const { data , error: getVendorPaymenterr,  fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getVendorPaymentIsLoading } = useGetVendorPayments( vendorId, null, returnVendorStringifiedFilter(storeFilterData, 'VendorPayments'));

    const vendorPaymentArr = (data?.pages ?? []).flatMap( page => page?.data ?? [] );

    const { mutate: triggerCreateVendorPayment , error: addVendorPaymenterr, isLoading: addVendorPaymentIsLoading } = useAddVendorPayment( addVendorPaymentSuccessfn );

    const { mutate: triggerUpdateVendorPayment , error: updateVendorPaymenterr, isLoading: updateVendorPaymentIsLoading } = useUpdateVendorPayment( updateVendorPaymentSuccessfn );

    const { mutate: triggerDeleteVendorPayment , error: deleteVendorPaymenterr, isLoading: deleteVendorPaymentIsLoading } = useDeleteVendorPayment( deleteVendorPaymentSuccessfn );

 
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
          const table = vendorPaymentTableRef.current;
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
    
        const table = vendorPaymentTableRef.current;
        if (table) {
          table.addEventListener('scroll', onScroll);
          return () => table.removeEventListener('scroll', onScroll);
        }
      }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);

 

const convertDataForTable = (data) => {

       let VendorPaymentsarr = [...data]

       const header =  [{ 
        "columnName": "Date",
        "type": "date",
        "colNo": 1,
        "width": 100,
        "sorted":null
      },
    {
        "columnName": "Attachment",
        "type": "attachment/link",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
     
      { 
         "columnName": "Amount",
         "type": "number",
         "colNo": 3,
         "width": 100,
         "sorted":null
       },
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 4,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      VendorPaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.payment_date){
            row.push({ key:'payment_date', value:returnConvertedDate(obj.payment_date), type:'date', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
       
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
        
         if(obj.amount){
            row.push({ key:'amount', value: obj.amount, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }

         if(obj.note || obj.note===''){
            row.push({ key:'note', value: obj.note, type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
        
      console.log(row)
      if(row.length==4){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(VendorPayment)=>VendorPaymentsFormOpen(VendorPayment, VendorPaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      VendorPayments: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(VendorPayment)=>printPayment(VendorPayment, VendorPaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(VendorPayment)=>triggerDeleteVendorPayment({VendorPayment, VendorPaymentsarr}), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorPayments: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(VendorPayments)=>printMultiplePayments(VendorPayments, VendorPaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
VendorPayments: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = `VendorPayments${vendorId}`

const tableRef = vendorPaymentTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
}

const serverSideFiltering = true;

const tableData = { name, groupFunctions, rowWiseFunctions,  header, rows, tableRef, tableContainerStyle , serverSideFiltering}
console.log(tableData)
return tableData


    }


    const printPayment = ( vendorPayment, VendorPaymentsarr ) => { 

      const selctedVendorPayment = VendorPaymentsarr.filter((row)=>row.id===vendorPayment[0].id)[0] || null
      const imageSrcArr = selctedVendorPayment.images.map((image)=>image.imageSrc)

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

    const printMultiplePayments = (vendorPayments, VendorPaymentsarr) => {
     console.log(vendorPayments)
    
      let totalimageSrcArr = []
      vendorPayments.forEach((payment) => {
        const selctedVendorPayment = VendorPaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedVendorPayment)
        const imageSrcArr = selctedVendorPayment.images.map((image)=>image.imageSrc)
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





   



const VendorPaymentsFormOpen = ( VendorPayments, VendorPaymentsarr ) => {
      console.log(VendorPayments, VendorPaymentsarr)
      const selctedVendorPaymentsRow = VendorPaymentsarr.filter((row)=>row.id===VendorPayments[0].id)[0] || null
      console.log(selctedVendorPaymentsRow)
      setselectedVendorPayment(selctedVendorPaymentsRow)
      setOpenVendorPaymentsForm(true)

    }

    const openForm = () => {
      setselectedVendorPayment(null)
      setOpenVendorPaymentsForm(true)
    }

   
 console.log(vendorPaymentArr, vendorId)

    return (
  <>
       { vendorPaymentArr && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 

        <DialogDemo Open={openVendorPaymentsForm} setOpen={(e)=>e?openForm():setOpenVendorPaymentsForm(e)} buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <VendorPaymentform
                {...props}
                createNewVendorPayment={(data)=>triggerCreateVendorPayment({data, vendorId})}
                selectedVendorPayment={selectedVendorPayment}
                UpdateVendorPayment={triggerUpdateVendorPayment}
              />
            )}
         </DialogDemo>
         </div>

         
       <Table  data={returnTableData(vendorPaymentArr)} /> 

        
        </div>}
    </>
    )
}

VendorPayments.propTypes = {

    vendorId: PropTypes.any.isRequired
  
  };



export default VendorPayments;