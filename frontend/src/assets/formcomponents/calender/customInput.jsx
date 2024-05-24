import { format } from "date-fns";
import { forwardRef } from "react";

import { Icon } from "@iconify/react";

import PropTypes from "prop-types";

const CustomInput = forwardRef(
  ({ clearDate, onClick, disable,  value, ...rest }, ref) => (
    <button
   
    style={{minWidth:"8rem", width:"-webkit-fill-available"}} 
    className={"Input primarycalenderfieldclass"}
      aria-label="Update dimensions"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
     disabled={disable}
      // ref={ref}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "-webkit-fill-available",
        }}
      >
        <div>{value && format(value, "PPP")}</div>

        {value ? (
          <Icon
            icon="iwwa:delete"
            style={{
              width: "1rem",
              height: "1rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
            onClick={() => clearDate()}
          />
        ) : (
          <Icon
            icon="uil:calender"
            style={{
              width: "1rem",
              height: "1rem",
              color: "rgb(82 78 70)",
              cursor: "pointer",
            }}
          />
        )}
      </div>
    </button>
  )
);

CustomInput.displayName = "CustomInput";
CustomInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.any,
  onChange: PropTypes.func,
  clearDate: PropTypes.func.isRequired,
  disable: PropTypes.bool
};

export default CustomInput;
