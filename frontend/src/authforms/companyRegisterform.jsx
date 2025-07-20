import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import LabelwithPasswordfield from '../assets/formcomponents/passwordField';
import Labelwithtextfieldlarge from '../assets/formcomponents/labelwithtextfieldlarge';





const CompanyRegisterform = ({registerCompany}) => {

  const schema = yup.object().shape({
    companyID: yup.string()
      .required('Company ID is required')
      .min(6, 'Company ID must be at least 6 characters long')
      .max(50, 'Company ID name must be at most 50 characters long')
      .matches(/^[a-zA-Z0-9]*$/, 'Company ID can only contain alphanumeric characters and no spaces'),
    Password: yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .matches(/^\S*$/, 'Password cannot contain spaces')
      .required('Password is required')
 
  });

  

  const { register, handleSubmit, formState, control, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        companyID:"",
        Password:""
   
    }

  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  const password = watch('Password');



  const rules = [
    {rule:'Must be at least 8 characters long', validation: password.length >= 8}, 
    {rule:'Must contain a lowercase letter, an uppercase letter, a number, and a special character', validation: /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[@$!%*?&]/.test(password)},
    {rule: 'Cannot contain spaces', validation: !/\s/.test(password)}
  ]
 


  return (
    
    <form onSubmit={handleSubmit(data=>registerCompany(data))}>
      <div style={{marginTop:"20px",  flexDirection: "column", display: "flex", gap:"20px"
       }}>

          <Labelwithtextfieldlarge
            register={register}
            errors={errors}
            name="companyID"
            labelclassname="custformlabel"
            textfieldclassname="logintextfield"
            divclassname="vertical"
            defaultValue=""
            label="Company ID"
            direction="row"
            type="text"
            placeholder="eg. kailash_Shop"
            
          />
          
          <LabelwithPasswordfield
            register={register}
            errors={errors}
            name="Password"
            labelclassname="custformlabel"
            textfieldclassname="logintextfield"
            divclassname="vertical"
            defaultValue=""
            label="Password"
            direction="row"
            type="password"
            placeholder=""
            rules={rules}
            empty={getValues('Password').length===0}

          />

     
          
       </div>
        <div style={{display:"flex",  marginTop:"20px"}}>
      <button style={{marginTop:"10px", width:"-webkit-fill-available", height:"22px", borderRadius:"4px"}} className='secondarybtn' type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        Register company
      </button>
      </div>
    </form>
  );
};


CompanyRegisterform.propTypes = {
registerCompany: PropTypes.func.isRequired,
};


export default CompanyRegisterform;
