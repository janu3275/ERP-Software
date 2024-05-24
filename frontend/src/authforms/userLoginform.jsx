import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import Labelwithtextfield from '../assets/formcomponents/textfield';





const UserLoginform = ({loginUser}) => {

    const schema = yup.object().shape({
        userid: yup.string().required(),
        password: yup
        .string()
        .required('Password is required')
      
      });

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        userid:"",
        password:"",
        
        
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

 


  return (
    
    <form onSubmit={handleSubmit(data=>loginUser(data))}>
       <div style={{marginTop:"100px",  flexDirection: "column", display: "flex" }}>

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="userid"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="vertical"
            defaultValue=""
            label="User ID"
            direction="row"
            type="text"
            placeholder="userid"
          />


                

           <Labelwithtextfield
            register={register}
            errors={errors}
            name="password"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="vertical"
            defaultValue=""
            label="PASSWORD"
            direction="row"
            type="text"
            placeholder="password"
          />
          
       </div>
        <div style={{display:"flex",  marginTop:"10px"}}>
      <button style={{marginTop:"10px"}} className='oksecondarybtn' type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        Login user
      </button>
      </div>
    </form>
  );
};


UserLoginform.propTypes = {
loginUser: PropTypes.func.isRequired,
};


export default UserLoginform;
