import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import Unitform from './unitform';
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";


const Units = () => {
    const [openUnitForm, setOpenUnitForm] = useState(false);
    const [allunitsinfo, setallunitsinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedunit, setselectedunit] = useState(null);
    const createNewUnit = async(unit) => {
      try {
        let body = {
          unit:unit
       
        }
        let res = await Axios.post(`/unit/add`, body )
        if(res.data.success){
          getAllUnits()
          setOpenUnitForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const getAllUnits = async() => {
      try {
        let res = await Axios.get(`/unit/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let unitarr = [...res.data.data]
          setallunitsinfo(unitarr)
          let tableobj = convertDataForTable(unitarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let unitarr = [...data]
    const header =  [{
      "columnName": "Unit",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = unitarr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='unit'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(unit)=>unitFormOpen(unit, unitarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "#3f3f3f",
      cursor: "pointer",
    }}
  />}, {funcName:'delete', funct:(unit)=>DeleteUnit(unit, unitarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'Unit'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteUnit = async(unit, unitarr) => {
      try {
        const selctedUnitRow = unitarr.filter((row)=>row.id===unit[0].id)[0] || null
        if(!selctedUnitRow){
          console.log(selctedUnitRow)
          return 
        }
        let res = await Axios.delete(`/unit/delete?unitid=${selctedUnitRow.id}`)
        if(res.data.success){
          getAllUnits()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateUnit = async(unit) => {
      console.log(unit)
      try {
        let body = {
          unitid: `${unit.unitid}`, 
          unit: unit.unit
        }
        let res = await Axios.post(`/unit/update`, body)
        if(res.data.success){
          getAllUnits()
          setselectedunit(null)
          setOpenUnitForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const unitFormOpen = (unit,unitarr ) => {
      console.log(unit, unitarr, tableData)
      const selctedUnitRow = unitarr.filter((row)=>row.id===unit[0].id)[0] || null
      console.log(selctedUnitRow)
      setselectedunit(selctedUnitRow)
      setOpenUnitForm(true)

    }

    useEffect(()=>{
      getAllUnits()
    },[])

     console.log(allunitsinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openUnitForm} setOpen={setOpenUnitForm} buttontext="Add unit" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Unitform
                {...props}
                createNewUnit={createNewUnit}
                selectedunit={selectedunit}
                UpdateUnit={UpdateUnit}
              />
            )}
         </DialogDemo>
         </div>
         </div>
       {tableData && <Table  data={tableData} />}

        
        </div>
    )
}


export default Units;