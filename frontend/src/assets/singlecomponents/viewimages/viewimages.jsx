import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import imageIcon from "../../icons/image.svg";
import "./viewimages.css";
import { useEffect, useRef, useState } from "react";
import print from 'print-js'

const ViewImages = ({ images, closeDialog }) => {

  const [selectedImg, setselectedImg] = useState({
    image:null, selectedIndex:null
  })


 const selectImg = (index) => {
  if(!images || images.length===0){
    return
  }
   setselectedImg({image:images[index], selectedIndex:index})
 }

 const nextImage = () => {
  console.log( images[selectedImg.selectedIndex+1])
  if(images[selectedImg.selectedIndex+1]){
    setselectedImg({image:images[selectedImg.selectedIndex+1], selectedIndex:selectedImg.selectedIndex+1 })
  }
 }

 const prevImage = () => {
  if(images[selectedImg.selectedIndex-1]){
    setselectedImg({image:images[selectedImg.selectedIndex-1], selectedIndex:selectedImg.selectedIndex-1 })
  }
 }


 const divoneRef = useRef(null);
 const divtwoRef = useRef(null);
 const divthreeRef = useRef(null);
 const divfourRef = useRef(null);
 const divfiveRef = useRef(null);
 const divsixRef = useRef(null);


 function downloadImage(imageUrl, fileName) {
  // Create a new anchor element
  const anchor = document.createElement('a');
  
  // Set the href attribute to the image URL
  anchor.href = imageUrl;
  
  // Set the download attribute to the desired file name
  anchor.download = fileName;
  
  anchor.ref = divsixRef;
  
  // Append the anchor element to the document body
  document.body.appendChild(anchor);
  
  // Click the anchor element to trigger the download
  anchor.click();
  
  // Remove the anchor element from the document body
  document.body.removeChild(anchor);
}




 useEffect(() => {
  selectImg(0)
   // Function to handle click outside the div
   const handleClickOutside = (event) => {
   console.log(event)
     
     if ((divoneRef.current && !divoneRef.current.contains(event.target))
     && (divtwoRef.current && !divtwoRef.current.contains(event.target))
     && (divthreeRef.current && !divthreeRef.current.contains(event.target))
     && (divfourRef.current && !divfourRef.current.contains(event.target))
     && (divfiveRef.current && !divfiveRef.current.contains(event.target))
     ) {
       // Clicked outside the div, close it
      
       closeDialog()
       // Your logic to close the div goes here
       console.log('Clicked outside the div');
     }
   };

   // Add event listener when component mounts
   document.addEventListener('click', handleClickOutside);

   // Remove event listener when component unmounts
   return () => {
     document.removeEventListener('click', handleClickOutside);
   };
 }, []);

 console.log(images)

  return (
    <div
      style={{
     
        display: "flex",
        flexWrap: "wrap",
        height:"-webkit-fill-available",
        padding: "20px",
        justifyContent:"space-between"
        
      }}

    
    >
      <div style={{display:"flex", position:"absolute",  alignItems:"center", justifyContent:"space-between", width:"calc(100vw - 40px)"}} ref={divoneRef}> 
    
      <div style={{display:"flex", gap:"10px", color:"#dfdfdf", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center"}}> 
        <img src={imageIcon} style={{height:"2rem", width:"2rem"}}/>
         </div>
        <div>{selectedImg.image?.fileName || 'kk'}</div>
      </div>
      
      <div style={{display:"flex", gap:"10px", alignItems:"center"}} >
        <button className="darkprimarybtn" onClick={()=>print({
      printable: selectedImg.image.imageSrc,
      type: 'image',
      headerStyle: 'display: none',
      footerStyle: 'display: none',
      targetStyles: ['*'],
      scanStyles: false,
    })} >
          <Icon
            icon="material-symbols:print"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          /></button>
        <button className="darkprimarybtn" 
         onClick={()=>document.getElementById('downloadimage').click()}
         >
         {selectedImg.image && <a href={selectedImg.image.imageSrc} download={selectedImg.image.fileName} id="downloadimage" style={{display:"none"}} />}
        <Icon
            icon="material-symbols:download"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          />
        </button>
      </div>
      </div>
      <button ref={divtwoRef} style={{height:"fit-content", margin:"auto 0px", visibility:selectedImg.selectedIndex===0&&"hidden"}} onClick={prevImage}  className="darksolidbtn">
      <Icon
            icon="iconamoon:arrow-left-2"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          />
      </button>

      {selectedImg.image && 
        <div
          
          style={{
            // flex: '1 0 25%',
            boxSizing: "border-box",
            padding: "2px",
            margin:"auto"
          }}
        >
          <img
            id="printimg"
            ref={divfourRef}
            src={selectedImg.image.imageSrc}
            alt={`Image`}
            style={{ maxHeight: "80vh", objectFit: "cover" }}
          />

        </div>
}

   <button ref={divthreeRef} style={{height:"fit-content",  margin:"auto 0px", visibility:selectedImg.selectedIndex===(images.length-1)?"hidden":"visible"}} onClick={nextImage} className="darksolidbtn">
      <Icon
            icon="iconamoon:arrow-right-2"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              cursor: "pointer"
            }}
            
          />
      </button>
    

      <div ref={divfiveRef} className="bottomImageSwitch">
      {images.map((image, index) => (
        <button
          className={selectedImg.selectedIndex===index?"bottomimgbox imgselected":"bottomimgbox"}
          key={index}
          style={{
            // flex: '1 0 25%',
            boxSizing: "border-box",
            padding: "3px 3px 0px 3px",
          }}
          onClick={()=>selectImg(index)}
        >
          <img
            src={image.imageSrc}
            alt={`Image ${index}`}
            style={{ height: "50px", objectFit: "cover" }}
          />
        </button>
      ))}
      </div>
    </div>
  );
};

ViewImages.propTypes = {
  images: PropTypes.array,
  closeDialog: PropTypes.func.isRequired

};

export default ViewImages;
