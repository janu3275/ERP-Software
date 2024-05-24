import PropTypes from 'prop-types';

import "./Fittingpop.css";
import { Axios } from "../../../../../../../utils/axios.mjs";
import { useEffect, useState } from "react";
import Stextfield from '../../../../../../assets/singlecomponents/singletextfield/stextfield';

const Fittingpop = ({setGeneralInfo, generalInfo }) => {

  const [glassFittinginfo, setallglassFittinginfo]  = useState([]);




  const getAllglassFitting = async() => {

      try {
        let res = await Axios.get(`/glassFitting/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassFittingarr = [...res.data.data]
          setallglassFittinginfo(glassFittingarr)
         
        }
      } catch (error) {
        console.log(error)
      }

    }

    const handlePersonsField = (e) => {

     const persons = e.target.value 

       setGeneralInfo((prev) => {
            return {
              ...prev,
              payment: {
                ...prev.payment,
                fittingCharge: {
                    ...prev.payment.fittingCharge,
                    noOfPersons: persons,
                    total: parseFloat(persons)*parseFloat(prev.payment.fittingCharge.noofHours)*glassFittinginfo[0]?.rate_per_hour_per_person || 0
                }
              },
            };
          })

    }

   

    const handleHoursField = (e) => {

        const hours = e.target.value;
     

          setGeneralInfo((prev) => {
            return {
              ...prev,
              payment: {
                ...prev.payment,
                fittingCharge: {
                    ...prev.payment.fittingCharge,
                    noofHours: hours,
                    total: parseFloat(prev.payment.fittingCharge.noOfPersons)*parseFloat(hours)*glassFittinginfo[0]?.rate_per_hour_per_person || 0
                }
              },
            };
          })


    }

    useEffect(()=>{
      getAllglassFitting()
    },[])




    return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"25rem"}} >
      

        <Stextfield
          name='persons'
          label="No. of labourers"
          value={generalInfo.payment.fittingCharge.noOfPersons}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder="number"
          onChange={handlePersonsField}
          index={-1}
          error={undefined}
        />


       <Stextfield
          name='distace'
          label="No. of hours"
          value={generalInfo.payment.fittingCharge.noofHours}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder=".. in hours"
          onChange={handleHoursField}
          index={-1}
          error={undefined}
        />

    </div>
    )
}



Fittingpop.propTypes = {
    setGeneralInfo: PropTypes.func.isRequired,
    generalInfo: PropTypes.any.isRequired
};


export default Fittingpop;