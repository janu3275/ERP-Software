import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassProductform= ({ createNewGlassProduct, selectedGlassProduct, UpdateGlassProduct, colorItems, glassCompaniesItems, glassTypesItems, thicknessItems}) => {


  const schema = yup.object().shape({
    glass_type: yup.string().required('Glass type is required'),
    thickness: yup.string().required('Thickness is required'),
    company: yup.string().required('Company is required'),
    color: yup.string().required('Color is required'),
    selling_rate_per_sqft: yup.number()
      .required('Selling rate per sqft is required')
      .positive('Selling rate per sqft must be a positive number')
  });

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        glass_type: "",
        thickness: "",
        company: "",
        color: "",
        selling_rate_per_sqft: ""
    }

  });

  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedGlassProduct)
    if(selectedGlassProduct){
     
      reset({
        glass_type: selectedGlassProduct.glass_type,
        thickness: selectedGlassProduct.thickness,
        company: selectedGlassProduct.glass_company,
        color: selectedGlassProduct.color,
        selling_rate_per_sqft: selectedGlassProduct.selling_rate_per_sqft
      })
    }

  },[selectedGlassProduct, reset])

 







  return (
    
    <form onSubmit={handleSubmit(data=>selectedGlassProduct?UpdateGlassProduct({data, GlassProductid:`${selectedGlassProduct.id}`}):createNewGlassProduct(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }}>

     

          <Controller
            name="glass_type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose type"
                divclassname="horizontal"
                groups={glassTypesItems}
                label='Glass type'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />    

       

           <Controller
            name="thickness"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose thickness"
                divclassname="horizontal"
                groups={thicknessItems}
                label='Thickness'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          /> 

           <Controller
            name="company"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose company"
                divclassname="horizontal"
                groups={glassCompaniesItems}
                label='Company'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          /> 

           <Controller
            name="color"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose color"
                divclassname="horizontal"
                groups={colorItems}
                label='Color'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />

            )}

          />     

           <Labelwithtextfield
            register={register}
            errors={errors}
            name="selling_rate_per_sqft"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Selling rate per sqft"
            direction="row"
            type="number"
            placeholder="Charge/Unit"
          />


        

         
         
        

        </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
        <button style={{marginTop:"10px"}} type="submit"  className='oksecondarybtn' disabled={!isDirty || !isValid }>
        {selectedGlassProduct?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



GlassProductform.propTypes = {

  createNewGlassProduct: PropTypes.func.isRequired,
  selectedGlassProduct: PropTypes.object.isRequired,
  UpdateGlassProduct: PropTypes.func.isRequired,
  colorItems: PropTypes.array.isRequired, 
  glassCompaniesItems: PropTypes.array.isRequired, 
  glassTypesItems: PropTypes.array.isRequired, 
  thicknessItems: PropTypes.array.isRequired, 
  sizeItems: PropTypes.array.isRequired

};


export default GlassProductform ;
