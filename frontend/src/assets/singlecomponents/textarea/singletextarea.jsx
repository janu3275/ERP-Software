import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';



const SingleLabelwithtextarea = ({name,label,onChange,value,type,labelclassname,textfieldclassname,divclassname,placeholder,index, disabled, error}) => {

   


  return (  
  <div
   className={divclassname}
  >
    {label.length>0 && <Label.Root className={labelclassname + " LabelRoot"} htmlFor={name}>{label}</Label.Root>}
    <textarea disabled={disabled} placeholder={placeholder} className={textfieldclassname + " Textarea"}  type={type} id={name} onChange={(e)=>onChange(e,name,index)} value={value} />
    
  </div>
  )

};

SingleLabelwithtextarea.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    value:PropTypes.any,
    labelclassname:PropTypes.string.isRequired,
    textfieldclassname:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    placeholder:PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    index:PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    error: PropTypes.any
}

export default SingleLabelwithtextarea;