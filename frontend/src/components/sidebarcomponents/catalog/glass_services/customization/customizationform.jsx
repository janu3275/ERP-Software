import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassCustomizationform = ({createNewglassCustomization, selectedglassCustomization, UpdateglassCustomization }) => {


 const schema = yup.object().shape({

    service_name: yup.string().required(),
    description: yup.string().required(),
    rate_per_sqft: yup.number().required()
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      service_name: "",
      description: "",
      rate_per_sqft: ""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {
    if(selectedglassCustomization){
       
        reset({
            service_name: selectedglassCustomization.service_name,
            description: selectedglassCustomization.description,
            rate_per_sqft: selectedglassCustomization.rate_per_sqft
        })
    }
   
  },[selectedglassCustomization, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassCustomization?UpdateglassCustomization({data, glassCustomizationid: selectedglassCustomization.id}):createNewglassCustomization(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="service_name"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Service name"
            direction="row"
            type="text"
            placeholder="name"

          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="description"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Description"
            direction="row"
            type="text"
            placeholder="type.."

          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="rate_per_sqft"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Rate per sqft"
            direction="row"
            type="number"
            placeholder=""

          />
        
        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassCustomization?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassCustomizationform.propTypes = {

  createNewglassCustomization: PropTypes.func.isRequired,
  selectedglassCustomization: PropTypes.object,
  UpdateglassCustomization: PropTypes.func.isRequired

};




export default GlassCustomizationform;
