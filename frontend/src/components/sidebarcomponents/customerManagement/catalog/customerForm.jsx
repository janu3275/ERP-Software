import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';
import Labelwithtextarea from '../../../../assets/formcomponents/textarea';
import { Icon } from '@iconify/react/dist/iconify.js';



const Customerform = ({ createNewCustomer, selectedCustomer, UpdateCustomer }) => {


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
    gstin: yup
    .string()
    .test(
      'is-gstin-or-empty',
      'GSTin must be 15 characters long and alphanumeric',
      (value) => !value || /^[0-9A-Z]{15}$/.test(value)
    )
    .nullable(),
  pan: yup
    .string()
    .test(
      'is-pan-or-empty',
      'PAN must be in the format ABCDE1234F',
      (value) => !value || /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/.test(value)
    )
    .nullable(),
  adhaar_number: yup
    .string()
    .test(
      'is-aadhaar-or-empty',
      'Aadhaar number must be 12 digits long',
      (value) => !value || /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/.test(value)
    )
    .nullable(),
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
      gstin:"",
      pan: "",
      adhaar_number: "",
      note: ""
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
        gstin: selectedCustomer.gstin,
        pan: selectedCustomer.pan,
        adhaar_number: selectedCustomer.adhaar_number,
        note: selectedCustomer.note
      })
    }
  },[selectedCustomer, reset])

 



  return (
    
    <form className="normalcustomerDialogForm" onSubmit={handleSubmit(data=>selectedCustomer?UpdateCustomer({data, customerid:`${selectedCustomer.id}`}):createNewCustomer(data))}>
        <div style={{ gap: "20px", flexDirection: "column", display: "flex", padding:"0px 100px", maxWidth:"600px", margin:"auto", marginBottom:"100px"  }}>
        <div className='formheading'><Icon
          icon="bi:person"
          style={{
            width: "1.8rem",
            height: "1.8rem",
            color: "rgb(30, 171, 7)",
            cursor:"pointer"
            
            }}
        />{selectedCustomer?'Update customer':'Add customer'}</div>
       <div className="primaryformsection">
        <div className="primaryformsectiontitle"> Personal details</div>
        <div className="primaryformsectioncontent">
         
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="name"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Name"
            direction="row"
            type="text"
            placeholder="Customer name"
          />
          <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="mobile_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Mobile number"
            direction="row"
            type="number"
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="whatsapp_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Whatsapp"
            direction="row"
            type="number"
            
          />
          
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="email_address"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Email address"
            direction="row"
            type="text"
            placeholder="Should include @ and ."
          />
          </div>
           <Labelwithtextarea
            register={register}
            errors={errors}
            name="address"
            labelclassname="formlabel"
            textfieldclassname="primarytextareaclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Address"
            direction="row"
            type="text"
            placeholder="Address"
          />
           </div>
          </div>
          <div className="primaryformsection">
        <div className="primaryformsectiontitle">Company details</div>
        <div className="primaryformsectioncontent">

        <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="company_name"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Company name"
            direction="row"
            type="text"
            placeholder="Company name if any.."
          />

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="gstin"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="GST number"
            direction="row"
            type="text"
            placeholder="GST Number..."
          />
         </div>
         <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
         <Labelwithtextfield
            register={register}
            errors={errors}
            name="pan"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Pan number"
            direction="row"
            type="text"
            placeholder="Pan number.."
          />

          <Labelwithtextfield
            register={register}
            errors={errors}
            name="adhaar_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Adhaar number"
            direction="row"
            type="text"
            placeholder="Adhaar number.."
          />
         </div>
           </div>
          </div>
           <Labelwithtextarea
            register={register}
            errors={errors}
            name="note"
            labelclassname="formlabel"
            textfieldclassname="primarytextareaclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Note"
            direction="row"
            type="text"
            placeholder="Extra information"
          />
         
         
      </div>

        <div className='formbottomdiv'>
        <button type="submit"  className='secondarybtn' disabled={!isDirty || !isValid || isSubmitting}>
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
