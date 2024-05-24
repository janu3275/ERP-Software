import express from 'express';
import multer from 'multer';
const upload = multer();
// const auth = require("../middleware/auth")
import { s3Apis } from '../controller/awsS3Controller.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';


const router = express.Router();



router.get("/get_PreSigned_url", authCompanyToken, authMarketToken, authUserToken, s3Apis.getPreSignedUrls);
router.post("/uploadPdfToS3", authCompanyToken, authMarketToken, authUserToken, upload.single('pdfblob'), s3Apis.uploadInvoicePDFToS3);
router.get("/getPdfAsURLfromS3", authCompanyToken, authMarketToken, authUserToken, s3Apis.getAnyFileUrl);


export default router;