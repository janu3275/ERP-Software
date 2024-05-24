import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import Positionform from './positionForm';
import { Axios } from "../../../../../utils/axios.mjs";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";



const Position = () => {
    const [openPositionForm, setOpenPositionForm] = useState(false);
    const [allPositioninfo, setallPositioninfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedPosition, setselectedPosition] = useState(null);

    const createNewPosition = async(data) => {
      try {

        let body = {
          position_name: data.Position
        }

        let res = await Axios.post(`/Position/add`, body)

        if(res.data.success){
          getAllPosition()
          setOpenPositionForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllPosition = async() => {
      try {
        let res = await Axios.get(`/Position/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let Positionarr = [...res.data.data]
          setallPositioninfo(Positionarr)
          let tableobj = convertDataForTable(Positionarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let Positionarr = [...data]
    const header =  [{
      "columnName": "Position",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = Positionarr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='position_name'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(position)=>PositionFormOpen(position, Positionarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      position: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(position)=>DeletePosition(position, Positionarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    position: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'Position'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeletePosition = async(position, Positionarr) => {
      try {
        const selctedPositionRow = Positionarr.filter((row)=>row.id===position[0].id)[0] || null
        if(!selctedPositionRow){
          console.log(selctedPositionRow)
          return 
        }
        let res = await Axios.delete(`/Position/delete?position_id=${selctedPositionRow.id}`)
        if(res.data.success){
          getAllPosition()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdatePosition = async(data) => {
      console.log(data)
      try {
        let body = {
          position_id: `${data.Positionid}`, 
          position_name: data.data.Position
        }
        let res = await Axios.post(`/Position/update`, body)
        if(res.data.success){
          getAllPosition()
          setselectedPosition(null)
          setOpenPositionForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const PositionFormOpen = ( Position, Positionarr ) => {
      console.log(Position, Positionarr, tableData)
      const selctedPositionRow = Positionarr.filter((row)=>row.id===Position[0].id)[0] || null
      console.log(selctedPositionRow)
      setselectedPosition(selctedPositionRow)
      setOpenPositionForm(true)

    }

    useEffect(() => {
      getAllPosition()
    },[])

    console.log(allPositioninfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openPositionForm} setOpen={setOpenPositionForm} buttontext="Add position" btnclass = 'primarybtndiv'> 
         {(props) => (
              <Positionform
                {...props}
                createNewPosition={createNewPosition}
                selectedPosition={selectedPosition}
                UpdatePosition={UpdatePosition}
              />
            )}
         </DialogDemo>
         </div>
        </div>
         
       { tableData && <Table  data={tableData} /> }

        </div>
    )
}


export default Position;