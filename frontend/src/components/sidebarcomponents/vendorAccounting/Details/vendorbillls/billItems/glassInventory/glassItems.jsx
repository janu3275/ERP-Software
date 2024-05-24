import { useEffect,  useState } from "react";
import PropTypes from "prop-types";
import { Axios } from "../../../../../../../../utils/axios.mjs";
import Table from "../../../../../../commoncomponents/tableComponent/table";
import { Icon } from "@iconify/react";




const InventoryItems = ({onChange, value, glassInventoryArr, closeInventoryItems}) => { 

   
  

    const [tableData, settableData] = useState(null);


   
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
            label: `${obj['length']} x ${obj['width']}`,
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
            label: `${obj['thickness']}mm ${obj['color']} ${obj['glass_type']} ${obj['glass_company']} - glass`,
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
       

        
        getDataAndRefreshTable(glassProductItems, sizeItems)
       

    }

    const getDataAndRefreshTable = async(glassProductItems,sizeItems) => {

        const tableobj = convertDataForTable(glassInventoryArr, glassProductItems, sizeItems, value);
        settableData(tableobj)
    }

 

const convertDataForTable = (glassInventoryArr, glassProductItems, sizeItems, selectedItems) => {
   console.log(glassInventoryArr)

    const glassInventoryarr = [...glassInventoryArr]
    
    const header =  [
      {
         "columnName": "Glass Product",
         "type": "options",
         "colNo": 1,
         "width": 500,
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
            row.push({ key:'glass_product', value:`${obj['thickness']}mm ${obj['color']} ${obj['glass_type']} ${obj['glass_company']} - glass`, type:'options', width:500, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.length && obj.width){
            row.push({ key:'size', value:`${obj['length']} x ${obj['width']}`, type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.stock){
            row.push({ key:'stock', value: obj.stock, type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         console.log(row)

      if(row.length==3){
        rows.push(row) 
      }

    })
const rowWiseFunctions = [];
const groupFunctions = [];
const checkedRows = returnSelectedInventory(selectedItems, glassInventoryarr);
const funcOnRowCheak = (selectedrows) => selectRows(selectedrows, glassInventoryarr)

const name = 'InventoryItems'

const tableData = {name, groupFunctions, rowWiseFunctions, funcOnRowCheak,  header, rows, checkedRows}
console.log(tableData)
return tableData

}



const selectRows = (rows, glassInventoryarr) => {
    const selectedIdArr = rows.map((row)=>row[0].id)
    const selectedInventoryItems = glassInventoryarr.filter((item)=>selectedIdArr.includes(item.id))

    let newselectedItems = selectedInventoryItems.map((inventory) => {
        let wasAlreadySelected = value.filter((item)=>item.glass_inventory_id===inventory.id)?.length>0?true:false

        return {
            glass_inventory_id: inventory.id,
            quantity: wasAlreadySelected ? value.filter((item)=>item.glass_inventory_id===inventory.id)[0]?.quantity : 0

        }
    })

    onChange(newselectedItems)
}

const returnSelectedInventory = (selectedItems, glassInventoryarr) => {

    let selectedIdArr = selectedItems.map((item)=>item.glass_inventory_id)
    const selectedInventoyItems = glassInventoryarr.filter((inventory)=> selectedIdArr.includes(inventory.id))

    
    return selectedInventoyItems;
}




    useEffect(() => {
     setinitialData()
    },[])

    

    return (

       <div >
       
        { tableData && <Table  data={tableData} /> }
       </div>
      )
}

InventoryItems.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    glassInventoryArr: PropTypes.array.isRequired
    
};



export default InventoryItems;