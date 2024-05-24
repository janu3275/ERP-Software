import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";


import GlassDileveryform from './dileveryform';
import { Axios } from "../../../../../../utils/axios.mjs";
import { generateRandomId } from "../../../../../commonfn";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";


const GlassDilevery = () => {
    const [openglassDileveryForm, setOpenglassDileveryForm] = useState(false);
    const [allglassDileveryinfo, setallglassDileveryinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassDilevery, setselectedglassDilevery] = useState(null);

    const createNewglassDilevery = async (data) => {

      try {

        let body = {
           ...data
        }

        let res = await Axios.post(`/glassDilevery/add`, body )

        if(res.data.success){
          getAllglassDilevery()
          setOpenglassDileveryForm(false)
        }

      } catch (error) {
        console.log(error)
      }

    }

    const getAllglassDilevery = async() => {
      try {
        let res = await Axios.get(`/glassDilevery/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassDileveryarr = [...res.data.data]
          setallglassDileveryinfo(glassDileveryarr)
          let tableobj = convertDataForTable(glassDileveryarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassDileveryarr = [...data]
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
        "columnName": "Vehicle type",
        "type": "number",
        "colNo": 3,
        "width": 150,
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
    
      glassDileveryarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.service_name){
            row.push({ key:'Service_name', value:obj.service_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.description){
            row.push({ key:'description', value: obj.description, type:'string', width:300, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.vehicle_type){
            row.push({ key:'vehicle_type', value: obj.vehicle_type, type:'string', width:150, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.rate_per_km){
            row.push({ key:'rate_per_km', value: obj.rate_per_km, type:'number', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         
      if(row.length==4){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Dilevery)=>glassDileveryFormOpen(Dilevery, glassDileveryarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Dilevery: "#3f3f3f",
      cursor: "pointer"
    }}
     />}, {funcName:'delete', funct:(Dilevery)=>DeleteglassDilevery(Dilevery, glassDileveryarr), icon: <Icon
     icon="mi:edit-alt"
     style={{
     width: "1.2rem",
     height: "1.2rem",
     Dilevery: "#3f3f3f",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = generateRandomId(10)

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassDilevery = async(Dilevery, glassDileveryarr) => {
      try {
        const selctedglassDileveryRow = glassDileveryarr.filter((row)=>row.id===Dilevery[0].id)[0] || null
        if(!selctedglassDileveryRow){
          console.log(selctedglassDileveryRow)
          return 
        }
        let res = await Axios.delete(`/glassDilevery/delete?service_id=${selctedglassDileveryRow.id}`)
        if(res.data.success){
          getAllglassDilevery()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassDilevery = async({data, glassDileveryid}) => {
      console.log(data)
      try {
        let body = {
          service_id: `${glassDileveryid}`, 
          ...data
        }
        let res = await Axios.post(`/glassDilevery/update`, body)
        if(res.data.success){
          getAllglassDilevery()
          setselectedglassDilevery(null)
          setOpenglassDileveryForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassDileveryFormOpen = (glassDilevery,glassDileveryarr ) => {
      console.log(glassDilevery, glassDileveryarr, tableData)
      const selctedglassDileveryRow = glassDileveryarr.filter((row)=>row.id===glassDilevery[0].id)[0] || null
      console.log(selctedglassDileveryRow)
      setselectedglassDilevery(selctedglassDileveryRow)
      setOpenglassDileveryForm(true)

    }

    useEffect(() => {
      getAllglassDilevery()
    },[])

    console.log(allglassDileveryinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}>  
        <DialogDemo Open={openglassDileveryForm} setOpen={setOpenglassDileveryForm} buttontext="Add dilevery" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassDileveryform
                {...props}
                createNewglassDilevery={createNewglassDilevery}
                selectedglassDilevery={selectedglassDilevery}
                UpdateglassDilevery={UpdateglassDilevery}
              />
            )}
         </DialogDemo>
         </div>
       </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassDilevery;