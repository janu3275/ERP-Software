import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';





const OtherProductform= ({createNewOtherProduct,selectedOtherProduct,UpdateOtherProduct, unitItems}) => {


  const schema = yup.object().shape({
    name: yup.string().required(),
    unit: yup.string().required(),
    stock: yup.string().required()
  });

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: "",
      unit: "",
      stock: ""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedOtherProduct)
    if(selectedOtherProduct){
     
      reset({
        name: selectedOtherProduct.name,
        unit: selectedOtherProduct.unit,
        stock: selectedOtherProduct.stock
      })
    }
  },[selectedOtherProduct, reset])

 







  return (
    
    <form onSubmit={handleSubmit(data=>selectedOtherProduct?UpdateOtherProduct({data, OtherProductid:`${selectedOtherProduct.id}`}):createNewOtherProduct(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }}>

       <Labelwithtextfield
            register={register}
            errors={errors}
            name="name"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
           
            label="Name"
            direction="row"
            type="text"
            placeholder="OtherProduct name"
          />


          <Controller
            name="unit"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose unit"
                divclassname="horizontal"
                groups={unitItems}
                label='Unit'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />        

          


           <Labelwithtextfield
            register={register}
            errors={errors}
            name="stock"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Stock"
            direction="row"
            type="number"
            placeholder="How much in stock"
          />

         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
        <button style={{marginTop:"10px"}} type="submit"  className='oksecondarybtn' disabled={!isDirty || !isValid }>
        {selectedOtherProduct?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



OtherProductform.propTypes = {
  
  createNewOtherProduct: PropTypes.func.isRequired,
  selectedOtherProduct: PropTypes.object.isRequired,
  UpdateOtherProduct: PropTypes.func.isRequired,
  unitItems: PropTypes.object.isRequired

};


export default OtherProductform;
