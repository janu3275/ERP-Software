import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassMeasurementform = ({createNewglassMeasurement, selectedglassMeasurement, UpdateglassMeasurement }) => {


 const schema = yup.object().shape({

    service_name: yup.string().required(),
    description: yup.string().required(),
    rate_per_hour_per_person: yup.number().required(),
    rate_per_km: yup.number().required()
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      service_name: "",
      description: "",
      rate_per_hour_per_person:"",
      rate_per_km: ""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {
    if(selectedglassMeasurement){
       
        reset({
            service_name: selectedglassMeasurement.service_name,
            description: selectedglassMeasurement.description,
            rate_per_hour_per_person: selectedglassMeasurement.rate_per_hour_per_person,
            rate_per_km: selectedglassMeasurement.rate_per_km
        })
    }
   
  },[selectedglassMeasurement, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassMeasurement?UpdateglassMeasurement({data, glassMeasurementid: selectedglassMeasurement.id}):createNewglassMeasurement(data))}>
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
            name="rate_per_hour_per_person"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Rate per hour per person"
            direction="row"
            type="number"
            placeholder=""

          />

            <Labelwithtextfield
            register={register}
            errors={errors}
            name="rate_per_km"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Rate per km"
            direction="row"
            type="number"
            placeholder=""

          />
        
        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassMeasurement?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassMeasurementform.propTypes = {

  createNewglassMeasurement: PropTypes.func.isRequired,
  selectedglassMeasurement: PropTypes.object,
  UpdateglassMeasurement: PropTypes.func.isRequired

};




export default GlassMeasurementform;
