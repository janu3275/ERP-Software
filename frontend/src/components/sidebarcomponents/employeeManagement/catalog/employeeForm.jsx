import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Labelwithtextfield from "../../../../assets/formcomponents/textfield.jsx";
import Calendarform from "../../../../assets/formcomponents/calender/calender.jsx";
import Labelwithtextarea from "../../../../assets/formcomponents/textarea.jsx";
import SingleSelectDemo from "../../../../assets/formcomponents/select.jsx";
import { bankItems } from "../../orders/allOrders/staticOptions.jsx";
import ProfileImageUpload from "../../../../assets/formcomponents/singleImageUpload/profileImageUpload.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";

const Employeeform = ({
  createNewEmployee,
  selectedEmployee,
  UpdateEmployee,
  posItems,
  departItems
}) => {
  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email format"),
    phone_number: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "Phone number must be in Indian format"),
    whatsapp_number: yup
      .string()
      .matches(/^[6-9]\d{9}$/, "WhatsApp number must be in Indian format"),
    date_of_birth: yup.date().nullable(),
    address: yup.string(),
    city: yup.string(),
    state_province: yup.string(),
    country: yup.string(),
    postal_code: yup.string(),
    department_name: yup.string(),
    position_name: yup.string(),
    emergency_contact_name: yup.string(),
    emergency_contact_phone: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Emergency contact phone number must be in Indian format"
      ),
    employee_photo: yup.object().nullable(),
    bank: yup.string(),
    account_number: yup.string(),
    ifsc_code: yup.string(),
    salary: yup.number(),
    notes_comments: yup.string(),
  });

  const { register, handleSubmit, formState, reset, control, setValue } =
    useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        whatsapp_number: "",
        date_of_birth: "",
        address: "",
        city: "",
        state_province: "",
        country: "",
        postal_code: "",
        department_name: "",
        position_name: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        employee_photo: "",
        bank: "",
        account_number: "",
        ifsc_code: "",
        salary: "",
        notes_comments: "",
      },
    });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(selectedEmployee);
    if (selectedEmployee) {
      reset({
        first_name: selectedEmployee.first_name,
        last_name: selectedEmployee.last_name,
        email: selectedEmployee.email,
        phone_number: selectedEmployee.phone_number,
        whatsapp_number: selectedEmployee.whatsapp_number,
        date_of_birth: selectedEmployee.date_of_birth,
        address: selectedEmployee.address,
        city: selectedEmployee.city,
        state_province: selectedEmployee.state_province,
        country: selectedEmployee.country,
        postal_code: selectedEmployee.postal_code,
        department_name: selectedEmployee.department_name,
        position_name: selectedEmployee.position_name,
        emergency_contact_name: selectedEmployee.emergency_contact_name,
        emergency_contact_phone: selectedEmployee.emergency_contact_phone,
        employee_photo: selectedEmployee.employee_photo[0]|| null,
        bank: selectedEmployee.bank,
        account_number: selectedEmployee.account_number,
        ifsc_code: selectedEmployee.ifsc_code,
        salary: selectedEmployee.salary,
        notes_comments: selectedEmployee.notes_comments,
      });
    }
  }, [selectedEmployee, reset]);

  console.log(isDirty, isValid, isSubmitting);

  return (
    <form
     className="normalDialogForm"
      onSubmit={handleSubmit((data) =>
        selectedEmployee
          ? UpdateEmployee({ data, Employeeid: `${selectedEmployee.id}` })
          : createNewEmployee(data)
      )}
    >
      
    <div style={{ gap: "20px", flexDirection: "column", display: "flex", marginBottom:"150px" , padding:"0px 100px"}}>
     <div className="formtitle"><Icon
  icon="akar-icons:person"
  style={{
    width: "1.8rem",
    height: "1.8rem",
    color: "rgb(60, 137, 255)",
    cursor:"pointer"
    
    }}
/>{selectedEmployee?"Update employee":"Add employee"}</div>
      <div className="primaryformsection">
        <div className="primaryformsectiontitle">Personal details</div>
        <div className="primaryformsectioncontent">
        <div style={{display:"flex", gap:"20px", alignItems:"center"}}>
     
            


              <Controller
            name="employee_photo"
            control={control}
            rules={{ required: true }}
            // defaultValue={null}
            
            render={({ field }) => (
              
             
            <ProfileImageUpload

             name='employee_photo'
             value = {field.value}
             errors={errors}
             onChange = {field.onChange}
             forwardedRef={field.ref}

            {...field}

            />

           
             )}
          />
        <Labelwithtextfield
          register={register}
          errors={errors}
          name="first_name"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="First name"
          direction="row"
          type="text"
          placeholder="Employee name"
        />
        <Labelwithtextfield
          register={register}
          errors={errors}
          name="last_name"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Last name"
          direction="row"
          type="text"
          placeholder="Employee name"
        />
       
      </div>
      <div style={{display:"flex", gap:"20px"}}>
      <Controller
          name="date_of_birth"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Calendarform
              name="date_of_birth"
              label="Date of birth"
              labelclassname="formlabel"
              divclassname="primarytextdivclass"
              disable={false}
              value={field.value}
              errors={errors}
              forwardedRef={field.ref}
              {...field}
            />
          )}
        />
      <Labelwithtextfield
          register={register}
          errors={errors}
          name="email"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Email"
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
          type="number"
          placeholder=""
        />

       

     
        </div>

        <div style={{display:"flex", gap:"20px"}}>
        <Labelwithtextfield
          register={register}
          errors={errors}
          name="emergency_contact_name"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Emergency contact name"
          direction="row"
          type="text"
          placeholder="Extra information"
        />

        <Labelwithtextfield
          register={register}
          errors={errors}
          name="emergency_contact_phone"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Emergency contact phone"
          direction="row"
          type="number"
          placeholder="Extra information"
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
       <div style={{display:"flex", gap:"20px"}}>
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
          type="text"
          placeholder="Extra information"
        />
        </div>
        </div>
        </div>
       
       
        <div className="primaryformsection">
        <div className="primaryformsectiontitle">Office details</div>
        <div className="primaryformsectioncontent">
        <div style={{display:"flex", gap:"20px"}}>
        <Controller
          name="position_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SingleSelectDemo
              placeholder="Choose position"
              groups={posItems}
              label="Position"
              divclassname="primarytextdivclass"
              labelclassname = "formlabel"
              forwardedRef={field.ref}
              errors={errors}
              {...field}
            />
          )}
        />

        <Controller
          name="department_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SingleSelectDemo
              placeholder="Choose department"
              groups={departItems}
              label="Department"
              divclassname="primarytextdivclass"
              labelclassname = "formlabel"
              forwardedRef={field.ref}
              errors={errors}
              {...field}
            />
          )}
        />

        <Labelwithtextfield
          register={register}
          errors={errors}
          name="salary"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Salary ( in Rs )"
          direction="row"
          type="number"
          placeholder="Extra information"
        />

        </div>
        </div>
        </div>
        <div className="primaryformsection">
        <div className="primaryformsectiontitle">Bank details</div>
        <div className="primaryformsectioncontent">
        <div style={{display:"flex", gap:"20px"}}>
        

        <Controller
          name="bank"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SingleSelectDemo
              placeholder="Choose bank"
              groups={bankItems}
              label="Bank"
              divclassname="primarytextdivclass"
              labelclassname = "formlabel"
              forwardedRef={field.ref}
              errors={errors}
              {...field}
            />
          )}
        />

        <Labelwithtextfield
          register={register}
          errors={errors}
          name="account_number"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="Account number"
          direction="row"
          type="number"
          placeholder="Extra information"
        />

       <Labelwithtextfield
          register={register}
          errors={errors}
          name="ifsc_code"
          labelclassname="formlabel"
          textfieldclassname="primarytextfieldclass"
          divclassname="primarytextdivclass"
          defaultValue=""
          label="IFSC Code"
          direction="row"
          type="text"
          placeholder="Extra information"
        />
        </div>
        </div>
        </div>
        <Labelwithtextarea
          register={register}
          errors={errors}
          name="notes_comments"
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
          {selectedEmployee ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

Employeeform.propTypes = {
  createNewEmployee: PropTypes.func.isRequired,
  selectedEmployee: PropTypes.object.isRequired,
  UpdateEmployee: PropTypes.func.isRequired,
  posItems: PropTypes.object.isRequired,
  departItems: PropTypes.object.isRequired,
};

export default Employeeform;
