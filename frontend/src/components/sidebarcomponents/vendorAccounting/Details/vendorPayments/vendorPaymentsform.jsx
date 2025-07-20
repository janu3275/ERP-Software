import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';


import Labelwithtextfield from '../../../../../assets/formcomponents/textfield.jsx';
import Labelwithtextarea from '../../../../../assets/formcomponents/textarea.jsx';
import Calendarform from '../../../../../assets/formcomponents/calender/calender.jsx';
import ImageUpload from '../../../../../assets/formcomponents/imageUpload/imageUpload.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';



const VendorPaymentform = ({ createNewVendorPayment, selectedVendorPayment, UpdateVendorPayment}) => {
  
 
  const schema = yup.object().shape({
    
    amount: yup.number().required("Payment amount is required"),
    payment_date: yup.date().required("Payment date is required"),
    images: yup.array().min(1, 'Min one image is required').required("Images are required"),
    note: yup.string()
  });

  const { register, handleSubmit, formState, reset,  getValues, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        
        amount: 0,
        payment_date: "",
        images: [],
        note: "",
    }
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedVendorPayment)
    if(selectedVendorPayment){
   
      reset({

     
        amount: selectedVendorPayment.amount,
        payment_date: selectedVendorPayment.payment_date,
        images: selectedVendorPayment.images,
        note: selectedVendorPayment.note,
        
      })
    }
  },[selectedVendorPayment, reset])

 

 

console.log(errors)

  return (
    
    <form className='formclass' onSubmit={handleSubmit(data=>selectedVendorPayment?UpdateVendorPayment({data, Paymentid:`${selectedVendorPayment.id}`}):createNewVendorPayment(data))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0px", marginBottom:"70px", gap:"10px"}}>
        <div className='formheading'><Icon
  icon="ph:money"
  style={{
    width: "1.8rem",
    height: "1.8rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>{selectedVendorPayment?'Update payment': 'Add payment'}</div>
     <div style={{display:"flex", gap:"20px"}}>
       

            
          <Controller
            name="payment_date"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (
              
             
            <Calendarform

             name='payment_date'
             label='Payment date'
             labelclassname = "formlabel"
             divclassname = "primarytextdivclass"
             value = {field.value}
             disable={false}
             errors={errors}
             forwardedRef={field.ref}

            {...field}

             />
             )}

          />


           <Labelwithtextfield
            register={register}
            errors={errors}
            name="amount"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Payment amount"
            direction="row"
            type="number"
          />

          </div>

              <button className='secondarybtn' onClick={(e)=> {
                console.log("clicked")
                e.preventDefault()
                document.getElementById('imageupload').click()
                }}>
                  Choose files
              </button> 


              <Controller
            name="images"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (
              
             
            <ImageUpload

             name='images'
             value = {field.value}
             errors={errors}
             onChange = {field.onChange}
             forwardedRef={field.ref}

            {...field}

            />

           
             )}
          />

           

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
          />
          
         
         
        

        </div>
        <div className='formbottomdiv' >
        <button  type="submit"  className='secondarybtn' disabled={!isDirty || !isValid || isSubmitting || getValues('images').length===0}>
        {selectedVendorPayment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



VendorPaymentform.propTypes = {
  
  createNewVendorPayment: PropTypes.func.isRequired,
  selectedVendorPayment: PropTypes.object.isRequired,
  UpdateVendorPayment: PropTypes.func.isRequired

};

export default VendorPaymentform;
