import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";


import GlassCustomizationform from './customizationform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";

const GlassCustomization = () => {
    const [openglassCustomizationForm, setOpenglassCustomizationForm] = useState(false);
    const [allglassCustomizationinfo, setallglassCustomizationinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassCustomization, setselectedglassCustomization] = useState(null);

    const createNewglassCustomization = async ( data ) => {

      try {

        let body = {
          ...data
        }

        let res = await Axios.post(`/glassCustomization/add`, body )

        if(res.data.success){
          getAllglassCustomization()
          setOpenglassCustomizationForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

const getAllglassCustomization = async() => {
      try {
        let res = await Axios.get(`/glassCustomization/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassCustomizationarr = [...res.data.data]
          setallglassCustomizationinfo(glassCustomizationarr)
          let tableobj = convertDataForTable(glassCustomizationarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

const convertDataForTable = (data) => {
       let glassCustomizationarr = [...data]
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
        "columnName": "Rate per sqft",
        "type": "number",
        "colNo": 3,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      glassCustomizationarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.service_name){
            row.push({ key:'service_name', value:obj.service_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.description){
            row.push({ key:'description', value: obj.description, type:'string', width:300, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.rate_per_sqft){
            row.push({ key:'rate_per_sqft', value: obj.rate_per_sqft, type:'number', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         
      if(row.length==3){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'edit', funct:(Customization)=>glassCustomizationFormOpen(Customization, glassCustomizationarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Customization: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Customization)=>DeleteglassCustomization(Customization, glassCustomizationarr), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Customization: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = 'glassCustomization'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

const DeleteglassCustomization = async(Customization, glassCustomizationarr) => {
      try {
        const selctedglassCustomizationRow = glassCustomizationarr.filter((row)=>row.id===Customization[0].id)[0] || null
        if(!selctedglassCustomizationRow){
          console.log(selctedglassCustomizationRow)
          return 
        }
        let res = await Axios.delete(`/glassCustomization/delete?service_id=${selctedglassCustomizationRow.id}`)
        if(res.data.success){
          getAllglassCustomization()
          
        }
      } catch (error) {
        console.log(error)
      }
    }
    // service_id: Joi.number().integer().required(),
    // service_name: Joi.string().required(),
    // description: Joi.string().allow(null),
    // rate_per_sqft: Joi.number().required(),

const UpdateglassCustomization = async({data, glassCustomizationid}) => {
      console.log(data)
      try {
        let body = {
          service_id: `${glassCustomizationid}`, 
          ...data

        }
        let res = await Axios.post( `/glassCustomization/update`, body )
        if(res.data.success){
          getAllglassCustomization()
          setselectedglassCustomization(null)
          setOpenglassCustomizationForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

const glassCustomizationFormOpen = (glassCustomization,glassCustomizationarr ) => {
      console.log(glassCustomization, glassCustomizationarr, tableData)
      const selctedglassCustomizationRow = glassCustomizationarr.filter((row)=>row.id===glassCustomization[0].id)[0] || null
      console.log(selctedglassCustomizationRow)
      setselectedglassCustomization(selctedglassCustomizationRow)
      setOpenglassCustomizationForm(true)

    }

    useEffect(() => {
      getAllglassCustomization()
    },[])

    console.log(allglassCustomizationinfo)
    return (
        <div>
         <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassCustomizationForm} setOpen={setOpenglassCustomizationForm} buttontext="Add customization" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassCustomizationform
                {...props}
                createNewglassCustomization={createNewglassCustomization}
                selectedglassCustomization={selectedglassCustomization}
                UpdateglassCustomization={UpdateglassCustomization}
              />
            )}
         </DialogDemo>
         </div>
        </div>
         
       { tableData && <Table data={tableData} /> }

        
        </div>
    )
}


export default GlassCustomization;