import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import { calculatePaid, paidOptionInfoArr } from '../../../../commonfn';
import Labelwithtextfield from '../../../../assets/formcomponents/textfield';
import Calendarform from '../../../../assets/formcomponents/calender/calender';
import PaymentFormComp from '../../../../assets/formcomponents/PaymentComp/Payment';
import ImageUpload from '../../../../assets/formcomponents/imageUpload/imageUpload';
import Labelwithtextarea from '../../../../assets/formcomponents/textarea';




const OtherExpensePaymentform = ({ createNewOtherExpensePayment, selectedOtherExpensePayment, UpdateOtherExpensePayment }) => {
  
 
  const schema = yup.object().shape({
    expense_name: yup.string().required(),
    paidOptionInfo: yup.array().test('totalAmount', 'Total amount must be greater than 0', function(value) {
      const totalAmount = calculatePaid(value);
      console.log("total amount", totalAmount, value)
      return totalAmount > 0;
  }),
    
    payment_date: yup.date().required("Payment date is required"),
    images: yup.array(),
    description: yup.string()
  });

  const { register, handleSubmit, formState, reset,  control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        expense_name:"",
        paidOptionInfo: paidOptionInfoArr,
        payment_date: "",
        images: [],
        description: "",
    }
    
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedOtherExpensePayment)
    if(selectedOtherExpensePayment){
   
      reset({
        expense_name: selectedOtherExpensePayment.expense_name, 
        paidOptionInfo: selectedOtherExpensePayment.paidOptionInfo,
        payment_date: selectedOtherExpensePayment.payment_date,
        images: selectedOtherExpensePayment.images,
        description: selectedOtherExpensePayment.description,
        
      })
    }

  },[selectedOtherExpensePayment, reset])

 

 

console.log(errors, selectedOtherExpensePayment)   

  

  return (
    
    <form  className='formclass' onSubmit={handleSubmit(data=>selectedOtherExpensePayment?UpdateOtherExpensePayment({data, Paymentid:`${selectedOtherExpensePayment.id}`}):createNewOtherExpensePayment(data))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px"}}>
        <div className='formheading'>{selectedOtherExpensePayment?'Update payment': 'Add payment'}</div>
     <div style={{display:"flex", gap:"20px"}}>
     <Labelwithtextfield
          register={register}
          errors={errors}
          name="expense_name"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Expense name"
          direction="row"
          type="string"
          placeholder="name.."
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
           
         <Labelwithtextarea
            register={register}
            errors={errors}
            name="description"
            labelclassname="formlabel"
            textfieldclassname="primarytextareaclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Expense description"
            direction="row"
            type="text"
          />


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

           
           

          
          
         
         
        

        </div>
        <div className='formbottomdiv' >
        <button  type="submit"  className='secondarybtn' disabled={ !isDirty || !isValid }>
        {selectedOtherExpensePayment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



OtherExpensePaymentform.propTypes = {
  
  createNewOtherExpensePayment: PropTypes.func.isRequired,
  selectedOtherExpensePayment: PropTypes.object.isRequired,
  UpdateOtherExpensePayment: PropTypes.func.isRequired
  

};

export default OtherExpensePaymentform;
