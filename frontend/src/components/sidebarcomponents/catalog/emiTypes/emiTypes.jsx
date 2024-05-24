import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import EmiTypeform from "./emiTypesForm";


const EmiType = () => {
    const [openEmiTypeForm, setOpenEmiTypeForm] = useState(false);
    const [allEmiTypeinfo, setallEmiTypeinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedEmiType, setselectedEmiType] = useState(null);

    const createNewEmiType = async(data) => {
      try {

        let body = {
          purpose: data.purpose
        }

        let res = await Axios.post(`/EmiType/add`, body)

        if(res.data.success){
          getAllEmiType()
          setOpenEmiTypeForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllEmiType = async() => {
      try {
        let res = await Axios.get(`/EmiType/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let EmiTypearr = [...res.data.data]
          setallEmiTypeinfo(EmiTypearr)
          let tableobj = convertDataForTable(EmiTypearr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let EmiTypearr = [...data]
    const header =  [{
      "columnName": "Service used",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = EmiTypearr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='purpose'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(EmiType)=>EmiTypeFormOpen(EmiType, EmiTypearr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      EmiType: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(EmiType)=>DeleteEmiType(EmiType, EmiTypearr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    EmiType: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'EmiType'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteEmiType = async(EmiType, EmiTypearr) => {
      try {
        const selctedEmiTypeRow = EmiTypearr.filter((row)=>row.id===EmiType[0].id)[0] || null
        if(!selctedEmiTypeRow){
          console.log(selctedEmiTypeRow)
          return 
        }
        let res = await Axios.delete(`/EmiType/delete?emi_type_id=${selctedEmiTypeRow.id}`)
        if(res.data.success){
          getAllEmiType()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateEmiType = async(data) => {
      console.log(data)
      try {
        
        let body = {
          emi_type_id: `${data.EmiTypeid}`, 
          purpose: data.data.purpose
        }

        let res = await Axios.post(`/EmiType/update`, body)
        if(res.data.success){
          getAllEmiType()
          setselectedEmiType(null)
          setOpenEmiTypeForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const EmiTypeFormOpen = ( EmiType, EmiTypearr ) => {
      console.log(EmiType, EmiTypearr, tableData)
      const selctedEmiTypeRow = EmiTypearr.filter((row)=>row.id===EmiType[0].id)[0] || null
      console.log(selctedEmiTypeRow)
      setselectedEmiType(selctedEmiTypeRow)
      setOpenEmiTypeForm(true)

    }

    useEffect(() => {
      getAllEmiType()
    },[])

    console.log(allEmiTypeinfo)
    return (
        <div>
        <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openEmiTypeForm} setOpen={setOpenEmiTypeForm} buttontext="Add EMI's" btnclass = 'primarybtndiv'> 
         {(props) => (
              <EmiTypeform
                {...props}
                createNewEmiType={createNewEmiType}
                selectedEmiType={selectedEmiType}
                UpdateEmiType={UpdateEmiType}
              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table  data={tableData} /> }

        </div>
    )
}


export default EmiType;