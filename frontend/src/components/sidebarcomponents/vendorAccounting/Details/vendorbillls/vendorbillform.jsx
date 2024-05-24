import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import PropTypes from "prop-types";
import { useEffect} from 'react';


import Labelwithtextfield from '../../../../../assets/formcomponents/textfield.jsx';
import Labelwithtextarea from '../../../../../assets/formcomponents/textarea.jsx';
import Calendarform from '../../../../../assets/formcomponents/calender/calender.jsx';
import ImageUpload from '../../../../../assets/formcomponents/imageUpload/imageUpload.jsx';
import BillItemsComp from './billItems/billItems.jsx';



const VendorBillform = ({ createNewVendorBill, selectedVendorBill, UpdateVendorBill, product_type }) => {
  
 
  // const schema = yup.object().shape({
  //   bill_number: yup.string().required("Bill number is required"),
  //   bill_amount: yup.number().required("Bill amount is required"),
  //   bill_date: yup.date().required("Bill date is required"),
  //   images: yup.array().min(1, 'Min one image is required').required("Images are required"),
  //   note: yup.string(),
  //   items: yup.array().of(
  //     yup.object().when('product_type', {
  //       is: 'glass products',
  //       then:()=> yup.object().shape({
  //         glass_inventory_id: yup.number().integer().required(),
  //         quantity: yup.number().moreThan(0, "quantity should be greater than zero").required(),
  //       }),
  //       otherwise:()=>yup.object().when('product_type', {
  //         is: 'glass accessories',
  //         then:()=> yup.object().shape({
  //           glass_accessory_id: yup.number().integer().required(),
  //           quantity: yup.number().moreThan(0, "quantity should be greater than zero").required(),
  //         }),
  //       otherwise:()=> yup.object().shape({
  //           other_products_id: yup.number().integer().required(),
  //           quantity: yup.number().moreThan(0, "quantity should be greater than zero").required(),
  //         }),
  //       }),
  //     })
  //   ),
  // });

   // Define a schema resolver function to dynamically generate the Yup schema
   const schemaResolver = (product_type) => {
    return yup.object().shape({
      bill_number: yup.string().required("Bill number is required"),
      bill_amount: yup.number().required("Bill amount is required"),
      bill_date: yup.date().required("Bill date is required"),
      images: yup.array().min(1, 'Min one image is required').required("Images are required"),
      note: yup.string(),
      items: yup.array().of(
        yup.object().shape({
          quantity: yup.number().moreThan(0, "quantity should be greater than zero").required("Quantity is required"),
          ...(product_type === 'glass products' && {
            glass_inventory_id: yup.number().integer().required("Glass inventory ID is required"),
          }),
          ...(product_type === 'glass accessories' && {
            glass_accessory_id: yup.number().integer().required("Glass accessory ID is required"),
          }),
          ...(product_type === 'other products' && {
            other_products_id: yup.number().integer().required("Other product ID is required"),
          }),
        })
      ),
    });
  };

  const { register, handleSubmit, formState, reset,  getValues, control } = useForm({
    resolver: yupResolver(schemaResolver(product_type)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        bill_number: "",
        bill_amount: 0,
        bill_date: "",
        images: [],
        note: "",
        items: []
    }

  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedVendorBill)
    if(selectedVendorBill){
   
      reset({

        bill_number: selectedVendorBill.bill_number,
        bill_amount: selectedVendorBill.bill_amount,
        bill_date: selectedVendorBill.bill_date,
        images: selectedVendorBill.images,
        note: selectedVendorBill.note,
        items: selectedVendorBill.items
        
      })
    }

  }, [selectedVendorBill, reset])



 

console.log(errors, product_type, selectedVendorBill)

  return (
    
    <form className='formclass' onSubmit={handleSubmit(data=>selectedVendorBill?UpdateVendorBill({data, Billid:`${selectedVendorBill.id}`}):createNewVendorBill(data))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px"}}>
        <div className='formheading'>{selectedVendorBill?'Update bill': 'Add bill'}</div>
     <div style={{display:"flex", gap:"20px"}}>
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="bill_number"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Bill number"
            direction="row"
            type="text"
            placeholder=""
          />

            

            
             <Controller
            name="bill_date"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (
              
             
            <Calendarform

             name='bill_date'
             label='Bill date'
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
          name="items"
          control={control}
          rules={{ required: true }}
       

          render={({ field }) => (
           <BillItemsComp onChange={field.onChange} value={field.value} product_type={product_type} />
          )}
        />
           



           <Labelwithtextfield
            register={register}
            errors={errors}
            name="bill_amount"
            labelclassname="formlabel"
            textfieldclassname="primarytextfieldclass"
            divclassname="primarytextdivclass"
            defaultValue=""
            label="Bill amount"
            direction="row"
            type="number"
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
        <button  type="submit"  className='secondarybtn' disabled={!isDirty || !isValid || isSubmitting || getValues('images').length===0}>
        {selectedVendorBill?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



VendorBillform.propTypes = {
  
  createNewVendorBill: PropTypes.func.isRequired,
  selectedVendorBill: PropTypes.object.isRequired,
  UpdateVendorBill: PropTypes.func.isRequired,
  product_type: PropTypes.string.isRequired

};

export default VendorBillform;
