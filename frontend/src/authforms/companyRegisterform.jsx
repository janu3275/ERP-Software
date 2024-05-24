import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import Labelwithtextfield from '../assets/formcomponents/textfield';





const CompanyRegisterform = ({registerCompany}) => {

    const schema = yup.object().shape({
        companyName: yup.string().required('Company name is required'),
        gstNumber: yup.string().test('is-valid-gst', 'Invalid GST number', (value) => {
          // GST number regex pattern
          const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
          
          // Check if the value matches the pattern
          return gstPattern.test(value);
        }).required('GST number is required'),
      });

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        companyName:"",
        gstNumber:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

 


  return (
    
    <form onSubmit={handleSubmit(data=>registerCompany(data))}>
      <div style={{marginTop:"100px",  flexDirection: "column", display: "flex" }}>

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="companyName"
            labelclassname="custformlabel"
            textfieldclassname="logintextfield"
            divclassname="vertical"
            defaultValue=""
            label="Company Name"
            direction="row"
            type="text"
            placeholder="Name of the company"
          />


                

           <Labelwithtextfield
            register={register}
            errors={errors}
            name="gstNumber"
            labelclassname="custformlabel"
            textfieldclassname="logintextfield"
            divclassname="vertical"
            defaultValue=""
            label="GST Number"
            direction="row"
            type="text"
            placeholder="GST number of your company"
          />
          
       </div>
        <div style={{display:"flex",  marginTop:"10px"}}>
      <button style={{marginTop:"10px"}} className='oksecondarybtn' type="submit" disabled={!isDirty || !isValid || isSubmitting}>
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
