import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import OtherProductform from "./otherProductForm";
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";


const OtherProduct = () => {

    const [openOtherProductForm, setOpenOtherProductForm] = useState(false);
    const [allOtherProductinfo, setallOtherProductinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedOtherProduct, setselectedOtherProduct] = useState(null);
    const [items, setItems] = useState([]);

    const createNewOtherProduct = async(data) => {
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

        let res = await Axios.post(`/otherProduct/add`, body)

        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasproductForm()
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

    const returnAllOtherProduct = async() => {

      try {
        const res = await Axios.get(`/otherProduct/getall`)
        if(res.data.success){
          console.log(res.data.data)
          const OtherProductArr = [...res.data.data]
          return OtherProductArr
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

        const OtherProductArr = await returnAllOtherProduct()
        setallOtherProductinfo(OtherProductArr)

        const tableobj = convertDataForTable(OtherProductArr);
        settableData(tableobj)
    }

  const convertDataForTable = (OtherProductArr) => {

    const OtherProductarr = [...OtherProductArr]
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
        "columnName": "Stock",
        "type": "number",
        "colNo": 3,
        "width": 100,
        "sorted":null
      }
    ]

      let rows = []
    
      OtherProductarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.name){
            row.push({ key:'name', value:obj.name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.unit){
            row.push({ key:'unit', value: obj.unit, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.stock){
            row.push({ key:'stock', value: obj.stock, type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         
      if(row.length==3){
        rows.push(row) 
      }
    })

    const rowWiseFunctions = [{funcName:'edit', funct:(product)=>OtherProductFormOpen(product, OtherProductarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(product)=>DeleteOtherProduct(product, OtherProductarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'Glass product table'

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


}

    const DeleteOtherProduct = async(product, OtherProductarr) => {
      try {
        const selctedOtherProductRow = OtherProductarr.filter((row)=>row.id===product[0].id)[0] || null
        if(!selctedOtherProductRow){
          console.log(selctedOtherProductRow)
          return 
        }
        let res = await Axios.delete(`/otherProduct/delete?product_id=${selctedOtherProductRow.id}`)
        if(res.data.success){
          getDataAndRefreshTable()
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const closeGlasproductForm = () => {
        setselectedOtherProduct(null)
        setOpenOtherProductForm(false)
    }

    const UpdateOtherProduct = async({data,OtherProductid}) => {
      console.log(data)
      const unit = data.unit
      const unitid = returnUnitid(unit, items)
      if(!unitid){
          console.log("no unit found")
          return 
      }
      try {
        let body = {
          product_id: `${OtherProductid}`, 
          ...data,
          unitid: unitid
        }
        let res = await Axios.post(`/otherProduct/update`, body)
        if(res.data.success){
          getDataAndRefreshTable()
          closeGlasproductForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const OtherProductFormOpen = (OtherProduct,OtherProductarr) => {
      console.log(OtherProduct, OtherProductarr, tableData)
      const selctedOtherProductRow = OtherProductarr.filter((row)=>row.id===OtherProduct[0].id)[0] || null
      console.log(selctedOtherProductRow)
      setselectedOtherProduct(selctedOtherProductRow)
      setOpenOtherProductForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allOtherProductinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openOtherProductForm} setOpen={setOpenOtherProductForm} buttontext="Add product" btnclass = 'primarybtndiv'> 
         {(props) => (
              <OtherProductform
                {...props}
                createNewOtherProduct={createNewOtherProduct}
                selectedOtherProduct={selectedOtherProduct}
                UpdateOtherProduct={UpdateOtherProduct}
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


export default OtherProduct;