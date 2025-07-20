import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Employeeform from "./employeeForm";
import DialogDemo from "../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../commoncomponents/tableComponent/table";
import { Axios } from "../../../../../utils/axios.mjs";
import { bankItems } from "../../orders/allOrders/staticOptions";
import { returnAllemployee, returnConvertedDate, returnItems } from "../../../../commonfn";
import StackedImages from "../../../../assets/singlecomponents/stackedimages/stackedimages";
import { useQueryClient } from "@tanstack/react-query";
import { useGetDepartments, useGetPositions} from "../../commonQueryHooks";
import { useAddEmployee, useDeleteEmployee, useGetEmployees, useUpdateEmployee } from "./employeeCatalogQueryHooks";


const Employee = () => {
  
    const [openemployeeForm, setOpenemployeeForm] = useState(false);
    // const [allemployeeinfo, setallemployeeinfo] = useState([]);
    // const [tableData, settableData] = useState(null);
    const [selectedEmployee, setselectedEmployee] = useState(null);
    // const [posAndDepartArr, setposAndDepartArr] = useState({
    //     posItems:[],
    //     DepartItems:[]
    // });

    const queryClient = useQueryClient();

    const returnTableData = ( data, positems, departitems ) => {
      console.log("🚀 ~ returnTableData ~ data:", data, positems, departitems)
      if(!data){
        return null
      }
      const tableobj = convertDataForTable(data, positems, departitems);
      return tableobj
     
    }

    const addEmployeeSuccessfn = () => {
      // Invalidate or refetch the Employee list query
      queryClient.invalidateQueries({ queryKey : ['Employees'] });
      // Close the Employee form
      setOpenemployeeForm(false)
    }

    const updateEmployeeSuccessfn = () => {
       // Invalidate or refetch the Employee list query
       queryClient.invalidateQueries({ queryKey:['Employees'] });
       setselectedEmployee(null)
       // Close the Employee form
       setOpenemployeeForm(false);

    }

    const deleteEmployeeSuccessfn = () => {
      // Invalidate or refetch the Employee list query
      queryClient.invalidateQueries({ queryKey:['Employees'] });

    }

    const { data: posArr , error: getposerr, isLoading: getposIsLoading } = useGetPositions();
    const posItems = posArr ? returnItems(posArr, 'position_name', 'position_name', 'Positions'): null

    const { data: departmentArr , error: getdepartmenterr, isLoading: getdepartmentIsLoading } = useGetDepartments();
    const departItems = departmentArr ? returnItems(departmentArr, 'department_name', 'department_name', 'Departments'): null;

    const { data: allemployeeinfo, error: getEmployeeerr, isLoading: getEmployeeIsLoading } = useGetEmployees();
  
    const { mutate: triggerCreateEmployee , error: addEmployeeerr, isLoading: addEmployeeIsLoading } = useAddEmployee(addEmployeeSuccessfn);

    const { mutate: triggerUpdateEmployee , error: updateEmployeeerr, isLoading: updateEmployeeIsLoading } = useUpdateEmployee(updateEmployeeSuccessfn);

    const { mutate: triggerDeleteEmployee , error: deleteEmployeeerr, isLoading: deleteEmployeeIsLoading } = useDeleteEmployee(deleteEmployeeSuccessfn);


    // const createNewemployee = async (data) => {
    //   console.log(data)
    //   const position = data.position_name
    //   const positionid = returnPositionid(position, posAndDepartArr.posItems)
    //   const department = data.department_name
    //   const departmentid = returnDepartmentid(department, posAndDepartArr.DepartItems)


    //   if(!positionid || !departmentid){
    //       console.log("no position or department id found")
    //       return 
    //   }

    //   try {

    //     let body = {
    //       ...data,
    //       position_id:positionid,
    //       department_id: departmentid
    //     }

    //     let res = await Axios.post(`/employee/add`, body )

    //     if(res.data.success){
    //       getDataAndRefreshTable()
    //       setOpenemployeeForm(false)
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }

    // }

   

    const returnPositionid = (position, items) => { 
        console.log(position, items)
        const positionid = items[0].items.filter((item)=>item.value===position)[0].id
        if(positionid){
            return positionid
        }
        return null
    }

    const returnDepartmentid = (department, items) => { 
        
      const departmentid = items[0].items.filter((item)=>item.value===department)[0].id
      if(departmentid){
          return departmentid
      }
      return null

    }

    // const returnAllPosition = async() => {
    //     try {
    //       let res = await Axios.get(`/position/getall`)
    //       if(res.data.success){
    //         console.log(res.data.data)
    //         let arr = [...res.data.data]
    //         return arr
    //      }
    //     } catch (error) {
    //       console.log(error)
    //       return []
    //     }
    // }

    // const returnAllDepartment = async() => {
    //     try {
    //       let res = await Axios.get(`/department/getall`)
    //       if(res.data.success){
    //         console.log(res.data.data)
    //         let arr = [...res.data.data]
    //         return arr
    //      }
    //     } catch (error) {
    //       console.log(error)
    //       return []
    //     }
    // }

 

    //   const setinitialData = async () => {

    //     const posArr = await returnAllPosition()
    //     const departmentArr = await returnAllDepartment()
    //     const positems = returnItems(posArr, 'position_name', 'position_name', 'Positions')
    //     const departitems = returnItems(departmentArr, 'department_name', 'department_name', 'Departments')

    //     setposAndDepartArr({
    //       posItems:positems,
    //       DepartItems: departitems
    //     })
        
    //     getDataAndRefreshTable(positems, departitems)
       

    // }

    // const getDataAndRefreshTable = async(positems, departitems) => {

    //     const employeearr = await returnAllemployee()
   
    //     setallemployeeinfo(employeearr)
         

    //     const tableobj = convertDataForTable(employeearr, positems, departitems);
    //     settableData(tableobj)
    // }

 

