import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer';












export function generateRandomId(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
  
    return result;
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

export const convertBlobToArrayBuffer = (blob) => {
  return Buffer.from(blob.buffer);
};

  export const saveFilesToLocalDisk = (files, destinationDirectory) => {
    console.log("files --->", ...files);

    if(!files || files.length===0){
        console.log("empty files --->", files)
        return 
    }
  
    // Ensure the destination directory exists
    fs.mkdirSync(destinationDirectory, { recursive: true });
  
    files.forEach((file, index) => {
      const filePath = path.join(destinationDirectory, `file_${index}_${file.fileName}`);
  
      // Create a write stream
      const writeStream = fs.createWriteStream(filePath);
  
      // Handle different types of file data
      if (file.fileType.startsWith('image/')) {
        // If the file is an image, assume base64 encoding in fileData
        const base64Data = file.imageSrc.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        writeStream.write(buffer);
      } else {
        // For other file types, assume binary data in fileData
        writeStream.write(file.imageSrc);
      }
  
      // Close the write stream
      writeStream.end();
  
      // Optional: Listen for 'finish' event to know when the file is fully written
      writeStream.on('finish', () => {
        console.log(`File ${index + 1} saved to ${filePath}`);
      });
  
      // Optional: Listen for errors
      writeStream.on('error', (error) => {
        console.error(`Error saving file ${index + 1}:`, error);
      });
    });
  };


  export const getFilesInDirectory = (directoryPath) => {
    try {
       if(!directoryPath){
        return []
       } 
      // Read the contents of the directory
      const files = fs.readdirSync(directoryPath);
  
      // Read the content and base64 of each image file and return as an array of objects
      const fileData = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const fileType = getFileType(file);
        const content = fs.readFileSync(filePath, 'base64');
        return { fileName: file, fileType, imageSrc: `data:${fileType};base64,${content}` };
      });
   
      return fileData;
    } catch (error) {
      console.error('Error reading directory:', error);
      return [];
    }
  };
  
  const getFileType = (fileName) => {
    const extension = path.extname(fileName).toLowerCase();
    switch (extension) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.gif':
        return 'image/gif';
      // Add more cases for other file types if needed
      default:
        return 'application/octet-stream'; // Default to binary data
    }
  };


  export const deleteDirectory = (directoryPath) => {
    try {
      // Delete the directory and its contents recursively
      fsExtra.removeSync(directoryPath);
      console.log(`Directory ${directoryPath} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting directory:', error);
    }
  };

  // export const returnInvoicePDF = async(data)=>{
  

  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  
  //   // Render your React component to HTML
  //   // Render your React component to HTML using React.createElement
  //   const componentElement = React.createElement(ViewOrder, { selectedorder: data });
  //   const componentHTML = ReactDOMServer.renderToStaticMarkup(componentElement);
  
  //   // Set the HTML content of the page
  //   await page.setContent(`<!DOCTYPE html><html><body>${componentHTML}</body></html>`);
  
  //   // Generate the PDF
  //   const pdfBuffer = await page.pdf();
  //   return pdfBuffer
  //   // Close the browser instance
  // }


    export const returnInvoicePDF = async(data) => {
  

  }
