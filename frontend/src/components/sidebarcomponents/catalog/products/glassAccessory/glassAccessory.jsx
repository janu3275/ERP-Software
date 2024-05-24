import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import GlassAccessoryform from './glassAccessoryForm';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";



const GlassAccessory = () => {
    const [openglassAccessoryForm, setOpenglassAccessoryForm] = useState(false);
    const [allglassAccessoryinfo, setallglassAccessoryinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassAccessory, setselectedglassAccessory] = useState(null);
    const [items, setItems] = useState([])

    const createNewglassAccessory = async(data) => {
        console.log(data)
        const unit = data.unit
        const unitid = returnUnitid(unit, items)
        if(!unitid){
            console.log("no unit found")
            return 
        }

      try {
        let body = {
            ...data,
            unitid: unitid
         }

        let res = await Axios.post(`/glassAccessory/add`, body)

        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasAccessoryForm()
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

    const returnAllglassAccessory = async() => {

      try {
        const res = await Axios.get(`/glassAccessory/getall`)
        if(res.data.success){
          console.log(res.data.data)
          const glassAccessoryArr = [...res.data.data]
          return glassAccessoryArr
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

        const glassAccessoryArr = await returnAllglassAccessory()
        setallglassAccessoryinfo(glassAccessoryArr)

        const tableobj = convertDataForTable(glassAccessoryArr);
        settableData(tableobj)
    }

  const convertDataForTable = (glassAccessoryArr) => {

    const glassAccessoryarr = [...glassAccessoryArr]
    const header =  [
        {
      "columnName": "Name",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
      },
      {
        "columnName": "Unit",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Unit selling price",
        "type": "number",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
      {
        "columnName": "Stock",
        "type": "number",
        "colNo": 4,
        "width": 100,
        "sorted":null
      }
    ]

      let rows = []
    
      glassAccessoryarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.name){
            row.push({ key:'name', value:obj.name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
      
         if(obj.unit){
            row.push({ key:'unit', value: obj.unit, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.unit_selling_price){
            row.push({ key:'unit_selling_price', value: obj.unit_selling_price, type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.stock){
            row.push({ key:'stock', value: obj.stock, type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         
      if(row.length==4){
        rows.push(row) 
      }
    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Accessory)=>glassAccessoryFormOpen(Accessory, glassAccessoryarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Accessory)=>DeleteglassAccessory(Accessory, glassAccessoryarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'Glass Accessory table'

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


}

    const DeleteglassAccessory = async(Accessory, glassAccessoryarr) => {
      try {
        const selctedglassAccessoryRow = glassAccessoryarr.filter((row)=>row.id===Accessory[0].id)[0] || null
        if(!selctedglassAccessoryRow){
          console.log(selctedglassAccessoryRow)
          return 
        }
        let res = await Axios.delete(`/glassAccessory/delete?accessory_id=${selctedglassAccessoryRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const closeGlasAccessoryForm = () => {
        setselectedglassAccessory(null)
        setOpenglassAccessoryForm(false)
    }

    const UpdateglassAccessory = async({data,accessoryid}) => {
      console.log(data)
      const unit = data.unit
      const unitid = returnUnitid(unit, items)
      if(!unitid){
          console.log("no unit found")
          return 
      }
      try {
        let body = {
          accessory_id: `${accessoryid}`, 
          ...data,
          unitid: unitid
        }
        let res = await Axios.post(`/glassAccessory/update`, body)
        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasAccessoryForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassAccessoryFormOpen = (glassAccessory,glassAccessoryarr) => {
      console.log(glassAccessory, glassAccessoryarr, tableData)
      const selctedglassAccessoryRow = glassAccessoryarr.filter((row)=>row.id===glassAccessory[0].id)[0] || null
      console.log(selctedglassAccessoryRow)
      setselectedglassAccessory(selctedglassAccessoryRow)
      setOpenglassAccessoryForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allglassAccessoryinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassAccessoryForm} setOpen={setOpenglassAccessoryForm} buttontext="Add accessory" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassAccessoryform
                {...props}
                createNewAccessory={createNewglassAccessory}
                selectedaccessory={selectedglassAccessory}
                UpdateAccessory={UpdateglassAccessory}
                unitItems={items}
              />
            )}
         </DialogDemo>
         </div>
      </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassAccessory;