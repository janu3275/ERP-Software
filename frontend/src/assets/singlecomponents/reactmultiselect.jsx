import ReactSelect from "react-select";
import PropTypes from 'prop-types';

const Multiselect = ({onChange, options})=>{
   return (
    <ReactSelect
    closeMenuOnSelect={false}
    placeholder="Add Approvers"
    isSearchable
    isClearable
    defaultValue=""
    onChange={(e) =>console.log(e) }
    options={options}
    value=""
    styles={{
      control: (baseStyles, state) => ({
        ...baseStyles,
        border: "0px",
        cursor: "pointer",
        fontFamily: "font-family: 'DM Sans', sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        borderRadius: "5px",
        boxShadow: "#828282c7 0px 0px 0px 1px",
        height: "35px ",
        // opacity:"0",
        minHeight: "none",
        // width: "0px",
        color: "#B1B1B1",
        backgroundColor: "#FAFAFA"
        // "&:hover": {
        //   outline: "solid 2px #5428877c",
        //   border: "solid 0px #B1B1B1",
        //   boxShadow: "0px",
        // },
        // outline:
        //   state.isFocused || state.menuIsOpen
        //     ? "solid 2px #5428877c"
        //     : "0px",
      }),

      placeholder: (baseStyles, state) => ({
        ...baseStyles,
        color: "#828282",
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "'DM Sans', sans-serif",
      }),
      singleValue: (baseStyles, state) => ({
        ...baseStyles,
        color: "#171717",
        fontSize: "16px",
        fontFamily: "'DM Sans', sans-serif",
      }),
      container: (baseStyles, state) => ({
        ...baseStyles,
        // width: "200px",
        height: "35px",
       
        borderRadius: "5px",
        // boxShadow:"rgba(0, 0, 0, 0.16) 0px 1px 4px",
       
      }),
      menu: (baseStyles, state) => ({
        ...baseStyles,
        paddingLeft:"5px",
       
      }),
      valueContainer: (baseStyles, state) => ({
        ...baseStyles,
        height: "35px",
       
      }),
      indicatorsContainer: (baseStyles, state) => ({
        ...baseStyles,
        height: "35px",
      
      }),
      input: (baseStyles, state) => ({
        ...baseStyles,
        padding: "0",
        gridArea: "none",
        display: "none"
      }),
      option:(baseStyles, state) => ({
        ...baseStyles,
        paddingLeft: "30px",
        backgroundColor:state.isFocused&&"#542287",
        color:state.isFocused&&"white",
        borderRadius:"5px",
        cursor:"pointer",
        height:"25px",
        alignItems:"center",
        display:"flex"
      })
    }}
  />
   )
}
Multiselect.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    
  };


export default Multiselect;