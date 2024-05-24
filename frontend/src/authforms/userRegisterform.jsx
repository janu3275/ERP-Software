import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import Labelwithtextfield from '../assets/formcomponents/textfield';





const UserRegisterform = ({registerUser}) => {

    const schema = yup.object().shape({
        userid: yup.string().required(),
        access: yup.string().required(),
        password: yup
        .string()
        .required('Password is required')
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            'Password must be strong'
          )
      });

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        userid:"",
        password:"",
        access:"owner"
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

 


  return (
    
    <form onSubmit={handleSubmit(data=>registerUser(data))}>
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
        Register user
      </button>
      </div>
    </form>
  );
};


UserRegisterform.propTypes = {
registerUser: PropTypes.func.isRequired,
};


export default UserRegisterform;
