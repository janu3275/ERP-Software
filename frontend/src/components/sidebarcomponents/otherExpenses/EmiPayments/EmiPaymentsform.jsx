import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import { calculatePaid, paidOptionInfoArr } from '../../../../commonfn';
import SingleSelectDemo from '../../../../assets/formcomponents/select';
import Calendarform from '../../../../assets/formcomponents/calender/calender';
import PaymentFormComp from '../../../../assets/formcomponents/PaymentComp/Payment';
import ImageUpload from '../../../../assets/formcomponents/imageUpload/imageUpload';
import Labelwithtextarea from '../../../../assets/formcomponents/textarea';




const EmiPaymentform = ({ createNewEmiPayment, selectedEmiPayment, UpdateEmiPayment, allEmiTypeItems }) => {
  
 
  const schema = yup.object().shape({
    purpose: yup.string().required(),
    paidOptionInfo: yup.array().test('totalAmount', 'Total amount must be greater than 0', function(value) {
      const totalAmount = calculatePaid(value);
      console.log("total amount", totalAmount, value)
      return totalAmount > 0;
  }),
    
    payment_date: yup.date().required("Payment date is required"),
    images: yup.array(),
    note: yup.string()
  });

  const { register, handleSubmit, formState, reset,  control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        purpose:"",
        paidOptionInfo: paidOptionInfoArr,
        payment_date: "",
        images: [],
        note: "",
    }
    
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedEmiPayment)
    if(selectedEmiPayment){
   
      reset({
        purpose: selectedEmiPayment.purpose, 
        paidOptionInfo: selectedEmiPayment.paidOptionInfo,
        payment_date: selectedEmiPayment.payment_date,
        images: selectedEmiPayment.images,
        note: selectedEmiPayment.note,
        
      })
    }

  },[selectedEmiPayment, reset])

 

 

console.log(errors, selectedEmiPayment)   

  

  return (
    
    <form  className='formclass' onSubmit={handleSubmit(data=>selectedEmiPayment?UpdateEmiPayment({data, Paymentid:`${selectedEmiPayment.id}`}):createNewEmiPayment(data))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px"}}>
        <div className='formheading'>{selectedEmiPayment?'Update payment': 'Add payment'}</div>
     <div style={{display:"flex", gap:"20px"}}>
     <Controller
          name="purpose"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SingleSelectDemo
              placeholder="Choose EMI type"
              groups={allEmiTypeItems}
              label="EMI for"
              divclassname="primarytextdivclass"
              labelclassname = "formlabel"
              forwardedRef={field.ref}
              errors={errors}
              {...field}
            />
          )}
        />

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
        <button  type="submit"  className='secondarybtn' disabled={ !isDirty || !isValid  }>
        {selectedEmiPayment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



EmiPaymentform.propTypes = {
  
  createNewEmiPayment: PropTypes.func.isRequired,
  selectedEmiPayment: PropTypes.object.isRequired,
  UpdateEmiPayment: PropTypes.func.isRequired,
  allEmiTypeItems: PropTypes.any

};

export default EmiPaymentform;
