import { useState } from "react";
import { Icon } from "@iconify/react";
import Vendorform from './vendorForm';
import {  useQueryClient } from '@tanstack/react-query';
import DialogDemo from '../../../../assets/singlecomponents/dialog/dialog';
import Table from '../../../commoncomponents/tableComponent/table';
import { ProductTypeItems } from "../../orders/allOrders/staticOptions";
import {  useAddVendor, useDeleteVendor, useGetVendors, useUpdateVendor } from "../../Vendorqueryhooks";



const Vendor = () => {

    const [openVendorForm, setOpenVendorForm] = useState(false);
    const [selectedVendor, setselectedVendor] = useState(null);

    const queryClient = useQueryClient();
   

    const returnTableData = (data) => {
      console.log("🚀 ~ returnTableData ~ data:", data)
      if(!data){
        return null
      }
      const tableobj = convertDataForTable(data);
      return tableobj
     
    }

    const addVendorSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey : ['vendors'] });
      // Close the vendor form
      setOpenVendorForm(false)
    }

    const updateVendorSuccessfn = () => {
       // Invalidate or refetch the vendor list query
       queryClient.invalidateQueries({ queryKey:['vendors'] });
       setselectedVendor(null)
       // Close the vendor form
       setOpenVendorForm(false);

    }

    const deleteVendorSuccessfn = () => {
      // Invalidate or refetch the vendor list query
      queryClient.invalidateQueries({ queryKey:['vendors'] });
    }


    const { data: allVendorinfo , error: getVendorerr, isLoading: getVendorIsLoading } = useGetVendors();
  
    const { mutate: triggerCreateVendor , error: addVendorerr, isLoading: addVendorIsLoading } = useAddVendor(addVendorSuccessfn);

    const { mutate: triggerUpdateVendor , error: updateVendorerr, isLoading: updateVendorIsLoading } = useUpdateVendor(updateVendorSuccessfn);

    const { mutate: triggerDeleteVendor , error: deleteVendorerr, isLoading: deleteVendorIsLoading } = useDeleteVendor(deleteVendorSuccessfn);

    // allVendorinfo && returnTableData(allVendorinfo)

    
   
const convertDataForTable = (data) => {

       let Vendorarr = [...data]

       const header =  [{
      "columnName": "Vendor name",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
      },
    {
        "columnName": "Contact person",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Product type",
        "type": "options",
        "colNo": 3,
        "width": 100,
        "sorted":null,
        "options": ProductTypeItems
      },
     { 
        "columnName": "Email",
        "type": "string",
        "colNo": 4,
        "width": 100,
        "sorted":null
      },
      { 
         "columnName": "Phone number",
         "type": "string",
         "colNo": 5,
         "width": 100,
         "sorted":null
       },
       { 
        "columnName": "Whatsapp number",
        "type": "string",
        "colNo": 6,
        "width": 100,
        "sorted":null
       },
       { 
          "columnName": "Address",
          "type": "string",
          "colNo": 7,
          "width": 100,
          "sorted":null
        },
        { 
           "columnName": "City",
           "type": "string",
           "colNo": 8,
           "width": 100,
           "sorted":null
         },
         { 
            "columnName": "State Province",
            "type": "string",
            "colNo": 9,
            "width": 100,
            "sorted":null
          },
          { 
             "columnName": "Country",
             "type": "string",
             "colNo": 10,
             "width": 100,
             "sorted":null
           },
           { 
              "columnName": "Postal Code",
              "type": "string",
              "colNo": 11,
              "width": 100,
              "sorted":null
            },
            { 
               "columnName": "Note",
               "type": "string",
               "colNo": 12,
               "width": 100,
               "sorted":null
             }]
    
      let rows = []
    
      Vendorarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.vendor_name){
            row.push({ key:'vendor_name', value:obj.vendor_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.contact_person){
            row.push({ key:'contact_person', value: obj.contact_person, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.product_type){
          row.push({ key:'product_type', value:obj.product_type, type:'options', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.email || obj.email===""|| obj.email===null){
            row.push({ key:'email', value:obj.email || "none", type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.phone_number){
            row.push({ key:'phone_number', value: obj.phone_number, type:'string', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.whatsapp_number){
            row.push({ key:'whatsapp_number', value: obj.whatsapp_number, type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
         if(obj.address || obj.address===""|| obj.address===null){
            row.push({ key:'address', value: obj.address || "none", type:'string', width:100, rowNo:index+1, colNo:7, id:obj.id })
         }
         if(obj.city || obj.city===""|| obj.city===null){
            row.push({ key:'city', value: obj.city || "none", type:'string', width:100, rowNo:index+1, colNo:8, id:obj.id })
         }
         if(obj.state_province || obj.state_province===""|| obj.state_province===null){
            row.push({ key:'state_province', value: obj.state_province || "none", type:'string', width:100, rowNo:index+1, colNo:9, id:obj.id })
         }
         if(obj.country || obj.country===""|| obj.country===null){
            row.push({ key:'country', value: obj.country || "none", type:'string', width:100, rowNo:index+1, colNo:10, id:obj.id })
         }
         if(obj.postal_code || obj.postal_code===""|| obj.postal_code===null){
            row.push({ key:'postal_code', value: obj.postal_code || "none", type:'string', width:100, rowNo:index+1, colNo:11, id:obj.id })
         }
         if(obj.notes || obj.notes===""|| obj.notes===null){
            row.push({ key:'notes', value: obj.notes || "No added notes", type:'string', width:100, rowNo:index+1, colNo:12, id:obj.id })
         } 
        
   console.log(row)
         
      if(row.length==12){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'edit', funct:(Vendor)=>VendorFormOpen(Vendor, Vendorarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Vendor: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Vendor)=>triggerDeleteVendor({Vendor, Vendorarr}), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Vendor: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = ' Vendor'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }




const VendorFormOpen = ( Vendor, Vendorarr ) => {
     
      const selctedVendorRow = Vendorarr.filter((row)=>row.id===Vendor[0].id)[0] || null
      console.log(selctedVendorRow)
      setselectedVendor(selctedVendorRow)
      setOpenVendorForm(true)

    }

    const closeForm = ()=>{
      setselectedVendor(null)
      setOpenVendorForm(false)
    }



    console.log(allVendorinfo)
    return (

      <div className="detailoutercomp">
      <div className="infocomp">
  
     
    <div style={{margin:0}} className="tabheading">Vendor catalog</div>
   
    
  
   {allVendorinfo ? <div style={{position:"relative"}}>
    
     <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 

        <DialogDemo Open={openVendorForm} setOpen={(e)=>e?setOpenVendorForm(e):closeForm()} buttontext="Add Vendor" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Vendorform
                {...props}
                createNewVendor={triggerCreateVendor}
                selectedVendor={selectedVendor}
                UpdateVendor={triggerUpdateVendor}
              />
            )}
         </DialogDemo>
         </div>

        <Table  data={ returnTableData(allVendorinfo) } /> 

        </div>
        :
        <div> Unable to fetch vendor Info </div>

        }
        </div>
        </div>
    )
}


export default Vendor;