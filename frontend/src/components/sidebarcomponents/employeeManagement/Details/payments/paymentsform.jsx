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
import Labelwithtextfield from '../../../../../assets/formcomponents/textfield.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';



const EmployeePaymentform = ({ createNewEmployeePayment, selectedEmployeePayment, UpdateEmployeePayment }) => {
  
 
  const schema = yup.object().shape({

    Cash: yup.number().min(0),
    UPI: yup.number().min(0),
    Cheque: yup.number().min(0),
    Other: yup.number().min(0),
    payment_date: yup.date().required("Payment date is required"),
    images: yup.array().min(1, 'Min one image is required').required("Images are required"),
    description: yup.string()
  }).test('totalAmount', 'Total amount must be greater than 0', function(value) {
    const { Cash, UPI, Cheque, Other } = value;
    const totalAmount = Cash + UPI + Cheque + Other;
    return totalAmount > 0;
  });

  const { register, handleSubmit, formState, reset,  control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        Cash:0,
        UPI:0,
        Cheque:0,
        Other:0,
        payment_date: "",
        images: [],
        description: ""
    },
    
    
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedEmployeePayment)
    if(selectedEmployeePayment){
   
      reset({

      
        Cash: selectedEmployeePayment?.paidOptionInfo[0]?.amount || 0,
        UPI: selectedEmployeePayment?.paidOptionInfo[1]?.amount || 0,
        Cheque: selectedEmployeePayment?.paidOptionInfo[2]?.amount || 0,
        Other: selectedEmployeePayment?.paidOptionInfo[3]?.amount || 0,
        payment_date: selectedEmployeePayment.payment_date,
        images: selectedEmployeePayment.images,
        description: selectedEmployeePayment.description,
        
      })
    }

  },[selectedEmployeePayment, reset])

 const convertData = (data) => {
  const infoarr = [...paidOptionInfoArr]
  const {Cash, UPI, Cheque, Other} = data;
  infoarr[0].amount = Cash;
  infoarr[1].amount = UPI;
  infoarr[2].amount = Cheque;
  infoarr[3].amount = Other;

  return {
    payment_date: data.payment_date,
    paidOptionInfo: infoarr,
    images: data.images,
    description: data.description
  }

 }

 

console.log(errors, selectedEmployeePayment)   

  

  return (
    
    <form  className='formclass' onSubmit={handleSubmit(data=>selectedEmployeePayment?UpdateEmployeePayment({data:convertData(data), Paymentid:`${selectedEmployeePayment.id}`}):createNewEmployeePayment(convertData(data)))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px"}}>
        <div className='formheading'><Icon
  icon="ph:money"
  style={{
    width: "1.8rem",
    height: "1.8rem",
    color: "rgb(30 171 7)",
    cursor:"pointer"
    
    }}
/>{selectedEmployeePayment?'Update payment': 'Add payment'}</div>
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
           
        



  <div style={{display:"flex", flexDirection:"column", padding:"10px 0px", gap:"10px", marginBottom:"1rem"}}  >
    {paidOptionInfoArr.map((option,index)=><div key={index} style={{display:"flex", alignItems:"center", justifyContent:"space-between",paddingTop:index===0 ? "0":"0px", paddingBottom:(index+1)===paidOptionInfoArr.length ? "0":"0px", gap:"10px",  borderBottom:(index+1)!==paidOptionInfoArr.length && "0px solid rgb(240 240 240)"}}>
    <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
    {option.icon}
    <div style={{ minWidth:'120px', display:"flex", justifyContent:"start" }}>{option.label}</div>
    </div>
    <div  style={{ minWidth:'120px', display:"flex", flexDirection:"column" }}>
       
          <Labelwithtextfield
            register={register}
            errors={errors}
            name={option.via}
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label=""
            direction="row"
            type="number"
            placeholder=""
          />

     
     </div>
    </div>)}
    

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
        {selectedEmployeePayment?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



EmployeePaymentform.propTypes = {
  
  createNewEmployeePayment: PropTypes.func.isRequired,
  selectedEmployeePayment: PropTypes.object.isRequired,
  UpdateEmployeePayment: PropTypes.func.isRequired

};

export default EmployeePaymentform;
