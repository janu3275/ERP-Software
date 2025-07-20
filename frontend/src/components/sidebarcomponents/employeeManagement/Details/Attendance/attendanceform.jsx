import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PropTypes from "prop-types";
import { useEffect} from 'react';
import Labelwithtextarea from '../../../../../assets/formcomponents/textarea.jsx';
import Calendarform from '../../../../../assets/formcomponents/calender/calender.jsx';
import SingleSelectDemo from '../../../../../assets/formcomponents/select.jsx';
import { statusItems } from '../../../orders/allOrders/staticOptions.jsx';
import { Icon } from '@iconify/react/dist/iconify.js';
import { returnConvertedDate } from '../../../../../commonfn.jsx';



const Attendanceform = ({ selectedAttendance, UpdateAttendance}) => {
  
 
  const schema = yup.object().shape({
    attendance_date: yup.date().required("attendance date is required"),
    attendance_status: yup.string().required("attendance status is required"),
    note: yup.string()
  });

  const { register, handleSubmit, formState, reset, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
        
        
        attendance_date: "",
        attendance_status:"",
        note: "",
    }
  });


  const { isSubmitting, isDirty, isValid, errors } = formState;



  useEffect(() => {
    
    console.log(selectedAttendance)
    if(selectedAttendance){
   
      reset({

        attendance_date: selectedAttendance.attendance_date,
        attendance_status: selectedAttendance.attendance_status,
        note: selectedAttendance.note,
        
      })
    }
  },[selectedAttendance, reset])

 

 

console.log(errors)

  return (
    
    <form className='formclass' onSubmit={handleSubmit(data=>UpdateAttendance({data, attendanceid:`${selectedAttendance.id}`}))}>
       <div style={{ flexDirection: "column", display: "flex" , width:"fit-content", margin:"0px 20px", marginTop:"0", marginBottom:"70px", gap:"10px"}}>
        <div className='formheading'><Icon
      icon="icon-park-outline:people-bottom"
      style={{
        width: "1.5rem",
        height: "1.5rem",
        color: "rgb(60, 137, 255)",
        cursor:"pointer"
        
        }}
    />{selectedAttendance?'Update attendance': 'Add attendance'} </div>
    <div style={{marginBottom:"10px", fontWeight:"500", fontSize:"medium"}}>{returnConvertedDate(selectedAttendance?.attendance_date??'')}</div>
     <div style={{display:"flex", gap:"20px", justifyContent:"space-between"}}>
       

            
          {/* <Controller
            name="attendance_date"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (

            <Calendarform

             name='attendance_date'
             label='Date'
             disable={true}
             labelclassname = "formlabel"
             divclassname = "primarytextdivclass"
             value = {field.value}
             errors={errors}
             forwardedRef={field.ref}

            {...field}

             />
             )}

          /> */}


          <Controller
            
            name="attendance_status"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose Type"
                groups={statusItems}
                label='Status'
                labelclassname = "formlabel"
                divclassname='primarytextdivclass'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />

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
          />
          
         
         
        

        </div>
        <div className='formbottomdiv' >
        <button  type="submit"  className='secondarybtn' disabled={!isDirty || !isValid || isSubmitting }>
        {selectedAttendance?'Update': 'Save'}
      </button>
      </div>
    </form>
  );
};



Attendanceform.propTypes = {
  

  selectedAttendance: PropTypes.object.isRequired,
  UpdateAttendance: PropTypes.func.isRequired

};

export default Attendanceform;
