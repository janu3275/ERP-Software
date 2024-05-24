import * as Checkbox from "@radix-ui/react-checkbox";
import { styled } from "@stitches/react";
import { violet, blackA } from "@radix-ui/colors";
import { CheckIcon } from "@radix-ui/react-icons";
import PropTypes from "prop-types";
import { forwardRef } from "react";
import { memo } from "react";

const Singlecheckbox = forwardRef(({ label,value,handleSelectAll,handleCheckboxChange }, forwardedRef) => {
    // let { onChange, name, ...props } = { ...rest };
    // console.log(forwardedRef, { ...rest }, value,label);
    console.log(label)
    return (
      <>
        <Flex css={{ alignItems: "center", height:"fit-content" }}>
          <CheckboxRoot
            name={label}
            value={label}
            onCheckedChange={(e) => {
                console.log(e,label)
            if(label==="Select All"){
                console.log("here")
                handleSelectAll(e)
            }else{
              console.log("here")
             handleCheckboxChange(e,label)
            }
              
            }}
            checked={value}
            
            id={label}
          >
            <CheckboxIndicator>
              <CheckIcon />
            </CheckboxIndicator>
          </CheckboxRoot>
          <Label css={{ paddingLeft: 15 }} htmlFor={label}>
            {label}
          </Label>
        </Flex>
       
      </>
    );
  }
);

const MemoSinglecheckbox = memo(Singlecheckbox, (prevProps, nextProps) => {
    // Custom equality check logic...
    // Compare specific prop values to determine if they should be considered equal
  
    // Example: Only re-render if the 'title' prop changes
    return prevProps.value === nextProps.value;
  });



//In normal scenarios  <CheckboxRoot ref={forwardedRef} name={name} checked={value} onCheckedChange=(onChange) {...props}  id={name}>

Singlecheckbox.displayName = "CheckboxDemo";
Singlecheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array,
  handleSelectAll:PropTypes.func,
  handleCheckboxChange:PropTypes.func
};

const CheckboxRoot = styled(Checkbox.Root, {
  all: "unset",
  backgroundColor: "white",
  width: 25,
  height: 25,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: violet.violet3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
  cursor: "pointer",
});

const CheckboxIndicator = styled(Checkbox.Indicator, {
  color: violet.violet11,
});

const Label = styled("label", {
  color: "violet.violet11",
  fontSize: 15,
  lineHeight: 1,
});

const Flex = styled("div", { display: "flex" });

export default MemoSinglecheckbox;
