import express from 'express';


import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { vendorPaymentsApi } from '../../controller/vendorAccounting/vendorPaymentHis/vendorPaymentHis.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall/:vendorId", authCompanyToken, authMarketToken , authUserToken, vendorPaymentsApi.getVendorPaymentsByVendorId);
router.get("/getallvendorpayments", authCompanyToken, authMarketToken , authUserToken, vendorPaymentsApi.getAllVendorPayments);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, vendorPaymentsApi.addPaymentByVendorId);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, vendorPaymentsApi.updatePaymentByVendorId);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  vendorPaymentsApi.deletePaymentByVendorId);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;