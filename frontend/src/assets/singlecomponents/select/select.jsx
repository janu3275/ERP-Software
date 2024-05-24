import React, { Fragment } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import "./select.css";

export const SelectDemo = ({groups,label,divclassname, triggerclassname,labelclassname, placeholder, onChange, value, name,index, error}) => {

console.log(placeholder);

return (
 
  <div className={divclassname}>
   <Label.Root  className={labelclassname} htmlFor={name}>
      {label}
    </Label.Root>
  <div style={{display:"flex", flexDirection:"column"}} >
  <Select.Root name={name} defaultValue={value} value={value} onValueChange={(e)=>onChange(e,name,index)}>
    <Select.Trigger className={"SelectTrigger " + triggerclassname}  aria-label={label} >
       <Select.Value  placeholder={placeholder} aria-label={value}>
          {value}
        </Select.Value>
      <Select.Icon className="SelectIcon">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal className='SelectPortal'>
      <Select.Content  className="SelectContent" position="popper" sideOffset={5}>
        <Select.ScrollUpButton className="SelectScrollButton">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="SelectViewport">
     
        {groups.map((group, index) => (
          <Fragment key={index} >
          {index!==0&& <Select.Separator className="SelectSeparator" />}
          <Select.Group >
            <Select.Label className="SelectLabel">{group?.label}</Select.Label>
            {group?.items.map((item, indx) => (
              <SelectItem  key={indx} value={item.value} >
                {item.label}
              </SelectItem>
            ))}
          </Select.Group>
          </Fragment>
        ))}
         </Select.Viewport>
        <Select.ScrollDownButton className="SelectScrollButton">
         <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
  <div style={{height:"1rem" ,display:!error && "none"}}>{error && <div style={{fontSize:"0.8rem", color:"red"}}>{error}</div>}</div>
  </div>
  
  </div>
)};



SelectDemo.displayName = 'SelectDemo';

SelectDemo.propTypes = {
    groups: PropTypes.array.isRequired,
    placeholder:PropTypes.string.isRequired,
    errors:PropTypes.object,
    label:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    labelclassname:PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    name: PropTypes.string.isRequired,
    index: PropTypes.number,
    triggerclassname: PropTypes.string,
    error:PropTypes.any
  };

  

console.log("yes")
const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="SelectItemIndicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

console.log("yes")
SelectItem.displayName = 'SelectItem'
SelectItem.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.any
}










export default SelectDemo;