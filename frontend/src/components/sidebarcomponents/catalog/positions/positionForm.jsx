import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';






const Positionform = ({createNewPosition, selectedPosition, UpdatePosition }) => {


 const schema = yup.object().shape({
    Position: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      Position:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedPosition){
       
        reset({
          Position: selectedPosition.position_name
        })
    }
   
  },[selectedPosition, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedPosition?UpdatePosition({data, Positionid: selectedPosition.id}):createNewPosition(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="Position"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Position"
            direction="row"
            type="text"
            placeholder="name"
           />

      </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedPosition?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


Positionform.propTypes = {

  createNewPosition: PropTypes.func.isRequired,
  selectedPosition: PropTypes.object,
  UpdatePosition: PropTypes.func.isRequired

};




export default Positionform;
