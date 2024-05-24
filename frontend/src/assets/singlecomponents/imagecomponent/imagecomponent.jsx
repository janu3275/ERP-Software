import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";

import "./imagecomponent.css";
import { returnUrlfromBase64 } from '../../../commonfn';

const ImageDiv = ({ uploadedImages, deleteImage, sizeArrIndx }) => {

   const openImageInNewTab = (imageSrc) => {
    
   console.log(imageSrc)
   // Extract the base64 data from the string (remove the "data:image/png;base64," prefix)
   const base64Data = imageSrc.split(',')[1];

   const imageUrl = returnUrlfromBase64(base64Data);
 
   // Open the image in a new tab
   let newTab = window.open(imageUrl, '_blank');
   newTab.document.write(`
   <html>
      <head>
        <title>Opened Image</title>
        <style>
          body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: hsl(0, 0%, 90%);
          }
          img {
            max-width: 100%;
            max-height: 100%;
            display: block;
            -webkit-user-select: none;
            margin: auto;
            cursor: zoom-in;
            transition: background-color 300ms;
          }
        </style>
      </head>
      <body>
        <img src="${imageUrl}" alt="Opened Image"/>
      </body>
    </html>
  `);
      };

  return (
    <div className="image-grid">
    {uploadedImages.map((imageobj, index) => (
      <div key={index} className="image-container">
        <button className='iconbtn' onClick={(e)=>
        {
             e.preventDefault()
            deleteImage(sizeArrIndx, index)
        }
          }>
        <Icon

                    icon="entypo:circle-with-cross"
                    className='imageDeleteIcon'
                  

                    

        />
       </button>
        <img src={imageobj.imageSrc} alt={`Image ${index + 1}`} className="image"  onClick={() => openImageInNewTab(imageobj.imageSrc)} />
        {/* <div className="progress-container">
          <progress value={imageobj.uploadProgress || 0} max="100" />
        </div> */}
      </div>
    ))}
  </div>
    )

}



ImageDiv.propTypes = {
    uploadedImages: PropTypes.array,
    deleteImage: PropTypes.func,
    sizeArrIndx: PropTypes.number
};


export default ImageDiv;