import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import GlassThicknessform from './glassThicknessForm';
import { Axios } from "../../../../../../utils/axios.mjs";
import { generateRandomId } from "../../../../../commonfn";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";



const GlassThickness = () => {
    const [openglassThicknessForm, setOpenglassThicknessForm] = useState(false);
    const [allglassThicknessinfo, setallglassThicknessinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassThickness, setselectedglassThickness] = useState(null);
    const [items, setItems] = useState([])

    const createNewglassThickness = async(data) => {
        console.log(data)
        const unit = data.unit
        const unitid = returnUnitid(unit, items)
        if(!unitid){
            console.log("no unit found")
            return 
        }

      try {
        let body = {
            thickness: data.thickness,
            unitid: unitid
         }

        let res = await Axios.post(`/glassThickness/add`, body)

        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasThicknessForm()
        }

      } catch (error) {
        console.log(error)
      }
    }

    const returnUnitid = (unit, items)=>{
        
        const unitid = items[0].items.filter((item)=>item.value===unit)[0].id
        if(unitid){
            return unitid
        }
        return null
    }

    const returnAllUnits = async() => {
        try {
          let res = await Axios.get(`/unit/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
      }

const createItems = (unitarr) => {
        let newarr = unitarr.map((unit) => {
            return {
            label: unit.unit,
            value: unit.unit,
            id: unit.id
            }
          })
  
    const itemsarr = [
      {
        label: "Units",
        items: newarr,
      }
    ];

    setItems(itemsarr)
      }

    const returnAllglassThickness = async() => {

      try {
        const res = await Axios.get(`/glassThickness/getall`)
        if(res.data.success){
          console.log(res.data.data)
          const glassThicknessArr = [...res.data.data]
          return glassThicknessArr
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const setinitialData = async ()=>{

        const unitArr = await returnAllUnits()
        createItems(unitArr)
        
        getDataAndRefreshTable()
       

    }

    const getDataAndRefreshTable = async() => {

        const glassThicknessArr = await returnAllglassThickness()
        setallglassThicknessinfo(glassThicknessArr)

        const tableobj = convertDataForTable(glassThicknessArr);
        settableData(tableobj)
    }

  const convertDataForTable = (glassThicknessArr) => {

    const glassThicknessarr = [...glassThicknessArr]
    const header =  [{
      "columnName": "Thickness",
      "type": "number",
      "colNo": 1,
      "width": 100,
      "sorted":null
      },{
        "columnName": "Unit",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted":null
      }]

      let rows = []
    
      glassThicknessarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.thickness){
            row.push({ key:'thickness', value:obj.thickness, type:'number', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
      
         if(obj.unit){
            row.push({ key:'unit', value: obj.unit, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         
      if(row.length==2){
        rows.push(row) 
      }
    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Thickness)=>glassThicknessFormOpen(Thickness, glassThicknessarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Thickness: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Thickness)=>DeleteglassThickness(Thickness, glassThicknessarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Thickness: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = generateRandomId(10)

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


}

    const DeleteglassThickness = async(Thickness, glassThicknessarr) => {
      try {
        const selctedglassThicknessRow = glassThicknessarr.filter((row)=>row.id===Thickness[0].id)[0] || null
        if(!selctedglassThicknessRow){
          console.log(selctedglassThicknessRow)
          return 
        }
        let res = await Axios.delete(`/glassThickness/delete?thicknessid=${selctedglassThicknessRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const closeGlasThicknessForm = () => {
        setselectedglassThickness(null)
        setOpenglassThicknessForm(false)
    }

    const UpdateglassThickness = async(data) => {
      console.log(data)
      const unit = data.glassThickness.unit
      const unitid = returnUnitid(unit, items)
      if(!unitid){
          console.log("no unit found")
          return 
      }
      try {
        let body = {
          thicknessid: `${data.glassThicknessid}`, 
          thickness: data.glassThickness.thickness,
          unitid: unitid
        }
        let res = await Axios.post(`/glassThickness/update`, body)
        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasThicknessForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassThicknessFormOpen = (glassThickness,glassThicknessarr) => {
      console.log(glassThickness, glassThicknessarr, tableData)
      const selctedglassThicknessRow = glassThicknessarr.filter((row)=>row.id===glassThickness[0].id)[0] || null
      console.log(selctedglassThicknessRow)
      setselectedglassThickness(selctedglassThicknessRow)
      setOpenglassThicknessForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allglassThicknessinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassThicknessForm} setOpen={setOpenglassThicknessForm} buttontext="Add thickness" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassThicknessform
                {...props}
                createNewglassThickness={createNewglassThickness}
                selectedglassThickness={selectedglassThickness}
                UpdateglassThickness={UpdateglassThickness}
                items={items}
              />
            )}
         </DialogDemo>
         </div>
         </div>

         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassThickness;