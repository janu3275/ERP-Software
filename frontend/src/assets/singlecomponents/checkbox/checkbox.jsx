import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import "./checkbox.css";

const CheckboxDemo = ({ onChange, value, rootclass}) => {

 console.log(value)
 return ( 
 
 <Checkbox.Root   className={rootclass?`CheckboxRoot ${rootclass}`:"CheckboxRoot"} checked={value}  onCheckedChange={onChange} id="c1">
    <Checkbox.Indicator className="CheckboxIndicator">
      <CheckIcon />
    </Checkbox.Indicator>
  </Checkbox.Root>
  
  )



};

CheckboxDemo.propTypes = {
  
    value:PropTypes.bool.isRequired,
    onChange:PropTypes.func.isRequired,
    rootclass: PropTypes.string
  };




export default CheckboxDemo;