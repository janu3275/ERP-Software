import express from 'express';
import { vendorApi } from '../controller/catalog/vendorController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, vendorApi.getAllVendors);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, vendorApi.addVendor);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, vendorApi.updateVendor);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  vendorApi.deleteVendor);
router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;