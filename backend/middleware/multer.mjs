import multer from "multer";
import path from "path";

const dynamicDestination = (req, file, cb) => {
    // Get the unique identifier or any other information from the request
   
  
    // Construct the destination path based on the destination recieved from client side
    const destination = path.join('../../Uploads', req.destination); 
  
    // Ensure the destination directory exists
    require('fs').mkdirSync(destination, { recursive: true });
  
    cb(null, destination);
  
  };
  
  const storage = multer.diskStorage({
    destination: dynamicDestination,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });

  export {upload};