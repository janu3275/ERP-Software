import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield.jsx';
import Labelwithtextarea from '../../../../assets/formcomponents/textarea.jsx';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import SingleSelectDemo from '../../../../assets/formcomponents/select.jsx';
import { ProductTypeItems } from '../../orders/allOrders/staticOptions.jsx';



const Vendorform = ({ createNewVendor,selectedVendor,UpdateVendor}) => {


 const schema = yup.object().shape({
    vendor_name: yup.string().required('Vendor name is required'),
    contact_person: yup.string().required(),
    product_type: yup.string().required('Product type is required'),
    email: yup.string().email('Invalid email format').required(),
    phone_number: yup.string().matches(
      /^[6-9]\d{9}$/,
      'Phone number must be in Indian format'
    ).required(),
    whatsapp_number: yup.string().matches(
        /^[6-9]\d{9}$/,
        'Phone number must be in Indian format'
      ).required(),
    address: yup.string().nullable(),
    city: yup.string().nullable(),
    state_province: yup.string().nullable(),
    country: yup.string().nullable(),
    postal_code: yup.string().nullable(),
    notes: yup.string().nullable(),
  });

  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        vendor_name: "",
        contact_person: "",
        product_type: "",
        email: "",
        phone_number: "",
        whatsapp_number:"",
        address: "",
        city: "",
        state_province: "",
        country: "",
        postal_code: "",
        notes: ""
    }
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedVendor)
    if(selectedVendor){
   
      reset({
        vendor_name: selectedVendor.vendor_name,
        contact_person: selectedVendor.contact_person,
        product_type: selectedVendor.product_type,
        email: selectedVendor.email,
        phone_number: selectedVendor.phone_number,
        whatsapp_number: selectedVendor.whatsapp_number,
        address: selectedVendor.address,
        city: selectedVendor.city,
        state_province: selectedVendor.state_province,
        country: selectedVendor.country,
        postal_code: selectedVendor.postal_code,
        notes: selectedVendor.notes
      })

    }

  },[selectedVendor, reset])

 

console.log(isDirty, isValid, errors)

  return (
    
    <form className="normalDialogForm" onSubmit={handleSubmit(data=>selectedVendor?UpdateVendor({data, Vendorid:`${selectedVendor.id}`}):createNewVendor(data))}>
       <div style={{gap: "20px", flexDirection: "column", display: "flex", marginBottom:"150px" , padding:"0px 100px" }}>
       <div className="formtitle">{selectedVendor?"Update vendor":"Add vendor"}</div>
       
       <Controller
          name="product_type"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SingleSelectDemo
              placeholder="Choose Product type"
              groups={ProductTypeItems}
              label="Product type"
              divclassname="primarytextdivclass"
              labelclassname = "formlabel"
              forwardedRef={field.ref}
              errors={errors}
              {...field}
            />
          )}
        />


       <div className="primaryformsection">
        <div className="primaryformsectiontitle">Personal details</div>
        <div className="primaryformsectioncontent">
        <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="vendor_name"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Vendor name"
            direction="row"
            type="text"
            placeholder="Vendor name"
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="contact_person"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Contact person"
            direction="row"
            type="text"
          />
          </div>
          </div>
         </div>
         <div className="primaryformsection">
        <div className="primaryformsectiontitle">Contact details</div>
        <div className="primaryformsectioncontent">
         <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="email"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Email "
            direction="row"
            type="text"
            
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="phone_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Phone number"
            direction="row"
            type="number"
            placeholder="Should be a valid number"
          />
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="whatsapp_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Whatsapp number"
            direction="row"
            type="text"
            placeholder=""
          />
          </div>
          </div>
          </div>
          <div className="primaryformsection">
        <div className="primaryformsectiontitle">Address details</div>
        <div className="primaryformsectioncontent">
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
          <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
           <Labelwithtextfield
            register={register}
            errors={errors}
            name="city"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="City "
            direction="row"
            type="text"
            placeholder=""
          />
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="state_province"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="State"
            direction="row"
            type="text"
            placeholder="Extra information"
          />
          </div>
          <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
        <Labelwithtextfield
            register={register}
            errors={errors}
            name="country"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Country"
            direction="row"
            type="text"
            placeholder="Extra information"
          />

        <Labelwithtextfield
            register={register}
            errors={errors}
            name="postal_code"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Postal code"
            direction="row"
            type="number"
            placeholder="Extra information"
          />
         </div>
         </div>
         </div>
           <Labelwithtextarea
            register={register}
            errors={errors}
            name="notes"
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
        <div
       className='formbottomdiv'
      >
        <button
          
          type="submit"
          className='secondarybtn'
          disabled={!isDirty || !isValid}
        >
          {selectedVendor? "Update" : "Save"}
        </button>
      </div>
    </form>

  );
};



Vendorform.propTypes = {
  
  createNewVendor: PropTypes.func.isRequired,
  selectedVendor: PropTypes.object.isRequired,
  UpdateVendor: PropTypes.func.isRequired

};

export default Vendorform;
