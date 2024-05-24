import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';






const GlassSizeform = ({createNewglassSize, selectedglassSize, UpdateglassSize , items}) => {


 const schema = yup.object().shape({
    length: yup.number().required(),
    width: yup.number().required(),
    unit: yup.string().required()
});

  const { register, handleSubmit, formState, control,  reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      length:"",
      width:"",
      unit:""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {

    if(selectedglassSize){
        
        reset({
          length:selectedglassSize.length,
          width:selectedglassSize.width,
          unit:selectedglassSize.unit
        })
    }
   
  },[selectedglassSize, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassSize?UpdateglassSize({glassSize:data, glassSizeid:selectedglassSize.id, unitid:selectedglassSize.unitid}):createNewglassSize(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="length"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Length"
            direction="row"
            type="number"
            placeholder="length"

          />


          <Labelwithtextfield
            register={register}
            errors={errors}
            name="width"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Width"
            direction="row"
            type="number"
            placeholder="width"

          />

           <Controller
            
            name="unit"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose Type"
                groups={items}
                label='Value Type'
                divclassname='horizontal'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />
        
      </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassSize?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassSizeform.propTypes = {

 
  createNewglassSize: PropTypes.func.isRequired,
  selectedglassSize: PropTypes.object,
  UpdateglassSize: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired

};




export default GlassSizeform;
