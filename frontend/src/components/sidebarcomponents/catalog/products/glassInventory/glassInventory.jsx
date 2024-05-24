import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import GlassInventoryform from './glassInventoryForm';
import { Axios } from "../../../../../../utils/axios.mjs";
import { generateRandomId, returnAllglassInventory, returnOtherEle } from "../../../../../commonfn";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";




const GlassInventory = () => {
    const [openglassInventoryForm, setOpenglassInventoryForm] = useState(false);
    const [allglassInventoryinfo, setallglassInventoryinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassInventory, setselectedglassInventory] = useState(null);
    const [items, setItems] = useState({
        glassProductItems:[],
        sizeItems:[],
        
    })

    const createNewglassInventory = async(data) => {

        console.log(data)
      
    
        const glass_product_id = returnid(data.glassProduct, items.glassProductItems)
        const size_id = returnid(data.size, items.sizeItems)

        if(!glass_product_id || !size_id ){
            console.log("no unit found")
            return 
        }

      try {

        let body = {
            glass_product_id,
            size_id,
            stock: data.stock 
         }

        let res = await Axios.post(`/glassInventory/add`, body)

        if(res.data.success){
          const {glassProductItems, sizeItems} = items; 
          getDataAndRefreshTable( glassProductItems, sizeItems )
     
          closeGlasInventoryForm()
        }

      } catch (error) {
        console.log(error)
      }

    }

    const returnid = (originalValue, items)=>{
        
        const id = items[0].items.filter((item)=>item.value===originalValue)[0].id
        if(id){
            return id
        }
        return null
    }

   
      const returnAllGlassProducts = async() => {
        try {
          let res = await Axios.get(`/glassProduct/getall`)
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
    
      const returnAllSizes = async() => {
        try {
          let res = await Axios.get(`/glassSize/getall`)
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



   

    function returnSizeItems(arr) {

        let newarr = arr.map((obj) => {
            return {
            label: returnOtherEle(`${obj['length']} x ${obj['width']}`),
            value: `${obj['length']} x ${obj['width']}`,
            id: obj.id
            }
          })
    
    const itemsarr = [
      {
        label: 'Size',
        items: newarr,
      }
    ];
    
    return itemsarr
    
    
      }

    function returnGlassProductItems(arr) {

        let newarr = arr.map((obj) => {
            return {
            label: returnOtherEle(`${obj['thickness']}mm ${obj['color']} ${obj['glass_type']} ${obj['glass_company']} - glass`),
            value: `${obj['thickness']}mm ${obj['color']} ${obj['glass_type']} ${obj['glass_company']} - glass`,
            id: obj.id
            }
          })
    
    const itemsarr = [
      {
        label: 'Glass products',
        items: newarr,
      }
    ];
    
    return itemsarr
    
    
      }

    const setinitialData = async () => {

       
        const glassProductArr = await returnAllGlassProducts()
        const sizesArr = await returnAllSizes()
        
        
      
        const glassProductItems = returnGlassProductItems(glassProductArr)
        const sizeItems = returnSizeItems(sizesArr)
       

        setItems({
           
            glassProductItems,
            sizeItems
           
        })
        
        getDataAndRefreshTable(glassProductItems,sizeItems)
       

    }

    const getDataAndRefreshTable = async(glassProductItems,sizeItems) => {

        const glassInventoryArr = await returnAllglassInventory()
        setallglassInventoryinfo(glassInventoryArr)

        const tableobj = convertDataForTable(glassInventoryArr, glassProductItems,sizeItems);
        settableData(tableobj)
    }

  const convertDataForTable = (glassInventoryArr, glassProductItems, sizeItems) => {

    const glassInventoryarr = [...glassInventoryArr]
    
    const header =  [
      {
         "columnName": "Glass Product",
         "type": "options",
         "colNo": 1,
         "width": 300,
         "options": glassProductItems,
         "sorted":null
      },
      {
        "columnName": "Size ( sqft )",
        "type": "options",
        "colNo": 2,
        "width": 100,
        "options": sizeItems,
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
      
      glassInventoryarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.thickness && obj.color && obj.glass_type && obj.glass_company){
            const desc = `${obj['thickness']}mm ${obj['color']} ${obj['glass_type']} ${obj['glass_company']} - glass`
            row.push({ key:'glass_product', value:desc, ele: returnOtherEle(desc) , type:'options', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.length && obj.width){
            const size = `${obj['length']} x ${obj['width']}`
            row.push({ key:'size', value:size, ele:  returnOtherEle(size)  ,type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.stock){
            row.push({ key:'stock', value: obj.stock, type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         console.log(row)

      if(row.length==3){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [

  {funcName:'edit', funct:(Inventory)=>glassInventoryFormOpen(Inventory, glassInventoryarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Inventory: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, 
  {funcName:'delete', funct:(Inventory)=>DeleteglassInventory(Inventory, glassInventoryarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Inventory: "#3f3f3f",
    cursor: "pointer",
  }}

/>}]


const groupFunctions = [];

const name = generateRandomId(10);

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


}



  

    const DeleteglassInventory = async( Inventory, glassInventoryarr ) => {
      try {
        const selctedglassInventoryRow = glassInventoryarr.filter((row)=>row.id===Inventory[0].id)[0] || null
        if(!selctedglassInventoryRow){
          console.log(selctedglassInventoryRow)
          return 
        }
        let res = await Axios.delete(`/glassInventory/delete?Inventoryid=${selctedglassInventoryRow.id}`)
        if(res.data.success){
            const {glassProductItems, sizeItems} = items; 
            getDataAndRefreshTable( glassProductItems, sizeItems )
          
        }
      } catch (error) {
        console.log(error)
      }

    }



    const closeGlasInventoryForm = () => {
        setselectedglassInventory(null)
        setOpenglassInventoryForm(false)
    }

    const UpdateglassInventory = async({data, GlassInventoryid}) => {
      console.log(data, GlassInventoryid)
   
      const glass_product_id = returnid(data.glassProduct, items.glassProductItems)
      const size_id = returnid(data.size, items.sizeItems)

      if(!glass_product_id || !size_id ){
          console.log("no unit found")
          return 
      }
   
      try {

        let body = {
          Inventoryid: `${GlassInventoryid}`, 
          glass_product_id,
          size_id,
          stock: data.stock
        }

        let res = await Axios.post(`/glassInventory/update`, body)
        if(res.data.success){
          const {glassProductItems, sizeItems} = items; 
          getDataAndRefreshTable( glassProductItems, sizeItems )
          closeGlasInventoryForm()
        }

      } catch (error) {
        console.log(error)
      }

    }

    const glassInventoryFormOpen = (glassInventory,glassInventoryarr) => {
      console.log(glassInventory, glassInventoryarr, tableData)
      const selctedglassInventoryRow = glassInventoryarr.filter((row)=>row.id===glassInventory[0].id)[0] || null
      console.log(selctedglassInventoryRow)
      setselectedglassInventory(selctedglassInventoryRow)
      setOpenglassInventoryForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allglassInventoryinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}>  
        <DialogDemo Open={openglassInventoryForm} setOpen={setOpenglassInventoryForm} buttontext="Add inventory" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassInventoryform

                {...props}
                createNewGlassInventory={createNewglassInventory}
                selectedGlassInventory={selectedglassInventory}
                UpdateGlassInventory={UpdateglassInventory}
                glassProductItems={items.glassProductItems}
                sizeItems={items.sizeItems}

              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassInventory;