import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand , PutObjectCommand} from "@aws-sdk/client-s3";
import { asyncHandler } from "../middleware/asynchandler.mjs"; 
import { queryDB } from "../db.mjs";
import bcrypt from "bcrypt";
import Joi from "joi";
import { postCompanyInfo } from "../queries/authqueries.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { convertBlobToArrayBuffer, returnInvoicePDF } from "../utils/commonFunction.mjs";

dotenv.config();

const client = new S3Client({
  credentials:{
    accessKeyId: process.env.AWS_MANAGER_ACCESS_KEY,
    secretAccessKey: process.env.AWS_MANAGER_SECRET_KEY,
  },
  region: process.env.AWS_REGION
});





const s3Apis = {



  getPreSignedUrls: asyncHandler( async (req, res, next) => {
    // BODY VALIDATION

    const schema = Joi.object({
      type: Joi.string().required(),
      fileName: Joi.string().required(),
      fileType: Joi.string().valid("image/jpeg", "image/png").required(),
      companyName: Joi.string().required(),
      gstNumber: Joi.string()
        .regex(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)
        .message(
          "Invalid GST number. It should be 15 characters long and follow the specified format."
        )
        .required(),
      customerId: Joi.string().required(),
      orderId: Joi.string().required(),
      productIdarr: Joi.array().items(Joi.string()).required(),
    });

    let body = req.query;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS GETTING PRESIGNED URL ---------

    const {
      customerId,
      orderId,
      productIdarr,
      fileType,
      fileName,
      companyName,
      gstNumber,
      type
    } = value;

  
      const Urls = [];

      // Generate pre-signed URLs for each product
      for (const productId of productIdarr) {

        const filename = `product_${productId}_${new Date().toISOString()}_${fileName}.jpg`; // Adjust the filename as needed

        const key = `${customerId}/${orderId}/${productId}/${filename}`;

        const ObjectParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          ContentType: fileType,
          Expires: 60 // The URL will expire in 60 seconds
        };

        const command = type === 'upload' ? new PutObjectCommand(ObjectParams): new GetObjectCommand(ObjectParams);

        try {

          const Url = await getSignedUrl(client, command, { expiresIn: 3600 });
          Urls.push({ productId, Url });

        } catch (error) {

          console.error(
            `Error generating pre-signed URL for productId ${productId}:`,
            error.message
          );
          // Handle the error as needed, e.g., logging or returning an error response
          Urls.push({ productId, error: `Failed to generate URL: ${error}`, Url:"" });

        }
      }

      res.status(200).json({ success: true, Urls });
    
  }),

  uploadInvoicePDFToS3 : asyncHandler( async (req, res, next) => {
    const market_id = req.market.market_id;
    const pdfFile = req.file;
    const schema = Joi.object({
      pdfFile: Joi.any().required(),
      orderno: Joi.string().required(),
      market_id: Joi.number().integer().required()
    });

    let body = {
      ...req.body,
      pdfFile,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    console.log("pdfFile-->", value.pdfFile)

    const fileContent = convertBlobToArrayBuffer(value.pdfFile) ;
    console.log("filecontent,", fileContent)
    const path = `${market_id}/orderNo-${value.orderno}.pdf`
   
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: path, // Replace with the desired path and file name in the S3 bucket
      ContentType: "application/pdf",
      Body: fileContent
    };

    const command = new PutObjectCommand(params)
  
    try {

      const data = await client.send(command);
      console.log('File uploaded successfully:', data);
      res
      .status(200)
      .json({
          success: true,
          message: "File uploaded successfully",
          data: data
        }); 

    } catch (err) {

      console.error('Error uploading file:', err);
      return res
            .status(200)
            .json({ success: false, message: "creating error", error: error });
    }

  }),

  getAnyFileUrl : asyncHandler( async (req, res, next) => {

    const market_id = req.market.market_id;

    const schema = Joi.object({
     orderno: Joi.string().required(),
     market_id: Joi.number().integer().required()
    });

    let body = {
      ...req.query,
      market_id
    };

    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR

    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    const path = `${market_id}/orderNo-${value.orderno}.pdf`

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: path,
      Expires: 3600
    };

    const command = new GetObjectCommand(params);
  
    try {

      const url = await getSignedUrl(client, command, { expiresIn: 3600 });
      console.log('File URL:', url);
      
      res
      .status(200)
      .json({
          success: true,
          message: "get request successfully",
          data: url
        }); 

    } catch (err) {
      console.error('Error getting file URL:', err);
      return res
            .status(200)
            .json({ success: false, message: "creating error", error: error });
    }

  })

  
};

export { s3Apis };
