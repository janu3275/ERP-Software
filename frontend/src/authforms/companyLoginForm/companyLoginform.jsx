import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import "./companyloginform.css";
import PropTypes from "prop-types";
import Labelwithtextfieldlarge from '../../assets/formcomponents/labelwithtextfieldlarge';
import LabelwithPasswordfield from '../../assets/formcomponents/passwordField';





const CompanyLoginform = ({ loginCompany }) => {

  const schema = yup.object().shape({

    companyID: yup.string().required('Company ID is required'),
    Password: yup.string().required('Password is required')
 
  });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        companyID:"",
        Password:""
    }

  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  const rules = []
 

  return (
    
    <form onSubmit={handleSubmit(data=>loginCompany(data))}>
       <div style={{marginTop:"20px",  flexDirection: "column", display: "flex", gap:"20px" }}>

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
            empty={false}

          />
          
       </div>
        <div style={{display:"flex",  marginTop:"20px"}}>
      <button style={{marginTop:"10px", width:"-webkit-fill-available", height:"22px", borderRadius:"4px"}} className='secondarybtn' type="submit" disabled={!isDirty || !isValid || isSubmitting}>
       Company login
      </button>
      </div>
    </form>
  );
};


CompanyLoginform.propTypes = {
loginCompany: PropTypes.func.isRequired
};


export default CompanyLoginform;
