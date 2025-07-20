import {  useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// import "./companyloginform.css";
import PropTypes from "prop-types";
import Labelwithtextfield from '../assets/formcomponents/textfield';
import { useEffect } from 'react';





const MarketPlaceAdditionform = ({addNewMarketPlace, selectedMarket, updateMarketPlace }) => {

    const schema = yup.object().shape({
        Name: yup.string().required('Market place name is required').min(6, 'Marketplace name must be at least 6 characters'),
    });

  const { register, handleSubmit, formState, reset,  control  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        Name:""
      },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  useEffect(() => {
    
    console.log(selectedMarket)
    if(selectedMarket){
   
      reset({
           Name: selectedMarket.name
    })
    }

  },[selectedMarket, reset])
 

  return (
    
    <form onSubmit={handleSubmit(data=>selectedMarket?updateMarketPlace({data, market_id: selectedMarket.id}):addNewMarketPlace(data))}>
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
      <button  style={{marginTop:"10px", width:"-webkit-fill-available", height:"22px", borderRadius:"4px"}} className='secondarybtn' type="submit" disabled={ !isValid || isSubmitting}>
       {selectedMarket?'Update':'Create'}
      </button>
      </div>
    </form>
  );
};


MarketPlaceAdditionform.propTypes = {
addNewMarketPlace: PropTypes.func.isRequired,
selectedMarket: PropTypes.any, 
updateMarketPlace: PropTypes.func.isRequired
};


export default MarketPlaceAdditionform;
