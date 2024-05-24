import PropTypes from "prop-types";
import "./actions.css"

const Actions = ({functs, row, closeActionpop})=>{
   

    return (
     <div className="action-container">
        {functs.map((func, index)=><button key={index} style={{width:"-webkit-fill-available", color:"rgb(82 78 70)", fontWeight:"400"}} className="primarybtndiv" onClick={()=>{
            func.funct(row)
            closeActionpop()
            }}> {func.icon} {func.funcName}</button>)}
     </div>
    )
}

Actions.propTypes = {
    functs: PropTypes.array,
    row: PropTypes.array,
    closeActionpop: PropTypes.func
};

export default Actions;
