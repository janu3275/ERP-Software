import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";



import GlassSizeform from './glassSizeform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";
import { generateRandomId } from "../../../../../commonfn";


const GlassSize = () => {
    const [openglassSizeForm, setOpenglassSizeForm] = useState(false);
    const [allglassSizeinfo, setallglassSizeinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassSize, setselectedglassSize] = useState(null);
    const [items, setItems] = useState([])

    const createNewglassSize = async(data) => {
        console.log(data)
        const unit = data.unit
        const unitid = returnUnitid(unit, items)
        if(!unitid){
            console.log("no unit found")
            return 
        }


      try {
        let body = {
            length: data.length,
            width: data.width,
            unitid: unitid
         }

        let res = await Axios.post(`/glassSize/add`, body)

        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasSizeForm()
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

      const createItems = (unitarr)=>{
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

    const returnAllglassSize = async() => {

      try {
        const res = await Axios.get(`/glassSize/getall`)
        if(res.data.success){
          console.log(res.data.data)
          const glassSizeArr = [...res.data.data]
          return glassSizeArr
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

        const glassSizeArr = await returnAllglassSize()
        setallglassSizeinfo(glassSizeArr)

        const tableobj = convertDataForTable(glassSizeArr);
        settableData(tableobj)
    }

  const convertDataForTable = (glassSizeArr) => {
    const glassSizearr = [...glassSizeArr]
    const header =  [{
      "columnName": "Length",
      "type": "number",
      "colNo": 1,
      "width": 100,
      "sorted":null
      },{
        "columnName": "Width",
        "type": "number",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },{
        "columnName": "Unit",
        "type": "string",
        "colNo": 3,
        "width": 100,
        "sorted":null
      }]

      let rows = []
    
      glassSizearr.forEach((obj, index) => {
        let row = [];
       
         if(obj.length){
            row.push({ key:'length', value:obj.length, type:'number', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.width){
            row.push({ key:'width', value: obj.width, type:'number', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.unit){
            row.push({ key:'unit', value: obj.unit, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id , unitid:obj.unitid})
         }
         
      if(row.length==3){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Size)=>glassSizeFormOpen(Size, glassSizearr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Size: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Size)=>DeleteglassSize(Size, glassSizearr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Size: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = generateRandomId(10)

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


    }

    const DeleteglassSize = async(Size, glassSizearr) => {
      try {
        const selctedglassSizeRow = glassSizearr.filter((row)=>row.id===Size[0].id)[0] || null
        if(!selctedglassSizeRow){
          console.log(selctedglassSizeRow)
          return 
        }
        let res = await Axios.delete(`/glassSize/delete?sizeid=${selctedglassSizeRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const closeGlasSizeForm = () => {
        setselectedglassSize(null)
        setOpenglassSizeForm(false)
    }

    const UpdateglassSize = async(data) => {
      console.log(data)
      const unit = data.glassSize.unit
      const unitid = returnUnitid(unit, items)
      if(!unitid){
          console.log("no unit found")
          return 
      }
      try {
        let body = {
          sizeid: `${data.glassSizeid}`, 
          length: data.glassSize.length,
          width: data.glassSize.width,
          unitid: unitid
        }
        let res = await Axios.post(`/glassSize/update`, body)
        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasSizeForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassSizeFormOpen = (glassSize,glassSizearr) => {
      console.log(glassSize, glassSizearr, tableData)
      const selctedglassSizeRow = glassSizearr.filter((row)=>row.id===glassSize[0].id)[0] || null
      console.log(selctedglassSizeRow)
      setselectedglassSize(selctedglassSizeRow)
      setOpenglassSizeForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allglassSizeinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassSizeForm} setOpen={setOpenglassSizeForm} buttontext="Add size" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassSizeform
                {...props}
                createNewglassSize={createNewglassSize}
                selectedglassSize={selectedglassSize}
                UpdateglassSize={UpdateglassSize}
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


export default GlassSize;