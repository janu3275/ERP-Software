import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import ExpenseServiceform from "./expenseServiceForm";
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";


const ExpenseService = () => {
    const [openExpenseServiceForm, setOpenExpenseServiceForm] = useState(false);
    const [allExpenseServiceinfo, setallExpenseServiceinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedExpenseService, setselectedExpenseService] = useState(null);

    const createNewExpenseService = async(data) => {
      try {

        let body = {
          service_name: data.service_name
        }

        let res = await Axios.post(`/ExpenseService/add`, body)

        if(res.data.success){
          getAllExpenseService()
          setOpenExpenseServiceForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllExpenseService = async() => {
      try {
        let res = await Axios.get(`/ExpenseService/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let ExpenseServicearr = [...res.data.data]
          setallExpenseServiceinfo(ExpenseServicearr)
          let tableobj = convertDataForTable(ExpenseServicearr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let ExpenseServicearr = [...data]
    const header =  [{
      "columnName": "Service used",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = ExpenseServicearr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='service_name'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(ExpenseService)=>ExpenseServiceFormOpen(ExpenseService, ExpenseServicearr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      ExpenseService: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(ExpenseService)=>DeleteExpenseService(ExpenseService, ExpenseServicearr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    ExpenseService: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'ExpenseService'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteExpenseService = async(ExpenseService, ExpenseServicearr) => {
      try {
        const selctedExpenseServiceRow = ExpenseServicearr.filter((row)=>row.id===ExpenseService[0].id)[0] || null
        if(!selctedExpenseServiceRow){
          console.log(selctedExpenseServiceRow)
          return 
        }
        let res = await Axios.delete(`/ExpenseService/delete?expense_service_type_id=${selctedExpenseServiceRow.id}`)
        if(res.data.success){
          getAllExpenseService()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateExpenseService = async(data) => {
      console.log(data)
      try {
        
        let body = {
          expense_service_type_id: `${data.ExpenseServiceid}`, 
          service_name: data.data.service_name
        }

        let res = await Axios.post(`/ExpenseService/update`, body)
        if(res.data.success){
          getAllExpenseService()
          setselectedExpenseService(null)
          setOpenExpenseServiceForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const ExpenseServiceFormOpen = ( ExpenseService, ExpenseServicearr ) => {
      console.log(ExpenseService, ExpenseServicearr, tableData)
      const selctedExpenseServiceRow = ExpenseServicearr.filter((row)=>row.id===ExpenseService[0].id)[0] || null
      console.log(selctedExpenseServiceRow)
      setselectedExpenseService(selctedExpenseServiceRow)
      setOpenExpenseServiceForm(true)

    }

    useEffect(() => {
      getAllExpenseService()
    },[])

    console.log(allExpenseServiceinfo)
    return (
        <div>
      <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openExpenseServiceForm} setOpen={setOpenExpenseServiceForm} buttontext="Add services used" btnclass = 'primarybtndiv'> 
         {(props) => (
              <ExpenseServiceform
                {...props}
                createNewExpenseService={createNewExpenseService}
                selectedExpenseService={selectedExpenseService}
                UpdateExpenseService={UpdateExpenseService}
              />
            )}
         </DialogDemo>
         </div>
        </div>
         
       { tableData && <Table  data={tableData} /> }

        </div>
    )
}


export default ExpenseService;