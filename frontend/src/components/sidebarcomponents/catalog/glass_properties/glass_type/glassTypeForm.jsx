import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassTypeform = ({createNewglassType, selectedglassType, UpdateglassType }) => {


 const schema = yup.object().shape({
  glass_type: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      glass_type:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedglassType){
       
        reset({
          glass_type: selectedglassType.glass_type
        })
    }
   
  },[selectedglassType, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassType?UpdateglassType({data, glassTypeid: selectedglassType.id}):createNewglassType(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="glass_type"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Glass Type"
            direction="row"
            type="text"
            placeholder="name"

          />
        
         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassType?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassTypeform.propTypes = {

 
  createNewglassType: PropTypes.func.isRequired,
  selectedglassType: PropTypes.object,
  UpdateglassType: PropTypes.func.isRequired

};




export default GlassTypeform;
