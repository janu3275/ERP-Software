import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextarea from '../../../../../assets/formcomponents/textarea.jsx';
import Calendarform from '../../../../../assets/formcomponents/calender/calender.jsx';
import ImageUpload from '../../../../../assets/formcomponents/imageUpload/imageUpload.jsx';
import { calculatePaid, paidOptionInfoArr } from '../../../../../commonfn.jsx';
import PaymentFormComp from '../../../../../assets/formcomponents/PaymentComp/Payment.jsx';



const CustomerPaymentform = ({ createNewCustomerPayment, selectedCustomerPayment, UpdateCustomerPayment }) => {
  
 
  const schema = yup.object().shape({
    paidOptionInfo: yup.array().test('totalAmount', 'Total amount must be greater than 0', function(value) {
      const totalAmount = calculatePaid(value);
      console.log("total amount", totalAmount, value)
      return totalAmount > 0;
  }),
    
    payment_date: yup.date().required("Payment date is required"),
    images: yup.array().min(1, 'Min one image is required').required("Images are required"),
    description: yup.string()
  });

  const { register, handleSubmit, formState, reset,  control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        paidOptionInfo: paidOptionInfoArr,
        payment_date: "",
        images: [],
        description: "",
    }
    
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedCustomerPayment)
    if(selectedCustomerPayment){
   
      reset({

        paidOptionInfo: selectedCustomerPayment.paidOptionInfo,
        payment_date: selectedCustomerPayment.payment_date,
        images: selectedCustomerPayment.images,
        description: selectedCustomerPayment.description,
        
      })
    }
  },[selectedCustomerPayment, reset])

 

 

console.log(errors, selectedCustomerPayment)   

  

  return (
    
    <form  className='formclass' onSubmit={handleSubmit(data=>selectedCustomerPayment?UpdateCustomerPayment({data, Paymentid:`${selectedCustomerPayment.id}`}):createNewCustomerPayment(data))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px"}}>
        <div className='formheading'>{selectedCustomerPayment?'Update payment': 'Add payment'}</div>
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
             disable={false}
             value = {field.value}
             errors={errors}
             forwardedRef={field.ref}

            {...field}

            
             
             />
             
          
          )}
          />

         </div>
           
        


           <Controller
            name="paidOptionInfo"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (
              
             
            <PaymentFormComp

             name='paidOptionInfo'
             value = {field.value}
             errors={errors}
             onChange = {field.onChange}
             forwardedRef={field.ref}

            {...field}

            />

           
             )}
          />

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
            name="description"
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
        <button  type="submit"  className='secondarybtn' disabled={ !isDirty || !isValid || isSubmitting }>
        {selectedCustomerPayment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



CustomerPaymentform.propTypes = {
  
  createNewCustomerPayment: PropTypes.func.isRequired,
  selectedCustomerPayment: PropTypes.object.isRequired,
  UpdateCustomerPayment: PropTypes.func.isRequired

};

export default CustomerPaymentform;
