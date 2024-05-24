import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { paymentForServicesApi } from '../../controller/expenses/paidServices.mjs';






// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken, authUserToken, paymentForServicesApi.getAllPaymentsForServices);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, paymentForServicesApi.addPaymentForServices);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, paymentForServicesApi.updatePaymentForServices);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  paymentForServicesApi.deletePaymentForServices);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;

