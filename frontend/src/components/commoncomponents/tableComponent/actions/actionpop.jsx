import {  useState } from 'react';
import PropTypes from "prop-types";
import { Icon } from '@iconify/react';
import Actions from './actions';
import PopoverDemo from '../../../../assets/singlecomponents/popover/popover';
import "./actionpop.css"

const Actionpop = ({ functs, row }) => {
const [openActionpop, setOpenActionpop] = useState(false); 

let closeActionpop =  ()=>{
  setOpenActionpop(false)
}

 

return (
    
        <PopoverDemo
          Open={openActionpop}
          setOpen={setOpenActionpop}
          contentclass="action-pop-content"
          btnclass=""
          side="bottom"
          icon={
            // <button className={"primarybtn"} aria-label="Update dimensions"  style={{paddingBottom:0}}>
            <button className='primarybtndiv' style={{padding:"2px 10px"}}>
            <Icon
              icon="simple-line-icons:options"
              style={{
                width: "1rem",
                height: "1rem",
                color: "#7b7978b0",
                cursor: "pointer"
              }}
            />
           
            </button>
           
          }
        >
         
          <Actions functs={functs} closeActionpop={closeActionpop} row={row} />
         
         
        </PopoverDemo>
      
   
);

}

Actionpop.propTypes = {
  functs : PropTypes.array,
  row: PropTypes.array
  };

export default Actionpop;
