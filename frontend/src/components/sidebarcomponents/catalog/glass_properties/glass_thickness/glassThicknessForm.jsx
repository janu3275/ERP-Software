import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';
import SingleSelectDemo from '../../../../../assets/formcomponents/select';






const GlassThicknessform = ({createNewglassThickness, selectedglassThickness, UpdateglassThickness , items}) => {



 const schema = yup.object().shape({
    thickness: yup.number().required(),
    unit: yup.string().required()
});

  const { register, handleSubmit, formState, control,  reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      thickness:"",
      unit:""
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {

    if(selectedglassThickness){
       
        reset({
          thickness:selectedglassThickness.thickness,
          unit:selectedglassThickness.unit
        })
    }
   
  },[selectedglassThickness, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassThickness?UpdateglassThickness({glassThickness:data, glassThicknessid:selectedglassThickness.id}):createNewglassThickness(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="thickness"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Thickness"
            direction="row"
            type="number"
            placeholder="thickness"

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
                label='Unit'
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
        {selectedglassThickness?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassThicknessform.propTypes = {

 
  createNewglassThickness: PropTypes.func.isRequired,
  selectedglassThickness: PropTypes.object,
  UpdateglassThickness: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired

};




export default GlassThicknessform;
