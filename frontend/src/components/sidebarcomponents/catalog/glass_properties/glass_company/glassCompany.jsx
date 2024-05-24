import { useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import GlassCompanyform from './glassCompanyform';
import { Axios } from "../../../../../../utils/axios.mjs";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";


const GlassCompany = () => {
    const [openglassCompanyForm, setOpenglassCompanyForm] = useState(false);
    const [allglassCompanyinfo, setallglassCompanyinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassCompany, setselectedglassCompany] = useState(null);

    const createNewglassCompany = async(glassCompany) => {
      try {
        let body = {
          glassCompany
       
        }
        let res = await Axios.post(`/glassCompany/add`, body )

        if(res.data.success){
          getAllglassCompany()
          setOpenglassCompanyForm(false)
        }

      } catch (error) {
        console.log(error)
      }
    }

    const getAllglassCompany = async() => {
      try {
        let res = await Axios.get(`/glassCompany/getall`)
        if(res.data.success){
          console.log(res.data.data)
          let glassCompanyarr = [...res.data.data]
          setallglassCompanyinfo(glassCompanyarr)
          let tableobj = convertDataForTable(glassCompanyarr);
          settableData(tableobj)
        }
      } catch (error) {
        console.log(error)
      }
    }

  const convertDataForTable = (data) => {
    let glassCompanyarr = [...data]
    const header =  [{
      "columnName": "Company",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted":null
    }]
    
    const rows = glassCompanyarr.map((obj, index) => {
        let row = [];
        Object.entries(obj).forEach(([key, value]) => {
        if(key==='glass_company'){
         row.push({ key, value, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
        }
      
      })
      return row
    

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Company)=>glassCompanyFormOpen(Company, glassCompanyarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Company: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Company)=>DeleteglassCompany(Company, glassCompanyarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Company: "#3f3f3f",
    cursor: "pointer",
  }}
/>}]


const groupFunctions = [];
const name = 'glassCompany'

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }

    const DeleteglassCompany = async(Company, glassCompanyarr) => {
      try {
        const selctedglassCompanyRow = glassCompanyarr.filter((row)=>row.id===Company[0].id)[0] || null
        if(!selctedglassCompanyRow){
          console.log(selctedglassCompanyRow)
          return 
        }
        let res = await Axios.delete(`/glassCompany/delete?glassCompanyid=${selctedglassCompanyRow.id}`)
        if(res.data.success){
          getAllglassCompany()
          
        }
      } catch (error) {
        console.log(error)
      }
    }

    const UpdateglassCompany = async(Company) => {
      console.log(Company)
      try {
        let body = {
          glassCompanyid: `${Company.glassCompanyid}`, 
          glassCompany: Company.glassCompany
        }
        let res = await Axios.post(`/glassCompany/update`, body)
        if(res.data.success){
          getAllglassCompany()
          setselectedglassCompany(null)
          setOpenglassCompanyForm(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassCompanyFormOpen = (glassCompany,glassCompanyarr) => {
      console.log(glassCompany, glassCompanyarr, tableData)
      const selctedglassCompanyRow = glassCompanyarr.filter((row)=>row.id===glassCompany[0].id)[0] || null
      console.log(selctedglassCompanyRow)
      setselectedglassCompany(selctedglassCompanyRow)
      setOpenglassCompanyForm(true)

    }

    useEffect(() => {
      getAllglassCompany()
    },[])

    console.log(allglassCompanyinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassCompanyForm} setOpen={setOpenglassCompanyForm} buttontext="Add company" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassCompanyform
                {...props}
                createNewglassCompany={createNewglassCompany}
                selectedglassCompany={selectedglassCompany}
                UpdateglassCompany={UpdateglassCompany}
              />
            )}
         </DialogDemo>
         </div>
         </div>
         
       { tableData && <Table data={tableData} /> }

        
        </div>
    )
}


export default GlassCompany;