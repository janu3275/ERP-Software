import * as Label from '@radix-ui/react-label';
import PropTypes from 'prop-types';
import './textfield.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useState } from 'react';
import "./passwordField.css";



const LabelwithPasswordfield = ({ register,errors,name,label,labelclassname,textfieldclassname,divclassname,placeholder, rules, empty }) => {

    console.log(errors, rules)

    const [visibility, setvisibility] = useState(false)
  

  return (  
    <div>
  <div
    className={divclassname}
    style={{gap:"2px"}}
  >
    {label.length>0 && <Label.Root className={labelclassname + " LabelRoot"} htmlFor={name}>{label}</Label.Root>}
    <div style={{display:"flex", flexDirection:"column", gap:"5px", position:"relative"}}>
    <input placeholder={placeholder} min={0}  className={textfieldclassname + " Input"} type={visibility?"text":"password"} id={name} {...register(name, { required: true })} />
    {!visibility?
    <Icon
    onClick={()=>setvisibility(true)}
    icon="material-symbols:visibility-off"
    className='visibilityIcon' 
   />
   :
   <Icon
    onClick={() => setvisibility(false)}
    icon="ic:baseline-visibility"
    className='visibilityIcon'
   />

   }
    
    </div>

  </div>
  <div style={{display:"flex", flexDirection:"column", gap:"10px", marginTop:"10px" }}>
  {rules.map((obj, index) =>
    <div style={{display:"flex", gap:"5px", color:empty?"silver":obj.validation?"rgb(34 205 6)":"rgb(252 0 0)"}} key={index}>
   <Icon
    onClick={() => setvisibility(false)}
    icon={empty?"typcn:tick":obj.validation?"typcn:tick":"entypo:cross"}
    style={{
        minWidth:"20px",
        minHeight:"20px"
    }}
    
   />
   <div style={{color:empty?"silver":obj.validation?"rgb(55, 53, 47)":"rgb(252 0 0)"}}>{obj.rule}</div>
   </div>
  )}
  </div>
  {/* {errors[name] && <div style={{height:"1rem"}}><div style={{fontSize:"0.8rem", color:"red"}}>{errors[name].message}</div></div>} */}
  </div>
  )

};

LabelwithPasswordfield.propTypes = {
    name: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    direction: PropTypes.string.isRequired,
    errors:PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    labelclassname:PropTypes.string.isRequired,
    textfieldclassname:PropTypes.string.isRequired,
    divclassname:PropTypes.string.isRequired,
    placeholder:PropTypes.string,
    rules: PropTypes.array.isRequired,
    empty: PropTypes.bool
}

export default LabelwithPasswordfield;