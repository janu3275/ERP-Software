import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';
import './textarea.css';


const Labelwithtextarea = ({register,errors,name,defaultValue,label,direction,type,labelclassname,textfieldclassname,divclassname}) => {

    console.log(errors)


  return (  
  <div
   className={divclassname}
  >
    {label.length>0 && <Label.Root className={labelclassname + " LabelRoot"} htmlFor={name}>{label}</Label.Root>}
    <textarea className={textfieldclassname + " Textarea"}  type={type} id={name} {...register(name, { required: true })} defaultValue={defaultValue} />
    <div style={{height:"1rem"}}>{errors[name] && <div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div>}</div>
  </div>
  )

};

Labelwithtextarea.propTypes = {
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    defaultValue:PropTypes.any,
    labelclassname:PropTypes.string.isRequired,
    textfieldclassname:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired
}

export default Labelwithtextarea;