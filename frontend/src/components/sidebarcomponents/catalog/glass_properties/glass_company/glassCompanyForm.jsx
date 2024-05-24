import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield';





const GlassCompanyform = ({createNewglassCompany, selectedglassCompany, UpdateglassCompany }) => {



 const schema = yup.object().shape({
    glassCompany: yup.string().required()
});

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      glassCompany:""
    },
  });

  const { isSubmitting, isDirty, isValid, errors } = formState; 

  useEffect(() => {

    if(selectedglassCompany){
       
        reset({
          glassCompany: selectedglassCompany.glass_company
        })
    }
   
  },[selectedglassCompany, reset])


  return (
    
    <form onSubmit={handleSubmit(data=>selectedglassCompany?UpdateglassCompany({glassCompany:data.glassCompany, glassCompanyid:selectedglassCompany.id}):createNewglassCompany(data.glassCompany))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }} >

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="glassCompany"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            label="Glass Company"
            direction="row"
            type="text"
            placeholder="Company name"

          />
        
      </div>
        <div style={{display:"flex", justifyContent:"end", marginTop:"10px",padding:"0 20px"}}>
      <button style={{marginTop:"10px"}} type="submit" className='oksecondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedglassCompany?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};


GlassCompanyform.propTypes = {

 
  createNewglassCompany: PropTypes.func.isRequired,
  selectedglassCompany: PropTypes.object,
  UpdateglassCompany: PropTypes.func.isRequired

};




export default GlassCompanyform;
