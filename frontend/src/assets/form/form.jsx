import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller } from "react-hook-form";


import * as yup from 'yup';
import Labelwithtextfield from '../formcomponents/textfield.jsx';
import SingleSelectDemo from '../formcomponents/select';
import CheckboxDemo from '../formcomponents/checkbox';
import SwitchDemo from '../formcomponents/switch.jsx';


const MyForm = () => {

 const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    singleselect: yup.string().required()
  });

  const { register, handleSubmit, formState, control } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {},
  });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  const items = [
    {
      label: "Types",
      items: [
        { label: "number", value: "number" },
        { label: "boolean", value: "boolean" },
        { label: "text", value: "text" },
      ],
    },
  ];

  return (
    
    <form onSubmit={handleSubmit(data=>console.log(data))}>
       <div style={{ gap: "15px", flexDirection: "column", display: "flex" }}>
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="firstName"
            defaultValue=""
            label="First Name"
            direction="row"
            type="text"
          />
          <Labelwithtextfield
            register={register}
            errors={errors}
            name="lastName"
            defaultValue=""
            label="Last Name"
            direction="column"
            type="number"
          />
           <Controller
            name="hold"
            control={control}
            rules={{ required: true }}
            defaultValue={false}
            
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
           <SwitchDemo
           label="Enable hold"
           value={field.value}
           forwardedRef={field.ref}
           {...field}
            
           />
          )}
          />
          <Controller
            
            name="singleselect"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <SingleSelectDemo
                placeholder="Choose Type"
                groups={items}
                label='Value Type'
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />
          <Controller
            name="checkbox"
            control={control}
            rules={{ required: true }}
            defaultValue={false}
            
            render={({ field }) => (
              // fieldState: { invalid, isTouched, isDirty, error },
              <CheckboxDemo
                label="Jasmeets166@gmail.com"
                value={field.value}
                forwardedRef={field.ref}
                errors={errors}
                {...field}
              />
            )}
          />

        </div>
      <button style={{marginTop:"10px"}} type="submit" disabled={!isDirty || !isValid || isSubmitting}>
        Submit
      </button>
    </form>
  );
};




export default MyForm;
