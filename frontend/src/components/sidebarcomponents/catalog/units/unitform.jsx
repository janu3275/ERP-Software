import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';




const Unitform = ({createNewUnit, selectedunit, UpdateUnit }) => {



 const schema = yup.object().shape({
    unit: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      unit:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedunit){
    
        reset({
          unit: selectedunit.unit
        })
    }
   
  },[selectedunit, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedunit?UpdateUnit({unit:data.unit, unitid:selectedunit.id}):createNewUnit(data.unit))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="unit"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Unit"
            direction="row"
            type="text"
            placeholder="Unit name"

          />
        
         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedunit?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


Unitform.propTypes = {

 
  createNewUnit: PropTypes.func.isRequired,
  selectedunit: PropTypes.object,
  UpdateUnit: PropTypes.func.isRequired

};




export default Unitform;
