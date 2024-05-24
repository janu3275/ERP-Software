import { useEffect,  useState } from "react";
import PropTypes from "prop-types";
import Table from "../../../../../../commoncomponents/tableComponent/table";





const AccessoryItems = ({ onChange, value, glassAccessoryArr, closeAccessoryItems }) => { 

  const [tableData, settableData] = useState(null);

   
  const setinitialData = async () => {
        
        getDataAndRefreshTable()
    }

    const getDataAndRefreshTable = async() => {

        const tableobj = convertDataForTable(glassAccessoryArr, value);
        settableData(tableobj)

    }

 

const convertDataForTable = ( glassAccessoryArr, selectedItems ) => { 

    const glassAccessoryarr = [...glassAccessoryArr]
    
    const header =  [
      {
         "columnName": "Glass Accessory",
         "type": "string",
         "colNo": 1,
         "width": 200,
         "sorted":null
      },
      {
        "columnName": "unit",
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
      
      glassAccessoryarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.name){
            row.push({ key:'glass_accessory', value:obj.name, type:'string', width:200, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.unit){
            row.push({ key:'unit', value:obj.unit, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
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
const checkedRows = returnSelectedAccessory(selectedItems, glassAccessoryarr);
const funcOnRowCheak = (selectedrows) => selectRows(selectedrows, glassAccessoryarr)

const name = 'AccessoryItems'

const tableData = {name, groupFunctions, rowWiseFunctions, funcOnRowCheak,  header, rows, checkedRows}
console.log(tableData)
return tableData

}



const selectRows = (rows, glassAccessoryarr) => {

    const selectedIdArr = rows.map((row)=>row[0].id)
    const selectedAccessoryItems = glassAccessoryarr.filter((item)=>selectedIdArr.includes(item.id))

    let newselectedItems = selectedAccessoryItems.map((accessory) => {
        let wasAlreadySelected = value.filter((item)=>item.glass_accessory_id===accessory.id)?.length>0?true:false

        return {
            glass_accessory_id: accessory.id,
            quantity: wasAlreadySelected ? value.filter((item)=>item.glass_accessory_id===accessory.id)[0]?.quantity : 0

        }
    })

    onChange(newselectedItems)
}

const returnSelectedAccessory = (selectedItems, glassAccessoryarr) => {

    let selectedIdArr = selectedItems.map((item)=>item.glass_accessory_id)
    const selectedAccessoryItems = glassAccessoryarr.filter((accessory)=> selectedIdArr.includes(accessory.id))

    
    return selectedAccessoryItems;
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

AccessoryItems.propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    glassAccessoryArr: PropTypes.array.isRequired
    
};



export default AccessoryItems;