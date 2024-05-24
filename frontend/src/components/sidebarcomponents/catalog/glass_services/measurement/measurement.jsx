import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";


import GlassMeasurementform from './measurementform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";


const GlassMeasurement = () => {
    const [openglassMeasurementForm, setOpenglassMeasurementForm] = useState(false);
    const [allglassMeasurementinfo, setallglassMeasurementinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassMeasurement, setselectedglassMeasurement] = useState(null);

    const createNewglassMeasurement = async ( data ) => {

      try {

        let body = {
          ...data
        }

        let res = await Axios.post(`/glassMeasurement/add`, body )

        if(res.data.success){
          getAllglassMeasurement()
          setOpenglassMeasurementForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllglassMeasurement = async() => {
      try {
        let res = await Axios.get(`/glassMeasurement/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassMeasurementarr = [...res.data.data]
          setallglassMeasurementinfo(glassMeasurementarr)
          let tableobj = convertDataForTable(glassMeasurementarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassMeasurementarr = [...data]
    const header =  [{
      "columnName": "Service name",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
      },
    {
        "columnName": "Description",
        "type": "string",
        "colNo": 2,
        "width": 300,
        "sorted":null
      },
     { 
        "columnName": "Rate per person per hour",
        "type": "number",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
      { 
        "columnName": "Rate per km",
        "type": "number",
        "colNo": 4,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      glassMeasurementarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.service_name){
            row.push({ key:'service_name', value:obj.service_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.description){
            row.push({ key:'description', value: obj.description, type:'string', width:300, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.rate_per_hour_per_person){
            row.push({ key:'rate_per_hour_per_person', value: obj.rate_per_hour_per_person, type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.rate_per_km){
            row.push({ key:'rate_per_km', value: obj.rate_per_km, type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         
      if(row.length==4){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Measurement)=>glassMeasurementFormOpen(Measurement, glassMeasurementarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Measurement: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Measurement)=>DeleteglassMeasurement(Measurement, glassMeasurementarr), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Measurement: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = 'glassMeasurement'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassMeasurement = async(Measurement, glassMeasurementarr) => {
      try {
        const selctedglassMeasurementRow = glassMeasurementarr.filter((row)=>row.id===Measurement[0].id)[0] || null
        if(!selctedglassMeasurementRow){
          console.log(selctedglassMeasurementRow)
          return 
        }
        let res = await Axios.delete(`/glassMeasurement/delete?service_id=${selctedglassMeasurementRow.id}`)
        if(res.data.success){
          getAllglassMeasurement()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassMeasurement = async({data, glassMeasurementid}) => {
      console.log(data)
      try {
        let body = {
          service_id: `${glassMeasurementid}`, 
          ...data
        }
        let res = await Axios.post(`/glassMeasurement/update`, body)
        if(res.data.success){
          getAllglassMeasurement()
          setselectedglassMeasurement(null)
          setOpenglassMeasurementForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassMeasurementFormOpen = (glassMeasurement,glassMeasurementarr ) => {
      console.log(glassMeasurement, glassMeasurementarr, tableData)
      const selctedglassMeasurementRow = glassMeasurementarr.filter((row)=>row.id===glassMeasurement[0].id)[0] || null
      console.log(selctedglassMeasurementRow)
      setselectedglassMeasurement(selctedglassMeasurementRow)
      setOpenglassMeasurementForm(true)

    }

    useEffect(() => {
      getAllglassMeasurement()
    },[])

    console.log(allglassMeasurementinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}>  
        <DialogDemo Open={openglassMeasurementForm} setOpen={setOpenglassMeasurementForm} buttontext="Add measurement" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassMeasurementform
                {...props}
                createNewglassMeasurement={createNewglassMeasurement}
                selectedglassMeasurement={selectedglassMeasurement}
                UpdateglassMeasurement={UpdateglassMeasurement}
              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassMeasurement;