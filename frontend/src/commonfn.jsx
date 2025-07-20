import { Axios } from "../utils/axios.mjs";
import { isExpired } from "react-jwt";
import imageCompression from 'browser-image-compression';
import Cashicon from "./assets/icons/reshot-icon-money-2AJCZGWB6U.svg";
import Chequeicon from "./assets/icons/cheque-finance-business-svgrepo-com.svg";
import UPIIcon from "./assets/icons/upi-payment-icon.svg";
import OtherIcon from "./assets/icons/apps-grid-icon.svg";
import { Icon } from "@iconify/react/dist/iconify.js";
import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PDFView from "./components/sidebarcomponents/orders/OrderInfoPdf/vieworder";


export function toCamelCase(str) {
  if(!str){
    return ''
  }
  // Split the string into words
  let words = str.toLowerCase().split(' ');

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words and return
  return words.join(' ');
}

export function removeSpaces(str) {
  
  if(!str){
    return ""
  }

  return str.replace(/\s+/g, '');

}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function generateRandomId(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
  
    return result;
  }

export function removeObjectKey(obj, keyToRemove) {
    // Create a new object to hold the result
    const result = { ...obj }; // Create a shallow copy of the original object
  
    // Check if the key exists in the object
    if (keyToRemove in result) {
      // Use the `delete` operator to remove the key
      delete result[keyToRemove];
    }
  
    return result;
  }

  export function returnItems(arr, label, value, name) {
     if(!arr){
      return [ 
        {
          label: name,
          items: [],
        }
      ]
     }
    let newarr = arr.map((obj) => {
        return {
        label: returnOtherEle(obj[label]),
        value: obj[value],
        id: obj.id
        }
      })

const itemsarr = [
  {
    label: name,
    items: newarr,
  }
];

return itemsarr


  }

  export function returnConvertedDate(inputdate) {
    if (!inputdate) {
        return inputdate;
    }
    const date = new Date(inputdate);

    // Array of month names
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Get the day, month, and year components
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Format the date
    const formattedDate = `${day} ${months[monthIndex]} ${year}`;
    return formattedDate;
}




 export async function returnCompressedImages(imageArr) {

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
      // let imageFile = imageArr[0]
      console.log(imageArr)
     try {
      const imageFilePromises = imageArr.map((imageFile) => {
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
        console.log(options, imageFile)
        const compressedFile = imageCompression(imageFile, options);
        console.log(compressedFile);
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        return compressedFile
      })
       
      let results = await Promise.all(imageFilePromises)
      console.log('All promises resolved:', results);
      return results

     } catch (error) {
      console.error('One or more promises rejected:', error);
      return []
     }
      
   

    }

// SESSION CONTROL FUNCTIONS -------------------------------------------------------------------------------------------->>

  export const setCompanySession = (companytoken) => { 
    if (companytoken) {
      localStorage.setItem('companytoken', companytoken);
      // localStorage.setItem('companyid', companyid);
      // localStorage.setItem('companyName', companyName);
      Axios.defaults.headers.common['companyAuthToken'] = `Bearer ${companytoken}`; 
  } else {
      localStorage.clear()
      delete Axios.defaults.headers.common.Authorization;
  }
  }


  export const setMarketSession = (marketToken) => { 
    if (marketToken) {

      localStorage.setItem('markettoken', marketToken);
      Axios.defaults.headers.common['marketAuthToken']= `Bearer ${marketToken}`;

  } else {

      localStorage.removeItem('markettoken');
      localStorage.removeItem('usertoken');   
      delete Axios.defaults.headers.common['marketAuthToken'];
  }
  }

  export const setUserSession = (usertoken) => {
    if (usertoken) {
      localStorage.setItem('usertoken', usertoken);
      // localStorage.setItem('userId', userid);
      // localStorage.setItem('access', access);
      Axios.defaults.headers.common['userAuthToken']= `Bearer ${usertoken}`;
  } else {
      localStorage.removeItem('usertoken');
      // localStorage.removeItem('userId');
      // localStorage.removeItem('access');
      delete Axios.defaults.headers.common['userAuthToken'];
  }
  }



  export const clearCompanyData = (setCompanyInfo, setMarketInfo,setUserInfo ) => {
    
    localStorage.clear()
    
    setCompanyInfo(null)
    setMarketInfo(null)
    setUserInfo(null)
  }
 

  export const clearUserData = (setUserInfo)=>{
    
    setUserSession(null);

    setUserInfo(null)
  }

 

  export const clearMarketData = (setMarketInfo, setUserInfo) => {
   
    setUserSession(null);
    setMarketSession(null);

    setMarketInfo(null, null);
    setUserInfo(null)
  }

//********************************************************* TOKEN CONTROL FUNCTIONS *************************************************************** */


export const checkToken = () => {
  let companytoken = localStorage.getItem('companytoken')
  let usertoken = localStorage.getItem('usertoken')
  let markettoken = localStorage.getItem('markettoken')
  const CompanyTokenValid = companytoken && !isExpired(companytoken)
  const UserTokenValid = usertoken && !isExpired(usertoken)
  const marketTokenValid = markettoken && !isExpired(markettoken)
  return {CompanyTokenValid, UserTokenValid, marketTokenValid}
}

//***************************************************** S3 RELATED FUNCTIONS ******************************************************************* */

export const uploadOrGetImagesS3 = async ( file, companyName, gstNumber, customerId, orderId, productIdarr, type ) => {

  const fileType = file.type;
  let finalarr = [];

   try {

    let Urlarr = await getPreSignedUrlarr(file, companyName, gstNumber, customerId, orderId, productIdarr, type)

    for (let i = 0; i < productIdarr.length; i++) {

      const { productId, Url, error } = Urlarr[i]

      if(error){
        console.log(`unable to get presigned url for product ${productId}`)
        continue
      }
     
      // Upload file directly to S3 using pre-signed URL
      const commonOptions = {
        headers: {
          'Content-Type': fileType,
        },
      };

      const response = type === 'upload'
      ? await Axios.put(Url, file, commonOptions)
      : await Axios.get(Url, commonOptions);

      console.log(`File ${type} successfully for productId ${productId}:`, response);

      finalarr.push({productId, data:response.data})
    }

     return finalarr

  } catch (error) {
    console.error('Error uploading file:', error);
  }

}

export const getPreSignedUrlarr = async (file, companyName, gstNumber, customerId, orderId, productIdarr, type ) => {

  const fileName = file.name;
  const fileType = file.type;

  if (!file || !companyName || !gstNumber) {
    console.error('Please fill in all fields');
    return;
  }

 try {
    // Get pre-signed URL from your server
    const response = await Axios.get('/awsS3/get_PreSigned_url', {
      params: { fileName, fileType, companyName, gstNumber, customerId, orderId, productIdarr, type },
    });

    if(response.data.success) {
      const { Urlarr } =  response.data;
      return Urlarr
    } else {
      return ""
    }
    
  } catch (error) {
    console.error('Error uploading file:', error);
  }

}

export const geturlOfOrderInfo = async(order_number) => {

  try {
   
    const url = `/awsS3/getPdfAsURLfromS3?orderno=${order_number}`;

    const res = await Axios.get(url)
    if(res.data.success){
      console.log(res.data.data)
     return res.data.data
    }

  } catch (error) {
    console.log(error) 
    return "www.google.com"
  }
 
}

export const uploadPdfToS3 = async(orderid) => {

  if(!orderid){
    console.log("orderid is undefined", orderid)
    return
  }

  try {

    const data = await returnOrderInfo(orderid)
    if(!data.orderno){
      console.log("orderno not found", data)
      return 
    }
    const pdfblob = await generatePDF(data)

    const formData = new FormData();
    formData.append('orderno', data.orderno);
    formData.append('pdfblob', pdfblob, 'filename.pdf');

    const body = formData

    const url = `/awsS3/uploadPdfToS3`;

    const res = await Axios.post(url, body)

    if(res.data.success){
      console.log(res.data.data)
      let url = res.data.data
      // return url
    }

  } catch (error) {
    console.log(error)
  }

}

