import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassInventoryform= ({ createNewGlassInventory, selectedGlassInventory, UpdateGlassInventory, glassProductItems, sizeItems }) => {


  const schema = yup.object().shape({
    glassProduct: yup.string().required('Glass product is required'),
    size: yup.string().required('Size is required'),
    stock: yup.number()
      .required('Stock is required')
      .integer('Stock must be an integer')
      .positive('Stock must be a positive number'),
  
  });

  const { register, handleSubmit, formState, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        glassProduct: '',
        size: '',
        stock: '',
    }

  });

  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedGlassInventory)
    if(selectedGlassInventory){
     
      reset({
        glassProduct: `${selectedGlassInventory['thickness']}mm ${selectedGlassInventory['color']} ${selectedGlassInventory['glass_type']} ${selectedGlassInventory['glass_company']} - glass`,
        size: `${selectedGlassInventory.length} x ${selectedGlassInventory.width}`,
        stock: selectedGlassInventory.stock
        
      })
    }

  },[selectedGlassInventory, reset])

 
  return (
    
    <form onSubmit={handleSubmit(data=>selectedGlassInventory?UpdateGlassInventory({data, GlassInventoryid:`${selectedGlassInventory.id}`}):createNewGlassInventory(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }}>

     

          <Controller
            name="glassProduct"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder='Choose glass product'
                divclassname="horizontal"
                groups={glassProductItems}
                label='Glass product'
                forwardedRef={field.ref}
                errors={errors}
                disabled={selectedGlassInventory?true:false}
                {...field}
              />
            )}
          />    

           <Controller
            name="size"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose size"
                divclassname="horizontal"
                groups={sizeItems}
                label='Size'
                forwardedRef={field.ref}
                errors={errors}
                disabled={false}
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
        <button style={{marginTop:"10px"}} type="submit"  className='oksecondarybtn' disabled={ !isDirty || !isValid || isSubmitting }>
        {selectedGlassInventory?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



GlassInventoryform.propTypes = {

  createNewGlassInventory: PropTypes.func.isRequired,
  selectedGlassInventory: PropTypes.object.isRequired,
  UpdateGlassInventory: PropTypes.func.isRequired,
  glassProductItems: PropTypes.array.isRequired, 
  sizeItems: PropTypes.array.isRequired

};


export default GlassInventoryform;
