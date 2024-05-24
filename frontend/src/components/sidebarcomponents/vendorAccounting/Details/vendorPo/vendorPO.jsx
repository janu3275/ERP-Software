import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import print from 'print-js'
import VendorPOform from "./vendorPoform";
import {  returnConvertedDate } from "../../../../../commonfn";
import ViewPo from "./poItems/viewPo";
import { useReactToPrint } from 'react-to-print';
import { useQueryClient } from "@tanstack/react-query";
import { useAddVendorPO, useDeleteVendorPO, useGetVendorPO, useUpdateVendorPO } from "../../../Vendorqueryhooks";

const VendorPOs = ({vendorId}) => { 

    const [openVendorPOsForm, setOpenVendorPOsForm] = useState(false);
    const [selectedVendorPO, setselectedVendorPO] = useState(null);
    const [openViewPo, setOpenViewPo] = useState(false); 
    const poRef = useRef(null)

    const queryClient = useQueryClient();

    const addVendorPOSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : [`vendorPOs-${vendorId}`] });
      // Close the vendor form
      setOpenVendorPOsForm(false)
    }

    const updateVendorPOSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey:[`vendorPOs-${vendorId}`] });
       setselectedVendorPO(null)
       setOpenVendorPOsForm(false)

    }

    const deleteVendorPOSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:[`vendorPOs-${vendorId}`] });

    }

    const returnTableData = (data) => {
      console.log(data)
      if(!data){
        return null
      }

      const tableobj = convertDataForTable(data);
      return tableobj
     
    }
    
    const { data: vendorPOArr , error: getVendorPOerr, isLoading: getVendorPOIsLoading } = useGetVendorPO( vendorId );

    const { mutate: triggerCreateVendorPO , error: addVendorPOerr, isLoading: addVendorPOIsLoading } = useAddVendorPO( addVendorPOSuccessfn );

    const { mutate: triggerUpdateVendorPO , error: updateVendorPOerr, isLoading: updateVendorPOIsLoading } = useUpdateVendorPO( updateVendorPOSuccessfn );

    const { mutate: triggerDeleteVendorPO , error: deleteVendorPOerr, isLoading: deleteVendorPOIsLoading } = useDeleteVendorPO( deleteVendorPOSuccessfn );

 

const convertDataForTable = (data) => {

       let VendorPOsarr = [...data]
       const header =  [
        { 
            "columnName": "Purchase order date",
            "type": "date",
            "colNo": 1,
            "width": 300,
            "sorted":null
        },
     
       { 
        "columnName": "Note",
        "type": "string",
        "colNo": 2,
        "width": 300,
        "sorted":null
      }]
    
      let rows = []
    
      VendorPOsarr.forEach((obj, index) => {
        let row = [];
         console.log(obj)
         if(obj.po_date){
            row.push({ key:'po_date', value: returnConvertedDate(obj.po_date), type:'string', width:300, rowNo:index+1, colNo:1, id:obj.id })
         }
       
         if(obj.note || obj.note===''){
            row.push({ key:'note', value: obj.note, type:'string', width:300, rowNo:index+1, colNo:2, id:obj.id })
         }
        
      console.log(row)
      if(row.length==2){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'View', funct:(VendorPO)=>ViewPoOpen(VendorPO, VendorPOsarr) , icon: <Icon
icon="fluent-mdl2:full-view"
style={{
  width: "1.1rem",
  height: "1.1rem",
  VendorPOs: "rgb(82, 78, 70)",
  cursor: "pointer"
}}
 />},{funcName:'Edit', funct:(VendorPO)=>VendorPOsFormOpen(VendorPO, VendorPOsarr) , icon: <Icon
    icon="mynaui:edit-one"
    style={{
      width: "1.1rem",
      height: "1.1rem",
      VendorPOs: "rgb(82, 78, 70)",
      cursor: "pointer"
    }}
     />},
     {funcName:'Print', funct:()=>printPO(), icon: <Icon
     icon="material-symbols:print"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorPOs: "rgb(82, 78, 70)",
     cursor: "pointer"
    }}
    />}, {funcName:'Delete', funct:(VendorPO)=>triggerDeleteVendorPO({ VendorPO, VendorPOsarr }), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     VendorPOs: "rgb(82, 78, 70)",
     cursor: "pointer"
    }}
    />}]


const groupFunctions = [{funcName:'Print', funct:(VendorPOs)=>printMultiplePOs(VendorPOs, VendorPOsarr), icon: <Icon
icon="material-symbols:print"
style={{
width: "1.1rem",
height: "1.1rem",
VendorPOs: "rgb(82, 78, 70)",
cursor: "pointer",
}}
/>}];



const name = 'VendorPOs'

const tableData = {name, groupFunctions, rowWiseFunctions,  header, rows}
console.log(tableData)
return tableData


    }



    const printPO = useReactToPrint({
        content: () => poRef.current
      })

    const printMultiplePOs = (vendorPOs, VendorPOsarr) => {
     console.log(vendorPOs)
    
      let totalimageSrcArr = []
      vendorPOs.forEach((PO) => {
        const selctedVendorPO = VendorPOsarr.filter((row)=>row.id===PO[0].id)[0] || null
        console.log(selctedVendorPO)
        const imageSrcArr = selctedVendorPO.images.map((image)=>image.imageSrc)
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






const VendorPOsFormOpen = ( VendorPOs, VendorPOsarr ) => {
      console.log(VendorPOs, VendorPOsarr)
      const selctedVendorPOsRow = VendorPOsarr.filter((row)=>row.id===VendorPOs[0].id)[0] || null
      console.log(selctedVendorPOsRow)
      setselectedVendorPO(selctedVendorPOsRow)
      setOpenVendorPOsForm(true)

    }

    const ViewPoOpen = ( VendorPOs, VendorPOsarr ) => {

        console.log(VendorPOs, VendorPOsarr)
        const selctedVendorPOsRow = VendorPOsarr.filter((row)=>row.id===VendorPOs[0].id)[0] || null
        console.log(selctedVendorPOsRow)
        setselectedVendorPO(selctedVendorPOsRow)
        setOpenViewPo(true)
  
      }

    const openForm = () => {
      setselectedVendorPO(null)
      setOpenVendorPOsForm(true)
    }

  

    return (
     <>

       { vendorPOArr && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openVendorPOsForm} setOpen={(e)=>e?openForm():setOpenVendorPOsForm(e)} buttontext="+ Add purchase order"   btnclass = 'primarybtndiv'> 
         {(props) => (
              <VendorPOform
                {...props}
                createNewVendorPO={(data)=>triggerCreateVendorPO({data, vendorId})}
                selectedVendorPO={selectedVendorPO}
                UpdateVendorPO={triggerUpdateVendorPO}
              />
            )}
         </DialogDemo>
         </div>

         <DialogDemo Open={openViewPo} setOpen={setOpenViewPo} buttontext=""   btnclass = 'primarybtndiv'> 
         {(props) => (
              <ViewPo
                {...props}
                poRef={poRef}
                value={selectedVendorPO}
                
              />
            )}
         </DialogDemo>

         
        <Table  data={returnTableData(vendorPOArr)} />

        
        </div>}

      </>
    )
}

VendorPOs.propTypes = {

    vendorId: PropTypes.any.isRequired
  
  };



export default VendorPOs;