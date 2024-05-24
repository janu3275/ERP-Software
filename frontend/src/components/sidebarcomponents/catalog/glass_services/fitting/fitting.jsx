import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";


import GlassFittingform from './fittingform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";

const GlassFitting = () => {
    const [openglassFittingForm, setOpenglassFittingForm] = useState(false);
    const [allglassFittinginfo, setallglassFittinginfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassFitting, setselectedglassFitting] = useState(null);

    const createNewglassFitting = async ( data ) => {

      try {

        let body = {
          ...data
        }

        let res = await Axios.post(`/glassFitting/add`, body )

        if(res.data.success){
          getAllglassFitting()
          setOpenglassFittingForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllglassFitting = async() => {
      try {
        let res = await Axios.get(`/glassFitting/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassFittingarr = [...res.data.data]
          setallglassFittinginfo(glassFittingarr)
          let tableobj = convertDataForTable(glassFittingarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassFittingarr = [...data]
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
        "columnName": "Rate per hour per person",
        "type": "number",
        "colNo": 3,
        "width": 100,
        "sorted":null
      }]
    
      let rows = []
    
      glassFittingarr.forEach((obj, index) => {
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
         
      if(row.length==3){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Fitting)=>glassFittingFormOpen(Fitting, glassFittingarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Fitting: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Fitting)=>DeleteglassFitting(Fitting, glassFittingarr), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Fitting: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = 'glassFitting'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassFitting = async(Fitting, glassFittingarr) => {
      try {
        const selctedglassFittingRow = glassFittingarr.filter((row)=>row.id===Fitting[0].id)[0] || null
        if(!selctedglassFittingRow){
          console.log(selctedglassFittingRow)
          return 
        }
        let res = await Axios.delete(`/glassFitting/delete?service_id=${selctedglassFittingRow.id}`)
        if(res.data.success){
          getAllglassFitting()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassFitting = async({data, glassFittingid }) => {
      console.log(data)
      try {
        let body = {
          service_id: `${glassFittingid}`, 
          ...data
        }
        let res = await Axios.post(`/glassFitting/update`, body)
        if(res.data.success){
          getAllglassFitting()
          setselectedglassFitting(null)
          setOpenglassFittingForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassFittingFormOpen = ( glassFitting,glassFittingarr ) => {
      console.log(glassFitting, glassFittingarr, tableData)
      const selctedglassFittingRow = glassFittingarr.filter((row)=>row.id===glassFitting[0].id)[0] || null
      console.log(selctedglassFittingRow)
      setselectedglassFitting(selctedglassFittingRow)
      setOpenglassFittingForm(true)

    }

    useEffect(() => {
      getAllglassFitting()
    },[])

    console.log(allglassFittinginfo)

    return (

        <div>
         <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassFittingForm} setOpen={setOpenglassFittingForm} buttontext="Add fitting" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassFittingform
                {...props}
                createNewglassFitting={createNewglassFitting}
                selectedglassFitting={selectedglassFitting}
                UpdateglassFitting={UpdateglassFitting}
              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassFitting;