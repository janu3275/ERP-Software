import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";



import GlassTypeform from './glassTypeForm';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";

const GlassType = () => {
    const [openglassTypeForm, setOpenglassTypeForm] = useState(false);
    const [allglassTypeinfo, setallglassTypeinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassType, setselectedglassType] = useState(null);

    const createNewglassType = async(data) => {
      try {
        let body = {
         ...data
       
        }
        let res = await Axios.post(`/glassType/add`, body )

        if(res.data.success){
          getAllglassType()
          setOpenglassTypeForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

    const getAllglassType = async() => {
      try {
        let res = await Axios.get(`/glassType/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassTypearr = [...res.data.data]
          setallglassTypeinfo(glassTypearr)
          let tableobj = convertDataForTable(glassTypearr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassTypearr = [...data]
    const header =  [{
      "columnName": "Glass Type",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = glassTypearr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='glass_type'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Type)=>glassTypeFormOpen(Type, glassTypearr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Type: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Type)=>DeleteglassType(Type, glassTypearr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Type: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'glassType'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassType = async(Type, glassTypearr) => {
      try {
        const selctedglassTypeRow = glassTypearr.filter((row)=>row.id===Type[0].id)[0] || null
        if(!selctedglassTypeRow){
          console.log(selctedglassTypeRow)
          return 
        }
        let res = await Axios.delete(`/glassType/delete?glassTypeid=${selctedglassTypeRow.id}`)
        if(res.data.success){
          getAllglassType()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassType = async({data, glassTypeid}) => {
      console.log(data)
      try {
        let body = {
          glassTypeid: `${glassTypeid}`, 
          ...data
        }
        let res = await Axios.post(`/glassType/update`, body)
        if(res.data.success){
          getAllglassType()
          closeGlassTypeForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassTypeFormOpen = (glassType,glassTypearr ) => {
      console.log(glassType, glassTypearr, tableData)
      const selctedglassTypeRow = glassTypearr.filter((row)=>row.id===glassType[0].id)[0] || null
      console.log(selctedglassTypeRow)
      setselectedglassType(selctedglassTypeRow)
      setOpenglassTypeForm(true)

    }

    const closeGlassTypeForm = ()=>{
      setselectedglassType(null)
      setOpenglassTypeForm(false)
    }

    useEffect(() => {
      getAllglassType()
    },[])

    console.log(allglassTypeinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}>  
        <DialogDemo Open={openglassTypeForm} setOpen={(e)=>e?setOpenglassTypeForm(e):closeGlassTypeForm()} buttontext="Add type" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassTypeform
                {...props}
                createNewglassType={createNewglassType}
                selectedglassType={selectedglassType}
                UpdateglassType={UpdateglassType}
              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassType;