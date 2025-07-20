import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import StackedImages from "../../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import { calculatePaid, formatpaidOptionInfo, returnConvertedDate, returnPaymentTableIcon } from "../../../../../commonfn";
import print from 'print-js'
import "./payments.css";
import EmployeePaymentform from "./paymentsform";
import { useFilterStore } from "../../../../../../strore/notificationStore";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { returnEmployeeStringifiedFilter } from "../../employeeFilterFunctions";
import { useAddEmployeePayment, useDeleteEmployeePayment, useGetEmployeePayments, useUpdateEmployeePayment } from "./employeePaymentQueryhooks";

const EmployeePayments = ({ employeeId }) => { 

    const storeFilterData = useFilterStore(state => state[`EmployeePayments${employeeId}`]);
    const [openEmployeePaymentsForm, setOpenPaymentsForm] = useState(false);
    const [selectedemployeePayment, setselectedemployeePayment] = useState(null);
    const employeePaymentTableRef = useRef(null);
    const queryClient = useQueryClient();

    const tablesummary = [
        {option:{via:"Cash"}, key:"total_cash"}, 
        {option:{via:"UPI"}, key:"total_upi"}, 
        {option:{via:"Cheque"}, key:"total_cheque"}, 
        {option:{via:"Other"}, key:"total_other"}
      ]

    const returnTableData = (data) => {

      console.log("🚀 ~ returnTableData ~ data:", data)

      if(!data){
        return null
      }

      const EmployeePaymentsarr = formatData(data)
      const tableobj = convertDataForTable(EmployeePaymentsarr);
      return { ...tableobj };
     
    }

    const addEmployeePaymentSuccessfn = () => {    
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : [`employeePayments-${employeeId}`, returnEmployeeStringifiedFilter(storeFilterData, 'EmployeePayments')], exact: true });
      // Close the vendor form
      setOpenPaymentsForm(false)

    }

    const updateEmployeePaymentSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey:[`employeePayments-${employeeId}`, returnEmployeeStringifiedFilter(storeFilterData, 'EmployeePayments')], exact: true });
       setselectedemployeePayment(null)
       // Close the vendor form
       setOpenPaymentsForm(false);

    }

    const deleteEmployeePaymentSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`employeePayments-${employeeId}`, returnEmployeeStringifiedFilter(storeFilterData, 'EmployeePayments')], exact: true });
    }

    const { data , error: getEmployeePaymenterr, fetchNextPage, hasNextPage, isFetchingNextPage, fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, isLoading: getEmployeePaymentIsLoading } = useGetEmployeePayments( employeeId, null, returnEmployeeStringifiedFilter(storeFilterData, 'EmployeePayments'));

    const allEmployeePaymentsinfo = (data?.pages ?? []).flatMap(page => page?.data ?? []);
    const summary = (data?.pages[0]?.summary ?? [])

    const { mutate: triggerCreateEmployeePayment , error: addEmployeePaymenterr, isLoading: addEmployeePaymentIsLoading } = useAddEmployeePayment(addEmployeePaymentSuccessfn);

    const { mutate: triggerUpdateEmployeePayment , error: updateEmployeePaymenterr, isLoading: updateEmployeePaymentIsLoading } = useUpdateEmployeePayment(updateEmployeePaymentSuccessfn);

    const { mutate: triggerDeleteEmployeePayment , error: deleteEmployeePaymenterr, isLoading: deleteEmployeePaymentIsLoading } = useDeleteEmployeePayment(deleteEmployeePaymentSuccessfn);

    
    // const createNewPayment = async (data) => {

    //  try {

    //     let body = {
    //       ...data,
    //       employee_id: employeeId,
    //       paidOptionInfo: data.paidOptionInfo
    //       .map((option) => {
    //         return {
    //           via: option.via,
    //           checked: true,
    //           amount: parseFloat(option.amount),
    //         };
    //       })
    //     }

    //     let res = await Axios.post(`/employeePayment/add`, body)

    //     if(res.data.success){
    //       getEmployeePayments()
    //       setOpenPaymentsForm(false)
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

// const getEmployeePayments = async() => {
//       try {

//         let res = await Axios.get(`/employeePayment/getall/${employeeId}`)
//         if(res.data.success){
//           console.log(res.data.data)
//           let EmployeePaymentsarr = [...res.data.data]
//           EmployeePaymentsarr = formatData(EmployeePaymentsarr)
//           setEmployeePaymentsinfo(EmployeePaymentsarr)
//           let tableobj = convertDataForTable(EmployeePaymentsarr);
//           settableData(tableobj)
//         }
//       } catch (error) {
//         console.log(error)
//       }

//     }


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
          const table = employeePaymentTableRef.current;
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
    
        const table = employeePaymentTableRef.current;
        if (table) {
          table.addEventListener('scroll', onScroll);
          return () => table.removeEventListener('scroll', onScroll);
        }
      }, [hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage]);

const formatData = (paymentarr) => {

    const newPaymentArr = paymentarr.map((payment) => {
      return {
        ...payment,
        paidOptionInfo: formatpaidOptionInfo(payment.paidOptionInfo)
      }
    })

    return newPaymentArr
   
  };

 

