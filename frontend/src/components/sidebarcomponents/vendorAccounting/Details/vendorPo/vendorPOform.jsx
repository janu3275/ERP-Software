import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Labelwithtextarea from "../../../../../assets/formcomponents/textarea.jsx";

import PoItemsComp from "./poItems/poItemsComp.jsx";
import { Icon } from "@iconify/react/dist/iconify.js";


const VendorPOform = ({
  createNewVendorPO,
  selectedVendorPO,
  UpdateVendorPO,
}) => {

  



  const schema = yup.object().shape({
    
    note: yup.string(),
    gls_items: yup
      .array()
      .of(
        yup.object().shape({
          glass_inventory_id: yup.number().required(),
          quantity: yup.number().moreThan(0, "quantity should be greater than zero").required(),
        })
      )
      .min(1, "min one item should be added")
      .required()
  });

  const { register, handleSubmit, formState, reset, getValues, control } =
    useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
       
        note: "",
        gls_items: []
      },
    });

  const { isSubmitting, isDirty, isValid, errors } = formState;

  useEffect(() => {
    console.log(selectedVendorPO);
    if (selectedVendorPO) {
      reset({
       
        gls_items: selectedVendorPO.gls_items,
        note: selectedVendorPO.note
      });
    }
  }, [selectedVendorPO, reset]);

 
//   const selectItems = (selectedInventoryItems) => {

//     let alreadySelectedItems = getValues('gls_items');

//     let newselectedItems = selectedInventoryItems.map((inventory) => {
//         let wasAlreadySelected = alreadySelectedItems.filter((item)=>item.glass_inventory_id===inventory.id)?.length>0?true:false

//         return {
//             glass_inventory_id: inventory.id,
//             quantity: wasAlreadySelected ? alreadySelectedItems.filter((item)=>item.glass_inventory_id===inventory.id)[0].quantity : 0

//         }
//     })

//     setValue('gls_items', newselectedItems)
   
// }


  console.log(errors);

  return (
    <form
      className="formclass"
      
      onSubmit={handleSubmit((data) =>
        selectedVendorPO
          ? UpdateVendorPO({ data, POid: `${selectedVendorPO.id}` })
          : createNewVendorPO(data)
      )}
    >
      <div
        style={{
          flexDirection: "column",
          display: "flex",
        //   width: "fit-content",
          margin: "0px 20px",
          marginTop: "0",
          marginBottom: "70px",
        }}
      >
        <div className="formheading">
        <Icon
  icon="ion:document-outline"
  style={{
    width: "1.8rem",
    height: "1.8rem",
    color: "rgb(60, 137, 255)",
    cursor:"pointer"
    
    }}
/>
          {selectedVendorPO ? "Update purchase order" : "Add purchase order"}
        </div>

       

     
      
       

        <Controller
          name="gls_items"
          control={control}
          rules={{ required: true }}
       

          render={({ field }) => (
           <PoItemsComp onChange={field.onChange} value={field.value} />
        
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
      <div className="formbottomdiv">
        <button
          type="submit"
          className="secondarybtn"
          disabled={
            !isDirty ||
            !isValid ||
            isSubmitting 
          }
        >
          {selectedVendorPO ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

VendorPOform.propTypes = {
  createNewVendorPO: PropTypes.func.isRequired,
  selectedVendorPO: PropTypes.object.isRequired,
  UpdateVendorPO: PropTypes.func.isRequired
};

export default VendorPOform;
