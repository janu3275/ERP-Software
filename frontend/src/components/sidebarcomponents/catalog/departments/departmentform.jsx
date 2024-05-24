import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';




const Departmentform = ({createNewDepartment, selectedDepartment, UpdateDepartment }) => {


 const schema = yup.object().shape({
    Department: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      Department:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedDepartment){
       
        reset({
          Department: selectedDepartment.department_name
        })
    }
   
  },[selectedDepartment, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedDepartment?UpdateDepartment({data, Departmentid: selectedDepartment.id}):createNewDepartment(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="Department"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Department"
            direction="row"
            type="text"
            placeholder="name"

          />
        
         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedDepartment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


Departmentform.propTypes = {

  createNewDepartment: PropTypes.func.isRequired,
  selectedDepartment: PropTypes.object,
  UpdateDepartment: PropTypes.func.isRequired

};




export default Departmentform ;