const convertDataForTable = (data, positems, departitems) => {

       let employeearr = [...data]

       const header =  [
    {
      "columnName": "First name",
      "type": "string",
      "colNo": 1,
      "width": 100,
      "sorted": null
    },
    {
        "columnName": "Last name",
        "type": "string",
        "colNo": 2,
        "width": 100,
        "sorted": null
    },
    {
        "columnName": "Email",
        "type": "string",
        "colNo": 3,
        "width": 100,
        "sorted":null
      },
     { 
         "columnName": "Phone number",
         "type": "string",
         "colNo": 4,
         "width": 100,
         "sorted":null
       },
       { 
        "columnName": "Whatsapp number",
        "type": "string",
        "colNo": 5,
        "width": 100,
        "sorted":null
       },
       { 
        "columnName": "Date of birth",
        "type": "date",
        "colNo": 6,
        "width": 100,
        "sorted":null
      },
       { 
          "columnName": "Address",
          "type": "string",
          "colNo": 7,
          "width": 100,
          "sorted":null
        },
        { 
           "columnName": "City",
           "type": "string",
           "colNo": 8,
           "width": 100,
           "sorted":null
         },
         { 
            "columnName": "State Province",
            "type": "string",
            "colNo": 9,
            "width": 100,
            "sorted":null
          },
          { 
             "columnName": "Country",
             "type": "string",
             "colNo": 10,
             "width": 100,
             "sorted":null
           },
           { 
              "columnName": "Postal Code",
              "type": "number",
              "colNo": 11,
              "width": 100,
              "sorted":null
            },
            { 
                "columnName": "Department",
                "type": "options",
                "colNo": 12,
                "width": 100,
                "sorted": null,
                "options": departitems
              },
              { 
                "columnName": "Position",
                "type": "options",
                "colNo": 13,
                "width": 100,
                "sorted": null,
                "options": positems
              },
              { 
                "columnName": "Emergency contact name",
                "type": "string",
                "colNo": 14,
                "width": 100,
                "sorted": null
              },   
              { 
                "columnName": "Emergency contact phone",
                "type": "string",
                "colNo": 15,
                "width": 100,
                "sorted":null
              },
              { 
                "columnName": "Emploee photo",
                "type": "attachment/link",
                "colNo": 16,
                "width": 100,
                "sorted":null
              },
              { 
                "columnName": "Bank",
                "type": "options",
                "colNo": 17,
                "width": 100,
                "sorted": null,
                "options": bankItems
              },
              { 
                "columnName": "Account number",
                "type": "string",
                "colNo": 18,
                "width": 100,
                "sorted":null
              },
              { 
                "columnName": "IFSC code",
                "type": "string",
                "colNo": 19,
                "width": 100,
                "sorted":null
              },
              { 
                "columnName": "Salary",
                "type": "number",
                "colNo": 20,
                "width": 100,
                "sorted":null
              },
            { 
               "columnName": "Note",
               "type": "string",
               "colNo": 21,
               "width": 100,
               "sorted":null
             }]
    
      let rows = []
    
      employeearr.forEach((obj, index) => {
        let row = [];
       
         if(obj.first_name){
            row.push({ key:'first_name', value:obj.first_name, type:'string', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.last_name){
            row.push({ key:'last_name', value:obj.last_name, type:'string', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.email){
            row.push({ key:'email', value:obj.email, type:'string', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.phone_number){
            row.push({ key:'phone_number', value: obj.phone_number, type:'string', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.whatsapp_number){
            row.push({ key:'whatsapp_number', value: obj.whatsapp_number, type:'string', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
         if(obj.date_of_birth){
            row.push({ key:'date_of_birth', value: returnConvertedDate(obj.date_of_birth), type:'date', width:100, rowNo:index+1, colNo:6, id:obj.id })
         }
         if(obj.address){
            row.push({ key:'address', value: obj.address, type:'string', width:100, rowNo:index+1, colNo:7, id:obj.id })
         }
         if(obj.city){
            row.push({ key:'city', value: obj.city, type:'string', width:100, rowNo:index+1, colNo:8, id:obj.id })
         }
         if(obj.state_province){
            row.push({ key:'state_province', value: obj.state_province, type:'string', width:100, rowNo:index+1, colNo:9, id:obj.id })
         }
         if(obj.country){
            row.push({ key:'country', value: obj.country, type:'string', width:100, rowNo:index+1, colNo:10, id:obj.id })
         }
         if(obj.postal_code){
            row.push({ key:'postal_code', value: obj.postal_code, type:'string', width:100, rowNo:index+1, colNo:11, id:obj.id })
         }
         if(obj.department_name){
            row.push({ key:'department_name', value: obj.department_name, type:'string', width:100, rowNo:index+1, colNo:12, id:obj.id })
         } 
         if(obj.position_name){
            row.push({ key:'position_name', value: obj.position_name, type:'string', width:100, rowNo:index+1, colNo:13, id:obj.id })
         } 
         if(obj.emergency_contact_name){
            row.push({ key:'emergency_contact_name', value: obj.emergency_contact_name, type:'string', width:100, rowNo:index+1, colNo:14, id:obj.id })
         } 
         if(obj.emergency_contact_phone){
            row.push({ key:'emergency_contact_phone', value: obj.emergency_contact_phone, type:'string', width:100, rowNo:index+1, colNo:15, id:obj.id })
         } 
         if(obj.employee_photo){
            row.push({ key:'employee_photo', value: <StackedImages key={index} images={obj.employee_photo} imageSize={20} />, type:'attachment/link', width:100, rowNo:index+1, colNo:16, id:obj.id })
         }
         if(obj.bank){
            row.push({ key:'bank', value: obj.bank, type:'options', width:100, rowNo:index+1, colNo:17, id:obj.id })
         }
         if(obj.account_number){
            row.push({ key:'account_number', value: obj.account_number, type:'string', width:100, rowNo:index+1, colNo:18, id:obj.id })
         }
         if(obj.ifsc_code){
            row.push({ key:'ifsc_code', value: obj.ifsc_code, type:'string', width:100, rowNo:index+1, colNo:19, id:obj.id })
         }
         if(obj.salary){
            row.push({ key:'salary', value: obj.salary, type:'number', width:100, rowNo:index+1, colNo:20, id:obj.id })
         } 
         if(obj.notes_comments || obj.notes_comments===""){
            row.push({ key:'notes_comments', value: obj.notes_comments, type:'string', width:100, rowNo:index+1, colNo:21, id:obj.id })
         } 
        

        console.log(row)
      if(row.length==21){
        rows.push(row) 
      }

    })

const rowWiseFunctions = [{funcName:'Update', funct:(employee)=>employeeFormOpen(employee, employeearr) , icon: <Icon
icon="mynaui:edit-one"
style={{
  width: "1.1rem",
  height: "1.1rem",
  EmployeeBills: "rgb(82, 78, 70)",
  cursor: "pointer"
}}
     />}, {funcName:'Delete', funct:(employee)=>triggerDeleteEmployee({employee, employeearr}), icon: <Icon
     icon="mi:delete-alt"
     style={{
     width: "1.1rem",
     height: "1.1rem",
     EmployeeBills: "rgb(82, 78, 70)",
     cursor: "pointer",
    }}
    />}]


const groupFunctions = [];
const name = 'employee';

const tableData = {name, groupFunctions, rowWiseFunctions, header, rows}
console.log(tableData)
return tableData


    }


// const Deleteemployee = async(employee, employeearr) => {
//       try {
//         const selctedemployeeRow = employeearr.filter((row)=>row.id===employee[0].id)[0] || null
//         if(!selctedemployeeRow){
//           console.log(selctedemployeeRow)
//           return 
//         }
//         let res = await Axios.delete(`/employee/delete?employee_id=${selctedemployeeRow.id}`)
//         if(res.data.success){
//           getDataAndRefreshTable()
          
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
   

// const UpdateEmployee = async({data, Employeeid}) => {
//       console.log(data)
//       const position = data.position_name
//       const positionid = returnPositionid(position, posAndDepartArr.posItems)
//       const department = data.department_name
//       const departmentid = returnDepartmentid(department, posAndDepartArr.DepartItems)


//       if(!positionid || !departmentid){
//           console.log("no position or department id found")
//           return 
//       }

//       try {

//         let body = {
//           Employee_id: `${Employeeid}`, 
//           ...data,
//           position_id:positionid,
//           department_id: departmentid

//         }

//         let res = await Axios.post( `/employee/update`, body )
//         if(res.data.success){
//           getDataAndRefreshTable()
//           closeEmployeeForm()
//         }

//       } catch (error) {
//         console.log(error)
//       }
//     }

const employeeFormOpen = ( employee, employeearr ) => {
      console.log(employee, employeearr)
      const selctedemployeeRow = employeearr.filter((row)=>row.id===employee[0].id)[0] || null
      console.log(selctedemployeeRow)
      setselectedEmployee(selctedemployeeRow)
      setOpenemployeeForm(true)

    }

    const closeEmployeeForm = ()=>{
      setselectedEmployee(null)
      setOpenemployeeForm(false)
    }

    // useEffect(() => {
    //   setinitialData()
    // },[])

    console.log(allemployeeinfo)

    return (

        <div className="detailoutercomp">
          <div className="infocomp">
      
         
        <div style={{margin:0}} className="tabheading">
        <Icon
            icon="simple-line-icons:people"
            style={{
              width: "3rem",
              height: "3rem",
              color: "rgb(60, 137, 255)",
              cursor:"pointer"
              
              }}
          />
          Employees</div>
       
        
      
       
     
       {allemployeeinfo && posArr && departmentArr && <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 

        <DialogDemo Open={openemployeeForm} setOpen={(e)=>e?setOpenemployeeForm(e):closeEmployeeForm()} buttontext="Add employee" contentclass="normalDialog"  btnclass = 'primarybtndiv'> 
         {(props) => (
              <Employeeform
                {...props}
                createNewEmployee={(data)=>triggerCreateEmployee(data, returnPositionid(data.data.position_name, posItems), returnDepartmentid(data.data.department_name, departItems))}
                selectedEmployee={selectedEmployee}
                UpdateEmployee={(data)=>triggerUpdateEmployee({data, positionid: returnPositionid(data.data.position_name, posItems), departmentid:returnDepartmentid(data.data.department_name, departItems)})}
                posItems={posItems}
                departItems={departItems}
              />
            )}
         </DialogDemo>

         </div>

         
        <Table  data={returnTableData(allemployeeinfo, posItems, departItems)} /> 

        </div>}

        </div>
        </div>
    )
}


export default Employee;