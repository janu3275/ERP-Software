import express from 'express';

import { vendorBillsApi } from '../../controller/vendorAccounting/vendorBills/vendorBills.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.post("/getall",authCompanyToken, authMarketToken , authUserToken, vendorBillsApi.getVendorBillsByVendorId);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, vendorBillsApi.addBillByVendorId);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, vendorBillsApi.updateVendorBill);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  vendorBillsApi.deleteVendorBill);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;