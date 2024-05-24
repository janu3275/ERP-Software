import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import GlassColorform from './glassColorform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";


const GlassColor = () => {
    const [openglassColorForm, setOpenglassColorForm] = useState(false);
    const [allglassColorinfo, setallglassColorinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassColor, setselectedglassColor] = useState(null);

    const createNewglassColor = async(glassColor) => {
      try {
        let body = {
          color: glassColor
       
        }
        let res = await Axios.post(`/glassColor/add`, body )

        if(res.data.success){
          getAllglassColor()
          setOpenglassColorForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

    const getAllglassColor = async() => {
      try {
        let res = await Axios.get(`/glassColor/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassColorarr = [...res.data.data]
          setallglassColorinfo(glassColorarr)
          let tableobj = convertDataForTable(glassColorarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassColorarr = [...data]
    const header =  [{
      "columnName": "Color",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = glassColorarr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='color'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(color)=>glassColorFormOpen(color, glassColorarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(color)=>DeleteglassColor(color, glassColorarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'glassColor'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassColor = async(color, glassColorarr) => {
      try {
        const selctedglassColorRow = glassColorarr.filter((row)=>row.id===color[0].id)[0] || null
        if(!selctedglassColorRow){
          console.log(selctedglassColorRow)
          return 
        }
        let res = await Axios.delete(`/glassColor/delete?colorid=${selctedglassColorRow.id}`)
        if(res.data.success){
          getAllglassColor()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassColor = async(color) => {
      console.log(color)
      try {
        let body = {
          colorid: `${color.glassColorid}`, 
          color: color.glassColor
        }
        let res = await Axios.post(`/glassColor/update`, body)
        if(res.data.success){
          getAllglassColor()
          setselectedglassColor(null)
          setOpenglassColorForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassColorFormOpen = (glassColor,glassColorarr ) => {
      console.log(glassColor, glassColorarr, tableData)
      const selctedglassColorRow = glassColorarr.filter((row)=>row.id===glassColor[0].id)[0] || null
      console.log(selctedglassColorRow)
      setselectedglassColor(selctedglassColorRow)
      setOpenglassColorForm(true)

    }

    useEffect(() => {
      getAllglassColor()
    },[])

    console.log(allglassColorinfo)
    return (
        <div>
         <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassColorForm} setOpen={setOpenglassColorForm} buttontext="Add color" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassColorform
                {...props}
                createNewglassColor={createNewglassColor}
                selectedglassColor={selectedglassColor}
                UpdateglassColor={UpdateglassColor}
              />
            )}
         </DialogDemo>
         </div>
         </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassColor;