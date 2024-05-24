import express from 'express';


import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { vendorPOApi } from '../../controller/vendorAccounting/vendorPOs/vendorPO.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall/:vendorId", authCompanyToken, authMarketToken , authUserToken, vendorPOApi.getAllPoByVendorId);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, vendorPOApi.addVendorPO);
router.post("/update", authCompanyToken, authMarketToken , authUserToken,vendorPOApi.updateVendorPO);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  vendorPOApi.deleteVendorPO);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;