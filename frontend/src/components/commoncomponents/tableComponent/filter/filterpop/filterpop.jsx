import {  useRef, useState } from 'react';
import './filterpop.css'; // Import CSS for Notion-like styling
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import FilterComponent from '../filterform/filtercomponent';
import PopoverDemo from '../../../../../assets/singlecomponents/popover/popover';

const Filterpop = ({ data, applyFilter, filterRef, isfilterActive }) => {
 const [openFilter, setOpenFilter] = useState(false) 
 
console.log(isfilterActive(filterRef.current))
return (
    
        <PopoverDemo
          Open={openFilter}
          setOpen={setOpenFilter}
          contentclass="filterContentclass"
          btnclass=""
          side="bottom"
          icon={
            
            <button className={isfilterActive(filterRef.current)?'primarybtndiv filterActive':"primarybtndiv"} style={{display:"flex", alignItems:"center", gap:"10px"}} >
            <Icon
              icon="heroicons-solid:filter"
              style={{
                width: "1rem",
                height: "1rem",
                color: "#7b7978b0",
                cursor: "pointer",
              }}
            />
            
            </button>
           
          }
        >
         
          <FilterComponent data={data} applyFilter={applyFilter}  filterRef={filterRef} />
         
         
        </PopoverDemo>
      
   
);

}

Filterpop.propTypes = {
  data : PropTypes.object,
  applyFilter: PropTypes.func,
  filterRef: PropTypes.any,
  isfilterActive: PropTypes.func
  };

export default Filterpop;