const convertDataForTable = (data) => {

       let EmployeePaymentsarr = [...data]
       const header =  [
      { 
        "columnName": "Payment date",
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
        "columnName": "via",
        "type": "attachment/link",
        "colNo": 4,
        "width": 500,
        "sorted":null
      },
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 5,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      EmployeePaymentsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)

         if(obj.payment_date){
          row.push({ key:'payment_date', value:returnConvertedDate(obj.payment_date), type:'date', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.paidOptionInfo){
            row.push({ key:'amount', value: calculatePaid(obj.paidOptionInfo), type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.paidOptionInfo){
          row.push({ key:'via', value: <div style={{display:"flex", gap:"15px"}}>{returnViaComp(obj.paidOptionInfo)}</div>, type:'attachment/link', width:500, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.description || obj.description===''){
            row.push({ key:'description', value: obj.description, type:'string', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
        
      console.log(row)
      if(row.length==5){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Update', funct:(employeePayment)=>PaymentsFormOpen(employeePayment, EmployeePaymentsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      color: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(employeePayment)=>printPayment(employeePayment, EmployeePaymentsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     color: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(employeePayment)=>triggerDeleteEmployeePayment(employeePayment, EmployeePaymentsarr), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     color: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(EmployeePayments)=>printMultiplePayments(EmployeePayments, EmployeePaymentsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
color: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = `EmployeePayments${employeeId}`

const tableRef = employeePaymentTableRef;

const tableContainerStyle = {
  maxHeight:"calc(100vh - 176px)"
}

const serverSideFiltering = true;

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows, tableRef, tableContainerStyle , serverSideFiltering}
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


    


    const printPayment = ( employeePayment, EmployeePaymentsarr ) => { 

      const selctedEmployeePayment = EmployeePaymentsarr.filter((row)=>row.id===employeePayment[0].id)[0] || null
      const imageSrcArr = selctedEmployeePayment.images.map((image)=>image.imageSrc)

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

    const printMultiplePayments = ( employeePayments, EmployeePaymentsarr ) => {
     console.log(employeePayments)
    
      let totalimageSrcArr = []
      employeePayments.forEach((payment) => {
        const selctedEmployeePayment = EmployeePaymentsarr.filter((row)=>row.id===payment[0].id)[0] || null
        console.log(selctedEmployeePayment)
        const imageSrcArr = selctedEmployeePayment.images.map((image)=>image.imageSrc)
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




// const DeleteEmployeePayment = async(employeePayment, EmployeePaymentsarr) => {
//       try {
//         const selctedEmployeePaymentsRow = EmployeePaymentsarr.filter((row)=>row.id===employeePayment[0].id)[0] || null
//         if(!selctedEmployeePaymentsRow){
//           console.log(selctedEmployeePaymentsRow)
//           return 
//         }
//         let res = await Axios.delete(`/employeePayment/delete?payment_id=${selctedEmployeePaymentsRow.id}`)
//         if(res.data.success){
//           getEmployeePayments()
          
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
   

// const UpdateemployeePayment = async(data) => {
//       console.log(data)
//       try {
//         let body = {
//           ...data.data,
//             payment_id: `${data.Paymentid}`, 
//             paidOptionInfo: data.data.paidOptionInfo
//            .map((option) => {
//               return {
//                 via: option.via,
//                 checked: true,
//                 amount: parseFloat(option.amount),
//               };
//             }),
          
//         }

//         let res = await Axios.post( `/employeePayment/update`, body )
//         if(res.data.success){
//           getEmployeePayments()
//           setselectedemployeePayment(null)
//           setOpenPaymentsForm(false)
//         }

//       } catch (error) {
//         console.log(error)
//       }
//     }

const PaymentsFormOpen = ( EmployeePayments, EmployeePaymentsarr ) => {

      console.log(EmployeePayments, EmployeePaymentsarr)
      const selctedEmployeePayment = EmployeePaymentsarr.filter((row)=>row.id===EmployeePayments[0].id)[0] || null
      console.log(selctedEmployeePayment)
      setselectedemployeePayment(selctedEmployeePayment)
      setOpenPaymentsForm(true)

    }

const openForm = () => {
      setselectedemployeePayment(null)
      setOpenPaymentsForm(true)
    }

const returnTotalPaid = (payments)=>{
  let count = 0
  payments.forEach((obj)=>{
  count = count + parseFloat(summary[obj.key])
})

return count
}    

    // useEffect(() => {
    //   getEmployeePayments()
    // },[employeeId])

    console.log(allEmployeePaymentsinfo)
    return (
<>
<div className="tablesummary">
     
        <div className="tablesummarytab">
        <div className="tablesummarytopic" style={{ background:"rgb(219 237 219 / 22%)"}}>   <Icon
    icon="tabler:cash"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(30, 197, 2)",
    cursor: "pointer",
   }} /> Paid ( Total ) </div>
      <div className="tablesummaryinfo">
      {tablesummary.map((obj, index)=> <div
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
    
      </div>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", padding:"5px 5px", borderTop:"1px solid rgb(233, 233, 231)"}}>Total : Rs. {returnTotalPaid(tablesummary)}</div>
      </div>
      </div>  
      {allEmployeePaymentsinfo && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1 }}> 

        <DialogDemo Open={openEmployeePaymentsForm} setOpen={(e)=> e?openForm():setOpenPaymentsForm(e) } buttontext="+ Add Payment"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <EmployeePaymentform
                {...props}
                createNewEmployeePayment={(data)=>triggerCreateEmployeePayment({data, employeeId})}
                selectedEmployeePayment={selectedemployeePayment}
                UpdateEmployeePayment={triggerUpdateEmployeePayment}
              />
            )}
         </DialogDemo>

        </div>

         
        <Table  data={returnTableData(allEmployeePaymentsinfo)} /> 

      </div>}
  </>
    )
}

EmployeePayments.propTypes = {

    employeeId: PropTypes.any.isRequired
  
  };



export default EmployeePayments;