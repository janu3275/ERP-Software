import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import GlassProductform from './glassProductForm';
import { Axios } from "../../../../../../utils/axios.mjs";
import { returnItems, returnOtherEle } from "../../../../../commonfn";
import DialogDemo from "../../../../../assets/singlecomponents/dialog/dialog";
import Table from "../../../../commoncomponents/tableComponent/table";



const GlassProduct = () => {
    const [openglassProductForm, setOpenglassProductForm] = useState(false);
    const [allglassProductinfo, setallglassProductinfo] = useState([]);
    const [tableData, settableData] = useState(null);
    const [selectedglassProduct, setselectedglassProduct] = useState(null);
    const [items, setItems] = useState({
        colorItems:[],
        glassCompaniesItems:[],
        glassTypesItems:[],
        thicknessItems:[]
    })

    const createNewglassProduct = async(data) => {

        console.log(data)
      
        const color_id = returnid(data.color, items.colorItems)
        const glass_type_id = returnid(data.glass_type, items.glassTypesItems)
        const thickness_id = returnid(data.thickness, items.thicknessItems)
        const company_id = returnid(data.company, items.glassCompaniesItems)
      

        if(!color_id || !glass_type_id || !thickness_id || !company_id  ){
            console.log("no unit found")
            return 
        }

      try {

        let body = {
            glass_type_id,
            thickness_id,
            company_id,
            color_id,
            selling_rate_per_sqft: data.selling_rate_per_sqft , 
            stock: data.stock ,
         }

        let res = await Axios.post(`/glassProduct/add`, body)

        if(res.data.success){
          const {colorItems, glassCompaniesItems, glassTypesItems, thicknessItems} = items; 
          getDataAndRefreshTable( colorItems, glassCompaniesItems, glassTypesItems, thicknessItems )
          closeGlasProductForm()
        }

      } catch (error) {
        console.log(error)
      }

    }

    const returnid = (originalValue, items)=>{
        
        const id = items[0].items.filter((item)=>item.value===originalValue)[0].id
        if(id){
            return id
        }
        return null
    }

    const returnAllThickness= async() => {
        try {
          let res = await Axios.get(`/glassThickness/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
      }
      const returnAllGlassTypes = async() => {
        try {
          let res = await Axios.get(`/glassType/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
      }
      const returnAllColor = async() => {
        try {
          let res = await Axios.get(`/glassColor/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
      }
      const returnAllGlassCompanies = async() => {
        try {
          let res = await Axios.get(`/glassCompany/getall`)
          if(res.data.success){
            console.log(res.data.data)
            let arr = [...res.data.data]
            return arr
         }
        } catch (error) {
          console.log(error)
          return []
        }
      }
     



    const returnAllglassProduct = async() => {

      try {
        const res = await Axios.get(`/glassProduct/getall`)
        if(res.data.success){
          console.log(res.data.data)
          const glassProductArr = [...res.data.data]
          return glassProductArr
        }
      } catch (error) {
        console.log(error)
        return []
      }
    }

   

    const setinitialData = async () => {

        const colorArr = await returnAllColor()
        const glassCompaniesArr = await returnAllGlassCompanies()
        const glassTypesArr = await returnAllGlassTypes()
   
        const thicknessArr = await returnAllThickness()
        
        const colorItems = returnItems(colorArr, 'color', 'color', 'Colors')
        const glassCompaniesItems = returnItems(glassCompaniesArr, 'glass_company', 'glass_company', 'Companies')
        const glassTypesItems = returnItems(glassTypesArr, 'glass_type', 'glass_type', 'Types')
     
        const thicknessItems = returnItems(thicknessArr, 'thickness', 'thickness', 'Thickness')

        setItems({
            colorItems,
            glassCompaniesItems,
            glassTypesItems,
         
            thicknessItems
        })
        
        getDataAndRefreshTable( colorItems,
            glassCompaniesItems,
            glassTypesItems,
            thicknessItems)
       

    }

    const getDataAndRefreshTable = async( colorItems, glassCompaniesItems, glassTypesItems, thicknessItems) => {
        

        const glassProductArr = await returnAllglassProduct()
        setallglassProductinfo(glassProductArr)

        const tableobj = convertDataForTable(glassProductArr, colorItems, glassCompaniesItems, glassTypesItems, thicknessItems);
        settableData(tableobj)
    }

  const convertDataForTable = (glassProductArr, colorItems, glassCompaniesItems, glassTypesItems, thicknessItems) => {

    const glassProductarr = [...glassProductArr]
    const header =  [
      {
         "columnName": "Glass type",
         "type": "options",
         "colNo": 1,
         "width": 100,
         "options": glassTypesItems,
         "sorted":null
      },
     {
        "columnName": "Thickness ( mm )",
        "type": "options",
        "colNo": 2,
        "width": 100,
        "options": thicknessItems,
        "sorted":null
      },
      {
        "columnName": "Color",
        "type": "options",
        "colNo": 3,
        "width": 100,
        "options": colorItems,
        "sorted":null
      },
      {
        "columnName": "Company",
        "type": "options",
        "colNo": 4,
        "width": 100,
        "options": glassCompaniesItems,
        "sorted":null
      },
      {
        "columnName": "Selling price per sqft",
        "type": "number",
        "colNo": 5,
        "width": 100,
        "sorted":null
      }
    
    ]

      let rows = []
    
      glassProductarr.forEach((obj, index) => {
        let row = [];
       
         if(obj.glass_type){
            row.push({ key:'glass_type', value:obj.glass_type, ele: returnOtherEle(obj.glass_type) ,type:'options', width:100, rowNo:index+1, colNo:1, id:obj.id })
         }
         if(obj.thickness){
            row.push({ key:'thickness', value: obj.thickness, ele: returnOtherEle(obj.thickness),  type:'options', width:100, rowNo:index+1, colNo:2, id:obj.id })
         }
         if(obj.color){
            row.push({ key:'color', value: obj.color,  ele: returnOtherEle(obj.color), type:'options', width:100, rowNo:index+1, colNo:3, id:obj.id })
         }
         if(obj.glass_company){
            row.push({ key:'glass_company', value: obj.glass_company, ele: returnOtherEle(obj.glass_company), type:'options', width:100, rowNo:index+1, colNo:4, id:obj.id })
         }
         if(obj.selling_rate_per_sqft){
            row.push({ key:'selling_rate_per_sqft', value: obj.selling_rate_per_sqft, type:'number', width:100, rowNo:index+1, colNo:5, id:obj.id })
         }
      
        console.log(row)
      if(row.length==5){
        rows.push(row) 
      }

    })

    const rowWiseFunctions = [{funcName:'edit', funct:(Product)=>glassProductFormOpen(Product, glassProductarr) , icon: <Icon
    icon="mi:edit-alt"
    style={{
      width: "1.2rem",
      height: "1.2rem",
      Product: "#3f3f3f",
      cursor: "pointer"
    }}
  />}, {funcName:'delete', funct:(Product)=>DeleteglassProduct(Product, glassProductarr), icon: <Icon
  icon="mi:edit-alt"
  style={{
    width: "1.2rem",
    height: "1.2rem",
    Product: "#3f3f3f",
    cursor: "pointer",
  }}

/>}]


const groupFunctions = [];
const name = 'GlassProducttable';

const tableData = { name, groupFunctions, rowWiseFunctions, header, rows }
console.log(tableData)
return tableData


}

    const DeleteglassProduct = async(Product, glassProductarr) => {
      try {
        const selctedglassProductRow = glassProductarr.filter((row)=>row.id===Product[0].id)[0] || null
        if(!selctedglassProductRow){
          console.log(selctedglassProductRow)
          return 
        }
        let res = await Axios.delete(`/glassProduct/delete?productid=${selctedglassProductRow.id}`)
        if(res.data.success){
            const {colorItems, glassCompaniesItems, glassTypesItems, thicknessItems} = items; 
            getDataAndRefreshTable( colorItems, glassCompaniesItems, glassTypesItems, thicknessItems )
          
        }
      } catch (error) {
        console.log(error)
      }

    }

    const closeGlasProductForm = () => {
        setselectedglassProduct(null)
        setOpenglassProductForm(false)
    }

    const UpdateglassProduct = async({data, GlassProductid}) => {
      console.log(data, GlassProductid)
      const color_id = returnid(data.color, items.colorItems)
      const glass_type_id = returnid(data.glass_type, items.glassTypesItems)
      const thickness_id = returnid(data.thickness, items.thicknessItems)
      const company_id = returnid(data.company, items.glassCompaniesItems)
   

      if( !color_id || !glass_type_id || !thickness_id || !company_id ){
          console.log("no unit found")
          return 
      }
   
      try {
        let body = {
          productid: `${GlassProductid}`, 
          glass_type_id,
          thickness_id,
          company_id,
          color_id,
          selling_rate_per_sqft: data.selling_rate_per_sqft 
         
        }

        let res = await Axios.post(`/glassProduct/update`, body)
        if(res.data.success){
          const {colorItems, glassCompaniesItems, glassTypesItems, thicknessItems} = items; 
          getDataAndRefreshTable( colorItems, glassCompaniesItems, glassTypesItems, thicknessItems )
          closeGlasProductForm()
        }
      } catch (error) {
        console.log(error)
      }
    }

    const glassProductFormOpen = (glassProduct,glassProductarr) => {
      console.log(glassProduct, glassProductarr, tableData)
      const selctedglassProductRow = glassProductarr.filter((row)=>row.id===glassProduct[0].id)[0] || null
      console.log(selctedglassProductRow)
      setselectedglassProduct(selctedglassProductRow)
      setOpenglassProductForm(true)

    }

    useEffect(() => {
        setinitialData()
    },[])

    console.log(allglassProductinfo)
    return (
        <div>
          <div style={{position:"relative"}}>
         <div style={{ width: "fit-content", position: "absolute" , right: '30px', zIndex: 1}}> 
        <DialogDemo Open={openglassProductForm} setOpen={setOpenglassProductForm} buttontext="Add glass product" btnclass = 'primarybtndiv'> 
         {(props) => (
              <GlassProductform

                {...props}
                createNewGlassProduct={createNewglassProduct}
                selectedGlassProduct={selectedglassProduct}
                UpdateGlassProduct={UpdateglassProduct}
                colorItems={items.colorItems}
                glassCompaniesItems={items.glassCompaniesItems}
                glassTypesItems={items.glassTypesItems}
                thicknessItems={items.thicknessItems}
                

              />
            )}
         </DialogDemo>
         </div>
          </div>
         
       { tableData && <Table  data={tableData} /> }

        
        </div>
    )
}


export default GlassProduct;