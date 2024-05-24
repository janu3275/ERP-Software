import './filtercomponent.css'; // Import CSS for Notion-like styling
import PropTypes from "prop-types";
import Stextfield from '../../../../../assets/singlecomponents/singletextfield/stextfield';
import Calendar from '../../../../../assets/singlecomponents/calender/calender';
import { useFilterStore } from '../../../../../../strore/notificationStore';
import SelectDemo from '../../../../../assets/singlecomponents/select/select';
import { useEffect } from 'react';
import { useState } from 'react';



const FilterComponent = ({ data, applyFilter, filterRef }) => {
  
const setFilterData = useFilterStore(state=>state.setFilterData);
const [filterdata, setFilterdata] = useState(filterRef.current); // This state is just so that filter component render , when value is put

 const returnSelectedLabel = (options, value) => {

  if(!options){
    console.log(options)
    return 'No filter'
  }
  return options.filter((option)=>(option.value===value))[0]?.label || 'No filter'

 }

 const clearAllFilters = (e) => {

  e.preventDefault()
  filterRef.current = []
  setFilterdata([])
  setFilterData(data.name, [])
  if(!data.serverSideFiltering){
    applyFilter([])
  }
  // applyFilter([])

 }

 const triggerApplyFilter = (e) => {
  e.preventDefault()
  setFilterData(data.name, filterRef.current)
 
  if(!data.serverSideFiltering){
    applyFilter(filterRef.current)
  }
  
  
 }
 
console.log(data, filterRef)


return (
  <div>
    <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"20px"}}>
        
    {data.header.map((col, index) => {
        if(col.type === 'string'){

          return ( 

        <Stextfield
            key={index}
            name='filterValue'
            label={col.columnName}
            value={filterRef.current[index]?.filterValue || ""}
            type="text"
            labelclassname="filter-label-div"
            textfieldclassname="primarytextfieldclass"
            divclassname="filter-outer-div"
            placeholder="type.. "
            onChange={(e) => {
             console.log(e.target.value)
             let Stringfilter = {filterValue: e.target.value, colType:col.type ,  colIndex: index  }
             filterRef.current[index] = Stringfilter
             setFilterdata(prevState => ({
              ...prevState,
              [index]: { filterValue: e.target.value, colType: col.type, colIndex: index }
            }));
            //  applyFilter(filterRef.current)
            //  setFilterData(data.name, filterRef.current)
            }}
            disabled={false}

          /> )

        }else if(col.type === 'number'){

            return ( 
                <div key={index} style={{display:"flex", alignItems:"center", gap:"15px" }}>
                 <div className='filter-label-div'>{col.columnName}</div>
                 <div style={{display:"flex", alignItems:"center", gap:"15px" }} >

                <Stextfield
                    
                    name='filterValue'
                    label=''
                    value={filterRef.current[index]?.filterValue?.minValue || ""}
                    type="number"
                    labelclassname=""
                    textfieldclassname="primarytextfieldclass"
                    divclassname="filter-outer-div"
                    placeholder="Min value"
                    onChange={(e) => {
                       
                        let InitialMaxValue = filterRef.current[index]?.filterValue.maxValue || undefined
                        let Numberfilter = {filterValue: {minValue:e.target.value, maxValue: InitialMaxValue}, colType:col.type ,  colIndex: index  }
                        filterRef.current[index] = Numberfilter
                        setFilterdata(prevState => ({
                          ...prevState,
                          [index]: {filterValue: {minValue:e.target.value, maxValue: InitialMaxValue}, colType:col.type ,  colIndex: index  }
                        }));
                        // applyFilter(filterRef.current)
                        // setFilterData(data.name, filterRef.current)
                    }}
                    disabled={false}
                  /> 
                  
                  <Stextfield
                    
                    name='filterValue'
                    label=''
                    value={ filterRef.current[index]?.filterValue?.maxValue || "" }
                    type="number"
                    labelclassname=""
                    textfieldclassname="primarytextfieldclass"
                    divclassname="filter-outer-div"
                    placeholder="Max value "
                    onChange={(e) => {
                      
                     let InitialMinValue = filterRef.current[index]?.filterValue.minValue || undefined
                     let Numberfilter = {filterValue: {minValue:InitialMinValue, maxValue: e.target.value}, colType:col.type ,  colIndex: index  }
                     filterRef.current[index] = Numberfilter
                     setFilterdata(prevState => ({
                      ...prevState,
                      [index]: {filterValue: {minValue:InitialMinValue, maxValue: e.target.value}, colType:col.type ,  colIndex: index  }
                    }));
                    //  applyFilter(filterRef.current)
                    //  setFilterData(data.name, filterRef.current)
                    }}
                    disabled={false}
                  />


                  </div>

                  </div>
                  )

        }else if(col.type === 'date'){
            return (
        <div key={index} style={{display:"flex", alignItems:"center", gap:"15px"}}>
          <div className='filter-label-div'>
            {col.columnName}
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"10px", color:"rgb(82 78 70)"}}>
            <Calendar
             disable={false}
             onDateSelect={(date) => {
                let InitialMaxValue = filterRef.current[index]?.filterValue.maxValue || undefined
                let Datefilter = {filterValue: {minValue: date, maxValue:InitialMaxValue}, colType:col.type ,  colIndex: index  }
                filterRef.current[index] = Datefilter
                setFilterdata(prevState => ({
                  ...prevState,
                  [index]: {filterValue: {minValue: date, maxValue:InitialMaxValue}, colType:col.type ,  colIndex: index  }
                }));
                // applyFilter(filterRef.current)
                // setFilterData(data.name, filterRef.current)
            }}

            date = { filterRef.current[index]?.filterValue?.minValue || null }
             
             
             />
            
               <>to</>
              <Calendar
             
             onDateSelect = {(date) => {
                let InitialMinValue = filterRef.current[index]?.filterValue.minValue || undefined
                let Datefilter = { filterValue: {minValue:InitialMinValue, maxValue: date}, colType:col.type ,  colIndex: index  }
                filterRef.current[index] = Datefilter
                setFilterdata(prevState => ({
                  ...prevState,
                  [index]: { filterValue: { minValue:InitialMinValue, maxValue: date }, colType:col.type ,  colIndex: index  }
                }));
                // applyFilter(filterRef.current)
                // setFilterData(data.name, filterRef.current)

             }}
             
             date = {filterRef.current[index]?.filterValue?.maxValue || null}
             
             />
            </div>
        </div>
            )
        } else if(col.type === 'options'){
            return ( 
            <SelectDemo
              key={index}
              placeholder="Choose.."
              divclassname="filter-outer-div"
              triggerclassname=""
              labelclassname="filter-label-div"
              groups={col.options}
              label={col.columnName}
              onChange={(e) => {
               
                console.log(e)
                let optionFilter = {filterValue: e , colType:col.type ,  colIndex: index  }
                filterRef.current[index] = optionFilter
                setFilterdata(prevState => ({
                  ...prevState,
                  [index]: {filterValue: e , colType:col.type ,  colIndex: index  }
                }));
                // applyFilter(filterRef.current)
                // setFilterData(data.name, filterRef.current)   
                
              }
              }
              value={returnSelectedLabel(col?.options[0]?.items,(filterRef.current[index]?.filterValue || null)) }
              name=""
            />)
        }
    })}

   

    </div>
    <div className='filterbottomdiv'>
    <button className='secondarybtn' style={{width:"-webkit-fill-available"}}  onClick={triggerApplyFilter}>Apply filters</button>
    <button className='tertiarybtn' style={{width:"-webkit-fill-available"}}  onClick={clearAllFilters}>Clear all filters</button>
    </div>

  </div>
  )

}

FilterComponent.propTypes = {
   data : PropTypes.object,
   applyFilter: PropTypes.func,
   filterRef: PropTypes.any
  };

export default FilterComponent;
