import { useEffect,  useState } from "react";
import PropTypes from "prop-types";
import Table from "../../../../../../commoncomponents/tableComponent/table";





const OtherItems = ({ onChange, value, otherItemsArr, closeOtherItems }) => { 

  const [tableData, settableData] = useState(null);

  const setinitialData = async () => {
        getDataAndRefreshTable()
  }

    const getDataAndRefreshTable = async() => {

        const tableobj = convertDataForTable(otherItemsArr, value);
        settableData(tableobj);

    }

 

const convertDataForTable = ( otherItemsArr, selectedItems ) => { 

    const otherItemsarr = [...otherItemsArr]
    
    const header =  [
      {
         "columnName": "Other product",
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
      
      otherItemsarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.name){
            row.push({ key:'other_product', value:obj.name, type:'string', width:200, rowNo:index+1, colNo:1, id:obj.id })
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
const checkedRows = returnSelectedOther(selectedItems, otherItemsarr);
const funcOnRowCheak = (selectedrows) => selectRows(selectedrows, otherItemsarr)

const name = 'OtherItems'

const tableData = {name, groupFunctions, rowWiseFunctions, funcOnRowCheak,  header, rows, checkedRows}
console.log(tableData)
return tableData

}



const selectRows = (rows, otherItemsarr) => {

    const selectedIdArr = rows.map((row)=>row[0].id)
    const selectedOtherItems = otherItemsarr.filter((item)=>selectedIdArr.includes(item.id))

    let newselectedItems = selectedOtherItems.map((otheritem) => {
        let wasAlreadySelected = value.filter((item)=>item.other_products_id===otheritem.id)?.length>0?true:false

        return {
            other_products_id: otheritem.id,
            quantity: wasAlreadySelected ? value.filter((item)=>item.other_products_id===otheritem.id)[0]?.quantity : 0

        }
    })

    onChange(newselectedItems)
}

const returnSelectedOther = (selectedItems, otherItemsarr) => {

    let selectedIdArr = selectedItems.map((item)=>item.other_products_id)
    const selectedOtherItems = otherItemsarr.filter((otheritem)=> selectedIdArr.includes(otheritem.id))

    
    return selectedOtherItems;
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

OtherItems.propTypes = {

    onChange: PropTypes.func.isRequired,
    value: PropTypes.array.isRequired,
    otherItemsArr: PropTypes.array.isRequired
    
};



export default OtherItems;