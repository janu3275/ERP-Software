import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import Customerform from './Customerform';
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";




const Customer = () => {
    const [openCustomerForm, setOpenCustomerForm] = useState(false);
    const [allCustomerinfo, setallCustomerinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedCustomer, setselectedCustomer] = useState(null);

    const createNewCustomer = async ( data ) => {

      try {

        let body = {
          ...data
        }

        let res = await Axios.post(`/Customer/add`, body )

        if(res.data.success){
          getAllCustomer()
          setOpenCustomerForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

const getAllCustomer = async() => {
      try {
        let res = await Axios.get(`/Customer/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let Customerarr = [...res.data.data]
          setallCustomerinfo(Customerarr)
          let tableobj = convertDataForTable(Customerarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }



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
         "columnName": "Company name",
         "type": "string",
         "colNo": 4,
         "width": 100,
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
           "columnName": "Note",
           "type": "string",
           "colNo": 6,
           "width": 100,
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
            row.push({ key:'rate_per_sqft', value: obj.whatsapp_number, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.email_address){
          row.push({ key:'email_address', value:obj.email_address, type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.address){
          row.push({ key:'address', value: obj.address, type:'string', width:300, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.note){
          row.push({ key:'note', value: obj.note, type:'string', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }

         
      if(row.length==6){
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
     />}, {funcName:'delete', funct:(Customer)=>DeleteCustomer(Customer, Customerarr), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Customer: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = 'Customer'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

const DeleteCustomer = async(Customer, Customerarr) => {
      try {
        const selctedCustomerRow = Customerarr.filter((row)=>row.id===Customer[0].id)[0] || null
        if(!selctedCustomerRow){
          console.log(selctedCustomerRow)
          return 
        }
        let res = await Axios.delete(`/Customer/delete?customerid=${selctedCustomerRow.id}`)
        if(res.data.success){
          getAllCustomer()
          
        }
      } catch (error) {
        console.log(error)
      }
    }


const UpdateCustomer = async(data) => {
      console.log(data)
      try {
        let body = {
          customerid: `${data.customerid}`, 
          ...data.data
        }

        let res = await Axios.post( `/Customer/update`, body )
        if(res.data.success){
          getAllCustomer()
          setselectedCustomer(null)
          setOpenCustomerForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

const CustomerFormOpen = (Customer,Customerarr ) => {
      console.log(Customer, Customerarr, tableData)
      const selctedCustomerRow = Customerarr.filter((row)=>row.id===Customer[0].id)[0] || null
      console.log(selctedCustomerRow)
      setselectedCustomer(selctedCustomerRow)
      setOpenCustomerForm(true)

    }

    useEffect(() => {
      getAllCustomer()
    },[])

    console.log(allCustomerinfo, selectedCustomer)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openCustomerForm} setOpen={setOpenCustomerForm} buttontext="Add customer" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Customerform
                {...props}
                createNewCustomer={createNewCustomer}
                selectedCustomer={selectedCustomer}
                UpdateCustomer={UpdateCustomer}
              />
            )}
         </DialogDemo>
         </div>
        </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default Customer;