import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';
import './stextfield.css';


const Stextfield = ({name,label,onChange,value,type,labelclassname,textfieldclassname,divclassname,placeholder,index, disabled, error}) => {
console.log(name,error, value)

return (  

  <div
    className={divclassname}
  >
    {label.length>0 && <Label.Root className={"LabelRoot "+labelclassname} htmlFor={name}>{label}</Label.Root>}
    <div style={{display:"flex", flexDirection:"column"}}>
    <input  placeholder={placeholder} min={0}   disabled={disabled} className={"Input " + textfieldclassname} onChange={(e)=>onChange(e,name,index)} type={type} id={name} value={value} />
    <div style={{height:"1rem", display:!error && "none"}}>{error && <div style={{fontSize:"0.8rem", color:"red"}}>{error}</div>}</div>
    </div>
  </div>
  
  )

};

Stextfield.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    value:PropTypes.any,
    labelclassname:PropTypes.string.isRequired,
    textfieldclassname:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    placeholder:PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    index:PropTypes.number,
    disabled: PropTypes.bool.isRequired,
    error: PropTypes.any
}




export default Stextfield;