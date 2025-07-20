import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';
import './textfield.css';


const Labelwithtextfieldlarge = ({register,errors,name,label,type,labelclassname,textfieldclassname,divclassname,placeholder}) => {

    console.log(errors)


  return (  
  <div
    className={divclassname}
    style={{gap:"2px"}}
  >
    {label.length>0 && <Label.Root className={labelclassname + " LabelRoot"} htmlFor={name}>{label}</Label.Root>}
    <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
    <input placeholder={placeholder} min={0}  className={textfieldclassname + " Input"} type={type} id={name} {...register(name, { required: true })} />
    {errors[name] && <div style={{marginTop:"2px"}}>{errors[name] && <div style={{color:"rgb(252 0 0)"}}>{errors[name].message}</div>}</div>}
    </div>
  </div>
  )

};

Labelwithtextfieldlarge.propTypes = {
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    labelclassname:PropTypes.string.isRequired,
    textfieldclassname:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    placeholder:PropTypes.string
}

export default Labelwithtextfieldlarge;