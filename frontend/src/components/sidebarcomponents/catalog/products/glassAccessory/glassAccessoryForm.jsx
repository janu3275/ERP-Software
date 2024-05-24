import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';





const Accessoryform= ({createNewAccessory,selectedaccessory,UpdateAccessory, unitItems}) => {


  const schema = yup.object().shape({
    name: yup.string().required(),
    unit: yup.string().required(),
    unit_selling_price: yup.string().required(),
    stock: yup.string().required()
  });

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: "",
      unit: "",
      unit_selling_price: "",
      stock: ""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedaccessory)
    if(selectedaccessory){
     
      reset({
        name: selectedaccessory.name,
        unit: selectedaccessory.unit,
        unit_selling_price: selectedaccessory.unit_selling_price,
        stock: selectedaccessory.stock
      })
    }
  },[selectedaccessory, reset])

 







  return (
    
    <form onSubmit={handleSubmit(data=>selectedaccessory?UpdateAccessory({data, accessoryid:`${selectedaccessory.id}`}):createNewAccessory(data))}>
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
            placeholder="Accessory name"
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
            name="unit_selling_price"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
           
            label="Price"
            direction="row"
            type="number"
            placeholder="Charge/Unit"
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
        <button style={{marginTop:"10px"}} type="submit"  className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedaccessory?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



Accessoryform.propTypes = {

 
  createNewAccessory: PropTypes.func.isRequired,
  selectedaccessory: PropTypes.object.isRequired,
  UpdateAccessory: PropTypes.func.isRequired,
  unitItems: PropTypes.object.isRequired

};


export default Accessoryform;
