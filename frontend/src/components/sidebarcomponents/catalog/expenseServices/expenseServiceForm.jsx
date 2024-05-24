import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect } from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';






const ExpenseServiceform = ({createNewExpenseService, selectedExpenseService, UpdateExpenseService }) => {


 const schema = yup.object().shape({
    service_name: yup.string().required(),
   
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        service_name:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(()=>{
    if(selectedExpenseService){
       
        reset({
            service_name: selectedExpenseService.service_name
        })
    }
   
  },[selectedExpenseService, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedExpenseService?UpdateExpenseService({data, ExpenseServiceid: selectedExpenseService.id}):createNewExpenseService(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="service_name"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Service"
            direction="row"
            type="text"
            placeholder="name"
           />

      </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedExpenseService?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


ExpenseServiceform.propTypes = {

  createNewExpenseService: PropTypes.func.isRequired,
  selectedExpenseService: PropTypes.object,
  UpdateExpenseService: PropTypes.func.isRequired

};




export default ExpenseServiceform;