const returnOrderInfo = async(orderid) => {
  let params = new URLSearchParams();
      params.append('orderid', orderid);

     try {

          let res = await Axios.get(
            `/order/getbyid?${params.toString()}`,
          );

          if (res.data.success) {
            console.log(res.data.data);
           let data = res.data.data
           return data;
            
          }

        } catch (error) {
          console.log(error);
          return null
        }
}



//******************************************************** File local storage related function ************************************************************************************ */

export const uploadOrGetImageslocalStorage = async ( file, companyName, gstNumber, customerId, orderId, productIdarr, type ) => {

  const fileType = file.type;
  let finalarr = [];

   try {

    let Urlarr = await getPreSignedUrlarr(file, companyName, gstNumber, customerId, orderId, productIdarr, type)

    for (let i = 0; i < productIdarr.length; i++) {

      const { productId, Url, error } = Urlarr[i]

      if(error){
        console.log(`unable to get presigned url for product ${productId}`)
        continue
      }
     
      // Upload file directly to S3 using pre-signed URL
      const commonOptions = {
        headers: {
          'Content-Type': fileType,
        },
      };

      const response = type === 'upload'
      ? await Axios.put(Url, file, commonOptions)
      : await Axios.get(Url, commonOptions);

      console.log(`File ${type} successfully for productId ${productId}:`, response);

      finalarr.push({productId, data:response.data})
    }

     return finalarr

  } catch (error) {
    console.error('Error uploading file:', error);
  }

}



//******************************************************* frontend image upload operations **************************************** */

export const returnBase64OrBinaryfromfile = (files, type) => {
  if (files.length === 0 || !files) {
    console.log(files)
    return [];
  }

  const promises = files.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({
          fileName: file.name,
          fileType: file.type,
          imageSrc: type === 'base64' ? event.target.result : event.target.result,
        });
      };

      if (type === 'base64') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  });

  return Promise.all(promises);
};


export const returnUrlfromBase64 = (base64Data) => {

 

  // Convert base64 to a Blob
  const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'image/*' });

  // Create a data URL for the Blob
  const imageUrl = URL.createObjectURL(blob);

  return imageUrl

};


// **************************************************************** COMMON GET FUNCTIONS USED IN MORE THAN ONE FILE **************************************************************//


export const returnid = (originalValue, items)=>{
        
  const id = items[0].items.filter((item)=>item.value===originalValue)[0].id
  if(id){
      return id
  }
  return null
}

export const returnValue = ( id, items ) => {
  console.log(items, id)
  if(!items[0]){
    return ""
  }
  const value = items[0].items.filter((item)=>item.id===id)[0]?.value || null
 console.log(value)
  return value

}

export const calculatePaid = (paidOptionInfo) => {
  let total = 0
    console.log(paidOptionInfo)
    let cash = paidOptionInfo[0]?.amount || 0
    let upi = paidOptionInfo[1]?.amount || 0
    let cheque = paidOptionInfo[2]?.amount || 0
    let other = paidOptionInfo[3]?.amount || 0

    total = total + cash + upi + cheque + other


  return total
}

