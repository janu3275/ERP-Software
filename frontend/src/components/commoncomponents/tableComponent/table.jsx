import { useEffect, useRef, useState } from 'react';
import './table.css'; // Import CSS for Notion-like styling
import PropTypes from "prop-types";
import Filterpop from './filter/filterpop/filterpop';
import { useFilterStore } from '../../../../strore/notificationStore';
import { Icon } from '@iconify/react';
import CheckboxDemo from '../../../assets/singlecomponents/checkbox/checkbox';
import Actionpop from './actions/actionpop';

const Table = ({ data }) => {
  console.log(data)
    const storeFilterData = useFilterStore(state => state[data.name]);
    const [resizingColumn, setResizingColumn] = useState(null);
    const [filteredAndSorteddata, setfilteredAndSorteddata] = useState(data);
    const [initialData, setinitialData] = useState(data);
    const [checkedRows, setcheckedRows] = useState([]);
    const initialWisthRef = useRef(null);
    const initialXRef = useRef(null);
    const filterRef = useRef([]); 

   
    // header - array of objects = object - {
    //    columnName, type - string, number, date, boolean, attachment/link, option  ,,colNo, width
    // }

    // rows - value , colNo, rowNo, type, width
    
  
    const handleDragStart = (e, columnIndex) => {

      setResizingColumn(columnIndex);
      const tableHeaderCell = document.querySelector(`.header-${filteredAndSorteddata.name}:nth-child(${columnIndex + 2})`);
      initialWisthRef.current = tableHeaderCell.clientWidth
      initialXRef.current = e.clientX

    };
  
    const handleDrag = (e) => {

      if (resizingColumn !== null) {
        const tableHeaderCell = document.querySelector(`.header-${filteredAndSorteddata.name}:nth-child(${resizingColumn + 2})`);
        console.log(tableHeaderCell)
        const tableRowCells = document.querySelectorAll(`.row-${filteredAndSorteddata.name}-${resizingColumn}`);

        const movementX = e.clientX - initialXRef.current;
        console.log(movementX, initialWisthRef.current)
        const newWidth = initialWisthRef.current + movementX -20;
        tableHeaderCell.style.width = `${newWidth}px`;
        tableRowCells.forEach(cell => {
            cell.style.width = `${newWidth}px`;
        });


       
      }

    };
  
    const handleDragEnd = (e) => {
        
        const movementX = e.clientX - initialXRef.current;
        const finalWidth = initialWisthRef.current + movementX -20;
        resetWidth(finalWidth, resizingColumn)
        setResizingColumn(null);
    };

    const resetWidth = (newwidth, colIndex) => { 
      let newheaders = [...filteredAndSorteddata.header]
      newheaders[colIndex].width = newwidth
      setfilteredAndSorteddata((prev) => {
        return {
          ...prev,
          header:newheaders
        }
      })
    }

    const isfilterActive = (filters) => {
      for (const filter of filters) {
        if (!filter) {
          continue;
        }
    
        const { colType, filterValue } = filter;
        if (colType === 'string') {
          if (filterValue.length > 0) {
            console.log("string active", filterValue);
            return true;
          }
        } else if (colType === 'number') {
          const { minValue, maxValue } = filterValue;
          if (minValue > 0 || maxValue > 0) {
            console.log("number active", minValue, maxValue);
            return true;
          }
        } else if (colType === 'boolean' || colType === 'options') {
          if (filterValue) {
            console.log("bool or option active", filterValue);
            return true;
          }
        } else if (colType === 'date') {
          const { minValue, maxValue } = filterValue;
          if (minValue || maxValue) {
            console.log("date active", minValue, maxValue);
            return true;
          }
        }
      }
      return false; // Return false only if none of the conditions are met
    };
    



  const returnFilterRows = (filters, rows) => {

       console.log(filters)

       if((!filters)|| (filters && filters.length === 0)){
          return rows
        }

        

        filters.map((filter) => {

         if(!filter){
          return 
         }

        const { colType, filterValue, colIndex } = filter
    
        if(colType === 'string' ){
           rows = rows.filter((row)=> row[colIndex].value.toLowerCase().includes(filterValue.toLowerCase()))
            
        }else if(colType === 'number'){

           const { minValue, maxValue } = filterValue

           if(minValue && maxValue){
            rows =  rows.filter((row)=> (row[colIndex].value >= parseFloat(minValue) && row[colIndex].value <= parseFloat(maxValue)))
           }else if(minValue && !maxValue){
            rows =  rows.filter((row)=> (row[colIndex].value >= parseFloat(minValue) ))
           }else if(!minValue && maxValue){
            rows =  rows.filter((row)=> ( row[colIndex].value <= parseFloat(maxValue)))
           }else{
            console.log(minValue, maxValue)
            return
           }
           
    
        }else if(colType === 'boolean'|| colType === 'options'){
           if(filterValue){
            console.log(filterValue)
            rows = rows.filter((row)=>row[colIndex].value===filterValue)
           }else{
            console.log(filterValue)
            return
           }
           

        }else if(colType === 'date'){

            const { minValue, maxValue } = filterValue
 
            if(minValue && maxValue){
             rows =  rows.filter((row)=> ( new Date(row[colIndex].value) >= new Date(minValue) && new Date(row[colIndex].value) <= new Date(maxValue) ))
            }else if(minValue && !maxValue){
             rows =  rows.filter((row)=> ( new Date(row[colIndex].value) >= new Date(minValue) ))
            }else if(!minValue && maxValue){
             rows =  rows.filter((row)=> ( new Date(row[colIndex].value) <= new Date(maxValue) ))
            }else{
             console.log(minValue, maxValue)
             return
            }
            
     
         }
    
      })

      console.log(rows)
      return rows

}

const returnSortedData = (col, rows) => {
  
  console.log(col)
      
  

  if(!col || !col.type || !col.colNo ){
    
  return rows

  }


  const { type, colNo , sorted } = col
  const colIndex = colNo-1
  if(type === 'string' ){

   sorted ? rows.sort((rowA, rowB) => {

      const valueA = rowA[colIndex]?.value;
      const valueB = rowB[colIndex]?.value;
      return valueB.localeCompare(valueA);

    }): rows.sort((rowA, rowB) => {

      const valueA = rowA[colIndex]?.value;
      const valueB = rowB[colIndex]?.value;
      return valueA.localeCompare(valueB);

  });

      
  }else if(type === 'number'){

   sorted ? rows.sort((rowA, rowB) => {
      const valueA = rowA[colIndex]?.value || 0; // Default to 0 if value is not found
      const valueB = rowB[colIndex]?.value || 0; // Default to 0 if value is not found
      return valueA - valueB; // Compare numbers directly

  }): rows.sort((rowA, rowB) => {
    const valueA = rowA[colIndex]?.value || 0; // Default to 0 if value is not found
    const valueB = rowB[colIndex]?.value || 0; // Default to 0 if value is not found
    return valueB - valueA; // Compare numbers directly

})
     

  }else if(type === 'date'){
   
    sorted ? rows.sort((rowA, rowB) => {
      const valueA = rowA[colIndex]?.value || ''; // Default to an empty string if value is not found
      const valueB = rowB[colIndex]?.value || ''; // Default to an empty string if value is not found
      
      // Parse stringified dates into Date objects for comparison
      const dateA = valueA ? new Date(valueA) : null;
      const dateB = valueB ? new Date(valueB) : null;
      
      if (dateA && dateB) {
          return dateA - dateB; // Compare dates directly
      } else if (dateA) {
          return -1; // dateA comes before dateB
      } else if (dateB) {
          return 1; // dateB comes before dateA
      } else {
          return 0; // Both dates are null or invalid, consider them equal
      }
  }): rows.sort((rowA, rowB) => {
    const valueA = rowA[colIndex]?.value || ''; // Default to an empty string if value is not found
    const valueB = rowB[colIndex]?.value || ''; // Default to an empty string if value is not found
    
    // Parse stringified dates into Date objects for comparison
    const dateA = valueA ? new Date(valueA) : null;
    const dateB = valueB ? new Date(valueB) : null;
    
    if (dateA && dateB) {
        return dateB - dateA; // Compare dates directly
    } else if (dateA) {
        return 1; // dateA comes before dateB
    } else if (dateB) {
        return -1; // dateB comes before dateA
    } else {
        return 0; // Both dates are null or invalid, consider them equal
    }
})

}



console.log("reached at the final of sorting", rows)
return rows


  
}

const sort = (col) => {
  let filteredrows = [...filteredAndSorteddata.rows];
  let filteredheaders = [...filteredAndSorteddata.header];
  const rows = returnSortedData(col, filteredrows);


let headers = filteredheaders.map((header)=>{
  if(header.colNo===col.colNo){
    return {
      ...header,
      sorted: header.sorted===null?true:!header.sorted
    }
  }else{
    return  {
      ...header,
      sorted: null
    }
  }
})

  setfilteredAndSorteddata((prev) => ({
  ...prev,
  header:headers,
  rows: rows

}))
}



const applyFilter = (filters) => {


 // whenever filter is applied , sorting is also applied after filter , if their is any 

  const Initialrows = [...data.rows];
  const Filteredheaders = [...data.header];   // headers are taken from filtered data as updated width and sorted values will be here only
  const Filteredrows = returnFilterRows(filters, Initialrows);
  const ColToBeSorted = Filteredheaders.filter((header)=>(header.sorted!==null))[0] || null
  const FilteredAndSortedRows = returnSortedData(ColToBeSorted, Filteredrows)
  console.log(FilteredAndSortedRows)
  
  setfilteredAndSorteddata((prev)=> ({
            ...prev,
            rowWiseFunctions:data.rowWiseFunctions,
            groupFunctions:data.groupFunctions,
            rows: FilteredAndSortedRows,
            
            
         }))

    setinitialData(data)
  
}



useEffect(() => {
  
//  applyFilter(storeFilterData) COMMENTED OUT BECAUSE , IT WAS FOR CLIENT SIDE FILTERING , NOW WE WILL ENABLE SERVER SIDE FILTERING
 if(storeFilterData){
  filterRef.current = storeFilterData
 }else{
  filterRef.current = []
 }
 setinitialData(data)
 setfilteredAndSorteddata(data)

 if(!data.serverSideFiltering){
  applyFilter(storeFilterData)
}
 
 },[data])

const updateInitialCheckForRows = () => {    // this function check all the selected rows at the first render
  const selctedIdArr = filteredAndSorteddata.checkedRows.map((item)=>item.id)
  const selectedRows = filteredAndSorteddata.rows.filter((row)=>selctedIdArr.includes(row[0].id))
  const rowIndexArr = selectedRows.map((row)=>row[0].rowNo - 1)
  setcheckedRows(rowIndexArr)
}

useEffect(() => {
  if(data?.checkedRows && data?.checkedRows.length>0){
    updateInitialCheckForRows()
  }
},[])


const checkRow = (index) => {
  let temprows = [...checkedRows];
 if(!checkedRows.includes(index)){
  temprows.push(index)
 }else{
  temprows = temprows.filter((val)=>val!==index)
 }
 console.log(temprows)
 setcheckedRows(temprows)


if(filteredAndSorteddata.funcOnRowCheak){
  filteredAndSorteddata.funcOnRowCheak(getRowsFromCheckedRows(temprows))   // this function is executed whenever a row is checked
}        

}

const checkAllRows = (e) => {
console.log(e)
const rowIndexArr =  filteredAndSorteddata.rows.map((row)=>row[0].rowNo - 1)
const allselected = rowIndexArr.every((element) => checkedRows.includes(element));
let temprows = [...checkedRows];
if(allselected){
  temprows = temprows.filter((index)=>!rowIndexArr.includes(index))
}else{
  rowIndexArr.forEach((index)=>!temprows.includes(index) && temprows.push(index))
}

setcheckedRows(temprows)

if(filteredAndSorteddata.funcOnRowCheak){
  filteredAndSorteddata.funcOnRowCheak(getRowsFromCheckedRows(temprows))   // this function is executed whenever a row is checked
}

}

const checkAllSelected = () => {

  if(filteredAndSorteddata.rows.length===0){
    return false
  }
  const rowIndexArr =  filteredAndSorteddata.rows.map((row)=>row[0].rowNo - 1)
  const allselected = rowIndexArr.every((element) => checkedRows.includes(element));
  return allselected

}

const checkSingleSelected = (index) => {

  
  return  checkedRows.includes(index)

}

const getRowsFromCheckedRows = (checkedRows) => {

  const totalrows = [...initialData.rows]
  const currentRowIndexArr = filteredAndSorteddata.rows.map((row)=>row[0].rowNo - 1)
  let rows = []
  checkedRows.forEach((rowIndex)=> currentRowIndexArr.includes(rowIndex) && rows.push(totalrows[rowIndex]))
  console.log(rows)
  return rows

}

console.log(filteredAndSorteddata, checkedRows, initialData, storeFilterData)

  return (

   <div className="resizable-table" >
    <div className='table-upper-panel'>
        {getRowsFromCheckedRows(checkedRows).length>0 ? <div className='table-common-functions'>
          <>{getRowsFromCheckedRows(checkedRows).length} rows selected</>
          {filteredAndSorteddata.groupFunctions.map((func, index)=> 
          <button key={index} className={func?.groupClassName?`primarybtndiv ${func?.groupClassName}`:"primarybtndiv"} disabled={checkedRows.length===0}   onClick={()=>func.funct(getRowsFromCheckedRows(checkedRows))} >
          
          {func.icon}
          {func.funcName}
       
          </button>
             )}

        </div>:<div></div>}
        
        
        <Filterpop data={initialData} applyFilter={applyFilter} filterRef={filterRef} isfilterActive={isfilterActive} />
        
    </div>
  
   
   <div className="table-container" ref={data.tableRef} style={data.tableContainerStyle}>
   <div className='header-container'>
   <div className='table-header-row'>
    <div className='table-checkbox' >
   <CheckboxDemo value={checkAllSelected()} onChange={checkAllRows} />
   </div>
   { filteredAndSorteddata.header.map((header, index) => 
   <div key={index} className={`table-header-cell header-${filteredAndSorteddata.name}`}  style={{width:`${header.width}px`, borderRight:(index===filteredAndSorteddata.header.length-1) && 0}} >
    <div className='header-content-box' onClick={()=> !['options','attachment/link'].includes(header.type) && sort(header)}>
    <div className='header-content'  >
   {header.columnName}
   </div>
   <div>
   {(header.sorted !== null) && (header.sorted ? <Icon
                      icon="gg:arrow-up"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        color: "#3f3f3f",
                        cursor: "pointer",
                      }}
                    />:
                      <Icon
                      icon="gg:arrow-down"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        color: "#3f3f3f",
                        cursor: "pointer",
                      }}
                    />)}
   </div>
   </div>
   {index!==filteredAndSorteddata.header.length-1 && <div className='resizable-handle'
   onMouseDown={(e) => handleDragStart(e, index)}
   ></div>}
    </div>)}
   {filteredAndSorteddata.rowWiseFunctions.length>0 && <div className='action-header-cell ' > Actions <div style={{left:"-4px"}} className='resizable-handle'
   onMouseDown={(e) => handleDragStart(e, filteredAndSorteddata.header.length-1)}
   ></div>
   </div>}
   </div>
  
   </div>
   
   {/* <div className='outer-row-container'> */}
   <div className='row-container'>
   {filteredAndSorteddata.rows.map((row, index)=>
    <div onClick={()=>data?.onrowclick? data?.onrowclick(row): console.log("row clicked")} key={index} className='table-row' >
    <div className='table-checkbox'>
    <CheckboxDemo onChange={()=>checkRow(row[0].rowNo -1)} value={checkSingleSelected(row[0].rowNo-1)} />
    </div>
   { row.map((cell, i) => 
   <div key={i}  className={`table-row-cell row-${filteredAndSorteddata.name}-${i}`} style={{width:`${filteredAndSorteddata.header[i].width}px`, borderRight:(i===row.length-1) && 0 }} >
   {cell.type==="options"?cell?.ele || cell.value:cell.value}
    </div>)}
   {filteredAndSorteddata.rowWiseFunctions.length>0 && <div className='action-row-cell ' >
    <Actionpop functs={filteredAndSorteddata.rowWiseFunctions} row={row} />
    </div>}
   </div>)}
   </div>
   {/* <div className='footer-container'></div> */}
   {/* </div> */}
    </div>

    {resizingColumn !== null && (
      <div
        className="resizable-overlay"
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
      />
    )}

  </div>
);

}

Table.propTypes = {
    data: PropTypes.object,
    name: PropTypes.string
  };

export default Table;
