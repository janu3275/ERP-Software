import PropTypes from 'prop-types';
import "./profileimage.css";


const ProfileImage = ({ uploadedImage }) => {

  console.log(uploadedImage)

  return (
   
    
      <div  className="profile-container" onClick={(e)=> {
        console.log("clicked")
        e.preventDefault()
        document.getElementById('profileupload').click()
        }}>
            <div>
            Photo
            </div>
     
        {uploadedImage?.imageSrc ? <img src={uploadedImage.imageSrc} alt={`Profile pic`} className="profilepic"  />:<div></div>}
        {/* <div className="progress-container">
          <progress value={imageobj.uploadProgress || 0} max="100" />
        </div> */}
      </div>
   
  
    )

}



ProfileImage.propTypes = {
    uploadedImage: PropTypes.object
    
};


export default ProfileImage;