export const formatpaidOptionInfo = (optionarr) => {
  return [
    {
      via: "Cash",
      label: "Cash",
      icon: (
        <div className="cashdiv">
          <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
        </div>
      ),
      checked:
        optionarr.filter((opt) => opt.via === "Cash")[0].amount > 0
          ? true
          : false,
      amount:
        optionarr.filter((opt) => opt.via === "Cash").length > 0
          ? optionarr.filter((opt) => opt.via === "Cash")[0].amount
          : 0,
    },
    {
      via: "UPI",
      label: "UPI payments",
      icon: (
        <div className="UPIdiv">
          <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
        </div>
      ),
      checked:
        optionarr.filter((opt) => opt.via === "UPI")[0].amount > 0
          ? true
          : false,
      amount:
        optionarr.filter((opt) => opt.via === "UPI").length > 0
          ? optionarr.filter((opt) => opt.via === "UPI")[0].amount
          : 0,
    },{
      via: "Cheque",
      label: "Cheque",
      icon: (
        <div className="chequediv">
          <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
        </div>
      ),
      checked:
        optionarr.filter((opt) => opt.via === "Cheque")[0].amount > 0
          ? true
          : false,
      amount:
        optionarr.filter((opt) => opt.via === "Cheque").length > 0
          ? optionarr.filter((opt) => opt.via === "Cheque")[0].amount
          : 0,
    },{
      via: "Other",
      label: "Other",
      icon: (
        <div className="Otherdiv">
          <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
        </div>
      ),
      checked:
        optionarr.filter((opt) => opt.via === "Other")[0].amount > 0
          ? true
          : false,
      amount:
        optionarr.filter((opt) => opt.via === "Other").length > 0
          ? optionarr.filter((opt) => opt.via === "Other")[0].amount
          : 0,
    }
  ];
};

export const returnPaymentTableIcon = (option) => {
   if(option.via==='Cash'){
    return (
      <div style={{padding:0, border:0}} className="cashdiv">
      {/* <img src={Cashicon} style={{ height: "20px", width: "20px" }} /> */}
      <Icon
    icon="heroicons-solid:cash"
    style={{
    width: "20px",
    height: "20px",
    color: "green",
    cursor: "pointer",
   }} />
    </div>
    )
   }
   if(option.via==='UPI'){
    return (
      <div style={{padding:0, border:0}} className="UPIdiv">
          <img src={UPIIcon} style={{ height: "20px", width: "25px" }} />
      </div>
    )
   }
   if(option.via==='Cheque'){
    return (
      <div style={{padding:0, border:0}} className="chequediv">
          {/* <img src={Chequeicon} style={{ height: "20px", width: "30px" }} /> */}
          <Icon
    icon="iconamoon:cheque"
    style={{
    width: "20px",
    height: "20px",
    color: "black",
    cursor: "pointer",
   }} />
        </div>
    )
   }
   if(option.via==='Other'){
    return (
    <div style={{padding:0, border:0}} className="Otherdiv">
      {/* <img src={OtherIcon} style={{ height: "20px", width: "15px" }} /> */}
      <Icon
    icon="pepicons-pop:dots-x-circle"
    style={{
    width: "15px",
    height: "15px",
    color: "black",
    cursor: "pointer",
   }} />
    </div>
    )
   }
}


export const paidOptionInfoArr = [
  {
    via: "Cash",
    label: "Cash",
    icon: (
      <div className="cashdiv">
        <img src={Cashicon} style={{ height: "20px", width: "20px" }} />
      </div>
    ),
    checked: false,
    amount: 0
  },
  {
    via: "UPI",
    label: "UPI payments",
    icon: (
      <div className="UPIdiv">
        <img src={UPIIcon} style={{ height: "30px", width: "30px" }} />
      </div>
    ),
    checked:false,
    amount:0
  },{
    via: "Cheque",
    label: "Cheque",
    icon: (
      <div className="chequediv">
        <img src={Chequeicon} style={{ height: "30px", width: "30px" }} />
      </div>
    ),
    checked: false,
    amount: 0
  },{
    via: "Other",
    label: "Other",
    icon: (
      <div className="Otherdiv">
        <img src={OtherIcon} style={{ height: "15px", width: "15px" }} />
      </div>
    ),
    checked: false,
    amount: 0
  }
];


export const returnAllglassInventory = async() => {

  try {
    const res = await Axios.get(`/glassInventory/getall`)
    if(res.data.success){
      console.log(res.data.data)
      const glassInventoryArr = [...res.data.data]
      return glassInventoryArr
    }
  } catch (error) {
    console.log(error)
    return []
  }
} 

