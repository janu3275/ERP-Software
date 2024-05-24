import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassColorform = ({createNewglassColor, selectedglassColor, UpdateglassColor }) => {


 const schema = yup.object().shape({
    glassColor: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      glassColor:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedglassColor){
       
        reset({
          glassColor: selectedglassColor.color
        })
    }
   
  },[selectedglassColor, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassColor?UpdateglassColor({glassColor:data.glassColor, glassColorid: selectedglassColor.id}):createNewglassColor(data.glassColor))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="glassColor"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Glass color"
            direction="row"
            type="text"
            placeholder="name"

          />
        
         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassColor?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassColorform.propTypes = {

 
  createNewglassColor: PropTypes.func.isRequired,
  selectedglassColor: PropTypes.object,
  UpdateglassColor: PropTypes.func.isRequired

};




export default GlassColorform;
