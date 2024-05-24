import { useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import StackedImages from "../../../../../assets/singlecomponents/stackedimages/stackedimages";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import VendorBillform from "./vendorbillform";
import { returnConvertedDate } from "../../../../../commonfn";
import print from 'print-js'
import "./vendorBills.css";
import { boolItems } from "../../../orders/allOrders/staticOptions";
import { useAddVendorBill, useDeleteVendorBill, useGetVendorBills, useUpdateVendorBill } from "../../../Vendorqueryhooks";
import { useQueryClient } from "@tanstack/react-query";


const VendorBills = ({ vendorId, product_type }) => { 

    const [openVendorBillsForm, setOpenVendorBillsForm] = useState(false);
    const [selectedVendorBill, setselectedVendorBill] = useState(null);

    const queryClient = useQueryClient();

    const addVendorBillSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : [`vendorBills-${vendorId}`] });
      // Close the vendor form
      setOpenVendorBillsForm(false)
    }

    const updateVendorBillSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey:[`vendorBills-${vendorId}`] });
       setselectedVendorBill(null)
       setOpenVendorBillsForm(false)

    }

    const deleteVendorBillSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`vendorBills-${vendorId}`] });
    }

    const returnTableData = (data) => {

      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);
      return tableobj
     
    }
    
    const { data: vendorBillArr , error: getVendorBillerr, isLoading: getVendorBillIsLoading } = useGetVendorBills( vendorId, product_type );

    const { mutate: triggerCreateVendorBill , error: addVendorBillerr, isLoading: addVendorBillIsLoading } = useAddVendorBill( addVendorBillSuccessfn );

    const { mutate: triggerUpdateVendorBill , error: updateVendorBillerr, isLoading: updateVendorBillIsLoading } = useUpdateVendorBill( updateVendorBillSuccessfn );

    const { mutate: triggerDeleteVendorBill , error: deleteVendorBillerr, isLoading: deleteVendorBillIsLoading } = useDeleteVendorBill( deleteVendorBillSuccessfn );
  

    
const convertDataForTable = (data) => {

    let VendorBillsarr = [...data]

    const header =  [{
      "columnName": "Bill number",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
      },
    {
        "columnName": "Attachment",
        "type": "attachment/link",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
     { 
        "columnName": "Date",
        "type": "date",
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
        "columnName": "Inventory added",
        "type": "options",
        "colNo": 5,
        "width": 100,
        "sorted": null,
        "options": boolItems
      },
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 6,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      VendorBillsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)
         
         if(obj.bill_number){
            row.push({ key:'bill_number', value:obj.bill_number, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.images){
            row.push({ key:'images', value: <StackedImages key={index} images={obj.images} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.bill_date){
            row.push({ key:'bill_date', value:returnConvertedDate(obj.bill_date), type:'date', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.bill_amount){
            row.push({ key:'bill_amount', value: obj.bill_amount, type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.items){
          row.push({ key:'inventory_added', value: obj?.items?.length>0?"true":"false", type:'options', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.note || obj.note===''){
            row.push({ key:'note', value: obj.note, type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
        
      console.log(row)

      if(row.length==6){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Edit', funct:(VendorBill)=>VendorBillsFormOpen(VendorBill, VendorBillsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      VendorBills: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:(VendorBill)=>printBill(VendorBill, VendorBillsarr), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorBills: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}, {funcName:'Delete', funct:(VendorBill)=>triggerDeleteVendorBill({VendorBill, VendorBillsarr}), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorBills: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(VendorBills)=>printMultipleBills(VendorBills, VendorBillsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
VendorBills: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'VendorBills'

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows}
console.log(tableData)
return tableData


    }


    const printBill = (vendorBill, VendorBillsarr) => { 

      const selctedVendorBill = VendorBillsarr.filter((row)=>row.id===vendorBill[0].id)[0] || null
      const imageSrcArr = selctedVendorBill.images.map((image)=>image.imageSrc)

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

    const printMultipleBills = (vendorBills, VendorBillsarr) => {
     console.log(vendorBills)
    
      let totalimageSrcArr = []
      vendorBills.forEach((bill) => {
        const selctedVendorBill = VendorBillsarr.filter((row)=>row.id===bill[0].id)[0] || null
        console.log(selctedVendorBill)
        const imageSrcArr = selctedVendorBill.images.map((image)=>image.imageSrc)
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




   


const VendorBillsFormOpen = ( VendorBills, VendorBillsarr ) => {
      console.log(VendorBills, VendorBillsarr)
      const selctedVendorBillsRow = VendorBillsarr.filter((row)=>row.id===VendorBills[0].id)[0] || null
      console.log(selctedVendorBillsRow)
      setselectedVendorBill(selctedVendorBillsRow)
      setOpenVendorBillsForm(true)

    }

    const openForm = () => {
      setselectedVendorBill(null)
      setOpenVendorBillsForm(true)
    }



    return (
        <>
        {vendorBillArr && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openVendorBillsForm} setOpen={(e)=>e?openForm():setOpenVendorBillsForm(e)} buttontext="+ Add Bill"  contentclass="dailogcontentclass" btnclass = 'primarybtndiv'> 
         {(props) => (
              <VendorBillform
                {...props}
                createNewVendorBill={(data)=>triggerCreateVendorBill({data, vendorId, product_type})}
                selectedVendorBill={selectedVendorBill}
                UpdateVendorBill={(data)=>triggerUpdateVendorBill({data, product_type})}
                product_type={product_type}
              />
            )}
         </DialogDemo>
         </div>

         
        <Table  data={returnTableData(vendorBillArr)} /> 

        
        </div>}
        </>
    )
}

VendorBills.propTypes = {

    vendorId: PropTypes.any.isRequired,
    product_type: PropTypes.string.isRequired
    
  };



export default VendorBills;