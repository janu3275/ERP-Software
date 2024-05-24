import React, { Fragment, forwardRef } from 'react';
import * as Select from '@radix-ui/react-select';
import * as Label from '@radix-ui/react-label';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';
import "./select.css";

export const SingleSelectDemo = forwardRef(({groups,label,divclassname, triggerclassname, labelclassname, disabled, placeholder,errors, ...rest}, forwardedRef) => {

  let {value, onChange,name, ...props} = {...rest};

console.log(value,errors, {...props}, groups)
console.log(forwardedRef,"ll",  disabled);
return (
  <div style={{display:"flex", flexDirection:"column", gap:"5px"}} >
    <div className={divclassname}>
   <Label.Root className={labelclassname} htmlFor={name}>
      {label}
    </Label.Root>
  <Select.Root defaultValue={value} value={value} name={name} disabled={disabled}  onValueChange={onChange} {...props} >
    <Select.Trigger className={"SelectTrigger" }  ref={forwardedRef} aria-label={label} >
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
          <Fragment key={index}>
          {index!==0&& <Select.Separator className="SelectSeparator" />}
          <Select.Group >
            <Select.Label className="SelectLabel">{group?.label}</Select.Label>
            {group?.items.map((item, indx) => (
              <SelectItem key={indx} value={item.value}>
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
  </div>
  <div style={{height:"1rem", display:"flex", justifyContent:"end", padding:"0px 20px"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
  </div>
)});



SingleSelectDemo.displayName = 'SingleSelectDemo';

SingleSelectDemo.propTypes = {
    groups: PropTypes.array.isRequired,
    placeholder:PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    label:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    disabled: PropTypes.any,
    triggerclassname: PropTypes.string,
    labelclassname: PropTypes.string
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
    className: PropTypes.any,
    
}










export default SingleSelectDemo;