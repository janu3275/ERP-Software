import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';






const EmiTypeform = ({createNewEmiType, selectedEmiType, UpdateEmiType }) => {


 const schema = yup.object().shape({
    purpose: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        purpose:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {
    if(selectedEmiType){
       
        reset({
            purpose: selectedEmiType.purpose
        })
    }
   
  },[selectedEmiType, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedEmiType?UpdateEmiType({data, EmiTypeid: selectedEmiType.id}):createNewEmiType(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="purpose"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Reason"
            direction="row"
            type="text"
            placeholder="name"
           />

      </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedEmiType?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


EmiTypeform.propTypes = {

  createNewEmiType: PropTypes.func.isRequired,
  selectedEmiType: PropTypes.object,
  UpdateEmiType: PropTypes.func.isRequired

};




export default EmiTypeform;
