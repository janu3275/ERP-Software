import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassDileveryform = ({createNewglassDilevery, selectedglassDilevery, UpdateglassDilevery }) => {


 const schema = yup.object().shape({

    service_name: yup.string().required(),
    description: yup.string().required(),
    vehicle_type: yup.string().required(),
    rate_per_km: yup.number().required()
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      service_name: "",
      description: "",
      vehicle_type:"",
      rate_per_km: ""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {
    if(selectedglassDilevery){
       
        reset({
            service_name: selectedglassDilevery.service_name,
            description: selectedglassDilevery.description,
            vehicle_type: selectedglassDilevery.vehicle_type,
            rate_per_km: selectedglassDilevery.rate_per_km
        })
    }
   
  },[selectedglassDilevery, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassDilevery?UpdateglassDilevery({data, glassDileveryid: selectedglassDilevery.id}):createNewglassDilevery(data))}>
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
            name="vehicle_type"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Vehichle type"
            direction="row"
            type="text"
            placeholder="type.."

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
        {selectedglassDilevery?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassDileveryform.propTypes = {

  createNewglassDilevery: PropTypes.func.isRequired,
  selectedglassDilevery: PropTypes.object,
  UpdateglassDilevery: PropTypes.func.isRequired

};




export default GlassDileveryform;
