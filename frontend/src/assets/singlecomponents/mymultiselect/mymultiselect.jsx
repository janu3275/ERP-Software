import PropTypes from "prop-types";
import "./mymultiselect.css";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import MemoSinglecheckbox from "./singlecheckbox";


const Mymultiselect = ({ options,name,editaction,chosenoptions, closeDialog }) => {
  const { register, handleSubmit, formState, control, setValue ,watch} = useForm();

  const { isSubmitting, isDirty, isValid, errors } = formState;

  const handleSelectAll = (e) => {
    const isChecked = e;
    options.forEach((checkbox) => {
      setValue(checkbox, isChecked);
    });
    setValue('Select All',e)
  };

  const handleCheckboxChange = (e,checkboxName) => {
    const isChecked = e ;
    setValue(checkboxName, isChecked);
    if(options.every((checkbox)=>watch(checkbox))){
      console.log("here")
      setValue('Select All',true)
    }else{
      console.log("here")
      setValue('Select All',false)
    }
  };

  const formsumbit = (data)=>{
  console.log(data)
  let newchoosenEmails = options.filter((option)=>data[option])
  console.log(newchoosenEmails)
  editaction(name, newchoosenEmails)
  closeDialog()
  }

  console.log(chosenoptions, options,name)
  return (
    <form onSubmit={handleSubmit(formsumbit)}>
      <div className="column-flex-div">
        <div className="two-column-div">
          {options.map((item, index) => (
            <div key={index} className="item">
              <Controller
                name={item}
                control={control}
                defaultValue={chosenoptions.includes(item)}
                render={({ field }) => (
                  <MemoSinglecheckbox
                    label={item}
                    value={field.value}
                    handleCheckboxChange={handleCheckboxChange}
                    
                  />
                )}
              />
            </div>
          ))}
        </div>
        <div style={{paddingLeft:"10px", paddingTop:"10px", borderTop:"solid 1px"}} className="row-flex-justifycontent-spacebetween">
          <Controller
            name="Select All"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <MemoSinglecheckbox
                label="Select All"
                handleSelectAll={handleSelectAll}
                value={field.value}
                
              />
            )}
          />

          <div  className="row-flex-justifycontent-spacebetween">
            <button onClick={() => handleSelectAll(false)} className="clearbtn">
              Clear
            </button>
            <button type="submit" disabled={isSubmitting} className="okbtn">
              Ok
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

Mymultiselect.propTypes = {
  options: PropTypes.array.isRequired,
  closeDialog: PropTypes.func,
  name:PropTypes.string,
  editaction:PropTypes.func,
  chosenoptions:PropTypes.array
};

export default Mymultiselect;