export const returnAllGlassAccessories = async() => {
  try {
    let res = await Axios.get(`/glassAccessory/getall`)
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

export const returnAllotherItems = async() => {
  try {
    let res = await Axios.get(`/otherProduct/getall`)
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
export const returnAllemployee = async() => {
  try {
    const res = await Axios.get(`/employee/getall`)
    if(res.data.success){
      console.log(res.data.data)
      let employeearr = [...res.data.data]
      return employeearr
    }
  } catch (error) {
    console.log(error)
  }
}


// ************************************************************* returning customised divs for option element ******************************************************************//  

export const returnBoolEle = (bool)=> {
  if(bool==="True"){
    return <div style={{background:"rgb(219, 237, 219)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"33px", padding:"2px 5px" , paddingRight:"12px"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
      <Icon
    icon="flowbite:arrow-up-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(108, 155, 125)",
    cursor: "pointer",
   }} />
   </div>
   <div>{toCamelCase(bool)}</div>
   </div>
  }else{
    return <div style={{background:"rgb(255, 226, 221)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"2px 5px", paddingRight:"12px"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
      <Icon
    icon="flowbite:arrow-down-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(225, 111, 100)",
    cursor: "pointer",
   }} />
   </div>
   <div>{toCamelCase(bool)}</div>
   </div>
  }
  }

export const returnCategoryEle = (category)=> {
  if(category==="Customer payments"){
    return <div style={{background:"rgb(219 237 219 / 39%)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"33px", padding:"2px 5px" , paddingRight:"12px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
      <Icon
    icon="flowbite:arrow-up-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(30, 197, 2)",
    cursor: "pointer",
   }} />
   </div>
   <div style={{display:"flex", alignItems:"center", minHeight:"22px"}}>{category}</div>
   </div>
  }else{
    return <div style={{background:"rgb(255 226 221 / 44%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"2px 5px", paddingRight:"12px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
      <Icon
    icon="flowbite:arrow-down-outline"
    style={{
    width: "1.2rem",
    height: "1.2rem",
    color: "rgb(228 8 8)",
    cursor: "pointer",
   }} />
   </div>
   <div style={{display:"flex", alignItems:"center", minHeight:"22px"}}>{category}</div>
   </div>
  }
  }

  export const returnPaymenStatusEle = (status) => {
    if(status==="paid"){
      return <div style={{background:"rgba(219, 237, 219, 0.39)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px" , paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
        <Icon
      icon="radix-icons:dot-filled"
      style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "rgb(30 197 2)",
      cursor: "pointer",
     }} />
     </div>
     <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis",  minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
     </div>
    }else{
      return <div style={{background:"rgb(255 212 87 / 23%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
        <Icon
      icon="radix-icons:dot-filled"
      style={{
      width: "1.2rem",
      height: "1.2rem",
      color: "rgb(230 191 76)",
      cursor: "pointer",
     }} />
     </div>
     <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
     </div>
    }
    }


    export const returnAttendanceStatusEle = (status) => {
      if(status==="present"){
        return <div style={{background:"rgba(219, 237, 219, 0.39)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px" , paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(30 197 2)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis",  minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else{
        return <div style={{background:"rgb(255 226 221 / 44%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(228 8 8)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }
    }  


    export const returnOtherEle = (status) => {
      
        return <div style={{background:"rgb(233 233 233 / 50%)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"3px", padding:"0px 5px" , paddingRight:"14px", alignItems:"center"}}>

       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis",  minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
  
    }

    export const returnOrderStatusEle = (status) => {
      if(status==="Not yet started"){
        return <div style={{background:"rgb(233 233 233 / 50%)", color:"rgb(28, 56, 41)",  display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px" , paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(202 201 200)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis",  minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="In process"){
        return <div style={{background:"rgb(234 240 255)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(100 137 225)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="completed"){
        return <div style={{background:"rgba(219, 237, 219, 0.39)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(30 197 2)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="sent for dilevery"){
        return <div style={{background:"rgb(255 255 156 / 40%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(200 200 122)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="dilevered"){
        return <div style={{background:"rgba(219, 237, 219, 0.39)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(30 197 2)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="hold"){
        return <div style={{background:"rgb(255 212 87 / 23%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(230 191 76)",
        cursor: "pointer",
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else if(status==="removed"){
        return <div style={{background:"rgb(255 226 221 / 44%)",  color:"rgb(28, 56, 41)", display:"flex", gap:"2px", borderRadius:"33px", padding:"0px 5px", paddingRight:"14px", alignItems:"center"}}><div style={{height:"fit-content", display:"flex", alignItems:"center"}}>
          <Icon
        icon="radix-icons:dot-filled"
        style={{
        width: "1.2rem",
        height: "1.2rem",
        color: "rgb(228 8 8)",
        cursor: "pointer"
       }} />
       </div>
       <div style={{whiteSpace:"nowrap", textOverflow:"ellipsis", minHeight:"25px", display:"flex", alignItems:"center"}}>{toCamelCase(status)}</div>
       </div>
      }else{
        return <></>
      }

      }


// *************************************************************************************** whatsapp functions ***********************************************************************************//

 export function getTextMessageInput(recipient, text) {
        return ({
          "messaging_product": "whatsapp",
          "preview_url": false,
          "recipient_type": "individual",
          "to": recipient,
          "type": "text",
          "text": {
              "body": text
          }
        });
  }

 export function getOrderDileverTemplatedMessageInput(recipient, customer_name, order_number) {
        
         return {
           "messaging_product": "whatsapp",
           "to": recipient,
           "type": "template",
           "template": {
             "name": "delivery_confirmation_2",
             "language": {
               "code": "en_US"
             },
             "components": [
              
               {
                 "type": "body",
                 "parameters": [
                   {
                     "type": "text",
                     "text": `Dear ${toCamelCase(customer_name)}`
                   },
                   {
                     "type": "text",
                     "text": `${order_number}`
                   }
               
                 
                 ]
               }
               
             ]
           }
         };

  }

 export function getOrderConfirmationTemplatedMessageInput(recipient, customer_name, order_number, url, date) {
       const {day_of_week, day_of_month, year, month} = returnDateforWhatsappTemplate(date)
       console.log(day_of_week, day_of_month, year, month, recipient, customer_name, order_number, url)
       const urlsuffix = url.split('https://glasskeorders.s3.ap-south-1.amazonaws.com/')[1]
       console.log("url suffix", urlsuffix)

        return {

          "messaging_product": "whatsapp",
          "to": recipient,
          "type": "template",
          "template": {
            "name": "order_confirmation_template",
            "language": {
              "code": "en_US"
            },
            "components": [
             
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "text",
                    "text": `Dear ${toCamelCase(customer_name)}`
                  },
                  {
                    "type": "text",
                    "text": `${order_number}`
                  },
                  {
                    "type": "date_time",
                    "date_time" : {
                        "fallback_value": `${month} ${day_of_month} ${year}`
                        // "day_of_week": day_of_week,
                        // "day_of_month": day_of_month,
                        // "year": year,
                        // "month": month
                       
                      
                    }
                  }
                
                ]
              },
              {
                "type": "button",
                "sub_type": "url",
                "index": "0",
                "parameters": [
                  {
                    "type": "text",
                    "text": urlsuffix
                  }
                ]
              }
            ]
          }
        };
  }     

 const returnDateforWhatsappTemplate = (inputdate) => {
    if (!inputdate) {
      return inputdate;
  }
  const date = new Date(inputdate);

  // Array of month names
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Get the day, month, and year components
  const dayIndex = date.getDay();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  
 

  return { day_of_week:days[dayIndex] , day_of_month:day, year:year, month:months[monthIndex] };
  }
  
 export const sendWhatsappMessageForOrderConfirmation = async ( recipient, customer_name, order_number, orderid, date ) => {
  console.log(recipient, customer_name, order_number,  orderid, date)
  if(!recipient || !customer_name || !order_number || !orderid || !date){
    return
  }
  
  await uploadPdfToS3(orderid)
  console.log("1")
  // const data = getTextMessageInput("917889542921", ' Hey, welcome to gobind glass house !');
  const url = await geturlOfOrderInfo(order_number)
  const data  = getOrderConfirmationTemplatedMessageInput(recipient, customer_name, order_number, url, date)

  try {

       let body = {
          data: data
       }

      let res = await Axios.post(`/whatsapp/sendmessage`, body)

      if(res.data.success){
        console.log(res.data)
      }

    } catch (error) {
      console.log(error)
    }

  } 

 export const sendWhatsappMessageForOrdeDilevered = async ( recipient, customer_name, order_number ) => {
  console.log(recipient, customer_name, order_number)
  if(!recipient || !customer_name || !order_number){
    return
  }
  // const data = getTextMessageInput("917889542921", ' Hey, welcome to gobind glass house !');

  const data  = getOrderDileverTemplatedMessageInput(recipient, customer_name, order_number)

  try {

       let body = {
          data: data
       }

      let res = await Axios.post(`/whatsapp/sendmessage`, body )

      if(res.data.success){
        console.log(res.data)
      }

    } catch (error) {
      console.log(error)
    }

  } 

// ************************************************************************ pdf generated functions ******************************************************************


export const generatePDF = async (data) => { 
  const items = await returnItemsForPdfView()
  // This function is giving good ratio of compoennt rendered
  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.zIndex = -5;
  document.body.appendChild(container);

  // Render the ViewOrder component inside the hidden container
  const root = createRoot(container);
  root.render(<PDFView selectedorder={data} items={items} />);
   // Use setTimeout to wait for the component to render
   // Wait for the rendering to complete before converting to PDF
   await new Promise((resolve) => setTimeout(resolve, 0));

   // Convert the rendered component to PDF
   const pdfBlob = await convertToPdf(container);
   console.log(pdfBlob)
   return pdfBlob;



};

const convertToPdf = async(container) => {

  try {

    let canvas = await html2canvas(container)
      // Create a new instance of jsPDF
    console.log(canvas);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the captured image to the PDF document
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF document
    // pdf.save('view_order.pdf');  // This is for saving pdf

    const pdfBlob = pdf.output('blob');
    console.log(pdfBlob)

    // Remove the hidden container from the DOM
    document.body.removeChild(container);
    return pdfBlob;
    } catch (error) {
      console.log(error)
      document.body.removeChild(container);
      return {}
    }
}

const returnItemsForPdfView = async() => {

  let items = {
    productItems:[],
    serviceItems:[],
    accessoryItems:[]
  }

   items.productItems = await getAllProducts()
   items.serviceItems = await getAllServices()
   items.accessoryItems = await getAllAccessories()

   return items
  

}

const getAllProducts = async () => {

  try {
    let res = await Axios.get(
      `/glassProduct/getall`
    );
    if (res.data.success) {
      
      let arr = [...res.data.data];
      let newarr = arr.map((item) => {
        return {
          label: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
          value: `${item['thickness']}mm ${item['color']} ${item['glass_type']} ${item['glass_company']} - glass`,
          id: item.id
        };
      });

      const items = [
        {
          label: "Products",
          items: newarr
        },
      ];
      return items
    }
  } catch (error) {
    console.log(error);
    return []
  }
  
};

const getAllAccessories = async () => {
  try {
    let res = await Axios.get(
      `/glassAccessory/getall`
    );
    if (res.data.success) {
     
      let arr = [...res.data.data];
      let newarr = arr.map((item) => {
        return {
          label: item.name,
          value: item.name,
          id: item.id
        };
      });

      const items = [
        {
          label: "Accessories",
          items: newarr,
        },
      ];

      return items
    }
  } catch (error) {
    console.log(error);
    return []
  }
};

const getAllServices = async () => {
  try {
    let res = await Axios.get(
      `/glassCustomization/getall`
    );
    if (res.data.success) {
      
      let arr = [...res.data.data];
      let newarr = arr.map((item) => {
        return {
          label: item.service_name,
          value: item.service_name,
          id: item.id
        };
      });

      const items = [
        {
          label: "Services",
          items: newarr,
        }
      ];

      return items

    }
  } catch (error) {
    console.log(error);
    return []
  }
};



