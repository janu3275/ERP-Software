import PropTypes from 'prop-types';
import "./Dileverypop.css";
import { Axios } from "../../../../../../../utils/axios.mjs";
import { useEffect, useState } from "react";
import SelectDemo from "../../../../../../assets/singlecomponents/select/select";
import Stextfield from '../../../../../../assets/singlecomponents/singletextfield/stextfield';

const Dileverypop = ({ handleVehichleTypeField, handleDistanceField, generalInfo }) => {

  const [glassDileveryinfo, setallglassDileveryinfo]  = useState([]);
  const [vehichleitems, setvehichleitems] = useState([]);


  const getAllglassDilevery = async() => {

      try {
        let res = await Axios.get(`/glassDilevery/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassDileveryarr = [...res.data.data]
          setallglassDileveryinfo(glassDileveryarr)
          let arr = [...res.data.data];
          let newarr = arr.map((item) => {
            return {
              label: item.vehicle_type,
              value: item.vehicle_type,
            };
          });
  
          const items = [
            {
              label: "Vehichle type",
              items: newarr,
            },
          ];
  
          setvehichleitems(items);
        }
      } catch (error) {
        console.log(error)
      }

    }

    

  

    useEffect(() => {
      getAllglassDilevery()
    },[])




    return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"25rem"}} >
           <SelectDemo
            placeholder="Choose vehichle type"
            divclassname="dileverselect"
            triggerclassname=""
            groups={vehichleitems}
            label="Vehichle type"
            onChange={(e)=>handleVehichleTypeField(e, glassDileveryinfo)}
            value={generalInfo.payment.DileveryCharge.vehichleType}
            name="vehichleType"
            index={-1}
            error={undefined}
          />

        <Stextfield
          name='distace'
          label="Distance"
          value={generalInfo.payment.DileveryCharge.distance}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder=".. in km"
          onChange={(e)=>handleDistanceField(e, glassDileveryinfo)}
          index={-1}
          error={undefined}
        />

    </div>

    )
}



Dileverypop.propTypes = {
  handleVehichleTypeField: PropTypes.func.isRequired,
  handleDistanceField: PropTypes.func.isRequired,
  generalInfo: PropTypes.any.isRequired
};


export default Dileverypop;