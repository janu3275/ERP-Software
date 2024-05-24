import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';
import Labelwithtextarea from '../../../../assets/formcomponents/textarea';



const Customerform = ({ createNewCustomer,selectedCustomer,UpdateCustomer}) => {

 const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    mobile_number: yup
      .string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    whatsapp_number: yup
      .string()
      .required('WhatsApp number is required')
      .matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits'),
    email_address: yup
      .string()
      .required('Email address is required')
      .email('Invalid email address'),
    company_name: yup.string().required('Company name is required'),
    address: yup.string().required('Address is required'),
    note: yup.string().required('Note is required'),
  });

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: "",
      mobile_number: "",
      whatsapp_number: "",
      email_address: "",
      company_name: "",
      address: "",
      note: "",
    }
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedCustomer)
    if(selectedCustomer){
   
      reset({
        name: selectedCustomer.name,
        mobile_number: selectedCustomer.mobile_number,
        whatsapp_number: selectedCustomer.whatsapp_number,
        email_address: selectedCustomer.email_address,
        company_name: selectedCustomer.company_name,
        address: selectedCustomer.address,
        note: selectedCustomer.note,
      })
    }
  },[selectedCustomer, reset])

 



  return (
    
    <form onSubmit={handleSubmit(data=>selectedCustomer?UpdateCustomer({data, customerid:`${selectedCustomer.id}`}):createNewCustomer(data))}>
       <div style={{ gap: "20px", flexDirection: "column", display: "flex" }}>
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="name"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Name"
            direction="row"
            type="text"
            placeholder="Customer name"
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="mobile_number"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Mobile number"
            direction="row"
            type="number"
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="whatsapp_number"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Whatsapp"
            direction="row"
            type="number"
            
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="email_address"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Email address"
            direction="row"
            type="text"
            placeholder="Should include @ and ."
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="company_name"
            labelclassname="custformlabel"
            textfieldclassname="custformtext"
            divclassname="horizontal"
            defaultValue=""
            label="Company name"
            direction="row"
            type="text"
            placeholder="Company name if any.."
          />
           <Labelwithtextarea
            register={register}
            errors={errors}
            name="address"
            labelclassname="custformlabel"
            textfieldclassname="custformtextarea"
            divclassname="horizontal"
            defaultValue=""
            label="Address"
            direction="row"
            type="text"
            placeholder="Address"
          />
           <Labelwithtextarea
            register={register}
            errors={errors}
            name="note"
            labelclassname="custformlabel"
            textfieldclassname="custformtextarea"
            divclassname="horizontal"
            defaultValue=""
            label="Note"
            direction="row"
            type="text"
            placeholder="Extra information"
          />
         
         
        

        </div>
        <div className='formbottomdiv'>
        <button style={{marginTop:"10px"}} type="submit"  className='secondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
        {selectedCustomer?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



Customerform.propTypes = {

 
  createNewCustomer: PropTypes.func.isRequired,
  selectedCustomer: PropTypes.object.isRequired,
  UpdateCustomer: PropTypes.func.isRequired

};

export default Customerform;
