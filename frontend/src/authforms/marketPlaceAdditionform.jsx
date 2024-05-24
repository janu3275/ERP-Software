import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// import "./companyloginform.css";
import PropTypes from "prop-types";
import Labelwithtextfield from '../assets/formcomponents/textfield';





const MarketPlaceAdditionform = ({addNewMarketPlace}) => {

    const schema = yup.object().shape({
        Name: yup.string().required('Market place name is required').min(6, 'Marketplace name must be at least 6 characters'),
    });

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        Name:""
      },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

 

  return (
    
    <form onSubmit={handleSubmit(data=>addNewMarketPlace(data))}>
       <div style={{ flexDirection: "column", display: "flex" }}>

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="Name"
            labelclassname="custformlabel"
            textfieldclassname="logintextfield"
            divclassname="vertical"
            defaultValue=""
            label="Name"
            direction="row"
            type="text"
            placeholder="Name of the market"
          />


    </div>
        <div style={{display:"flex",  marginTop:"10px"}}>
      <button style={{marginTop:"10px"}} className='oksecondarybtn' type="submit" disabled={!isDirty || !isValid || isSubmitting}>
       Create
      </button>
      </div>
    </form>
  );
};


MarketPlaceAdditionform.propTypes = {
addNewMarketPlace: PropTypes.func.isRequired,
};


export default MarketPlaceAdditionform;
