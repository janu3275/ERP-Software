import PropTypes from 'prop-types';

import "./Measurementpop.css";
import { Axios } from "../../../../../../../utils/axios.mjs";
import { useEffect, useState } from "react";
import Stextfield from '../../../../../../assets/singlecomponents/singletextfield/stextfield';

const Measurementpop = ({setGeneralInfo, generalInfo }) => {

  const [glassMeasurementinfo, setallglassMeasurementinfo]  = useState([]);




  const getAllglassMeasurement = async() => {

      try {
        let res = await Axios.get(`/glassMeasurement/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassMeasurementarr = [...res.data.data]
          setallglassMeasurementinfo(glassMeasurementarr)
         
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
                MeasurementCharge: {
                    ...prev.payment.MeasurementCharge,
                    noOfPersons: persons,
                    total: (parseFloat(persons)*parseFloat(prev.payment.MeasurementCharge.noofHours)*glassMeasurementinfo[0]?.rate_per_hour_per_person + parseFloat(prev.payment.MeasurementCharge.distance)*glassMeasurementinfo[0]?.rate_per_km) || 0
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
                MeasurementCharge: {
                    ...prev.payment.MeasurementCharge,
                    noofHours: hours,
                    total: (parseFloat(prev.payment.MeasurementCharge.noOfPersons)*parseFloat(hours)*glassMeasurementinfo[0]?.rate_per_hour_per_person + parseFloat(prev.payment.MeasurementCharge.distance)*glassMeasurementinfo[0]?.rate_per_km) || 0
                }
              },
            };
          })


    }

    const handleDistanceField = (e) => {

        const distance = e.target.value;
     
        setGeneralInfo((prev) => {
            return {
              ...prev,
              payment: {
                ...prev.payment,
                MeasurementCharge: {
                    ...prev.payment.MeasurementCharge,
                    distance: distance,
                    total: (parseFloat(prev.payment.MeasurementCharge.noOfPersons)*parseFloat(prev.payment.MeasurementCharge.noofHours)*glassMeasurementinfo[0]?.rate_per_hour_per_person + parseFloat(distance)*glassMeasurementinfo[0]?.rate_per_km) || 0
                }
              },
            };
          })

        }

    useEffect(() => {
      getAllglassMeasurement()
    },[])




    return (
    <div style={{display:"flex", flexDirection:"column", gap:"10px", width:"25rem"}} >
      

        <Stextfield
          name='persons'
          label="No. of labourers"
          value={generalInfo.payment.MeasurementCharge.noOfPersons}
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
          value={generalInfo.payment.MeasurementCharge.noofHours}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder=".. in hours"
          onChange={handleHoursField}
          index={-1}
          error={undefined}
        />

         <Stextfield
          name='distace'
          label="Distance "
          value={generalInfo.payment.MeasurementCharge.distance}
          type="number"
          labelclassname="sizelabelclass"
          textfieldclassname="primarytextfieldclass"
          divclassname="paymentdivclass"
          placeholder=".. in km"
          onChange={handleDistanceField}
          index={-1}
          error={undefined}
        />

    </div>
    )
}



Measurementpop.propTypes = {
    setGeneralInfo: PropTypes.func.isRequired,
    generalInfo: PropTypes.any.isRequired
};


export default Measurementpop;