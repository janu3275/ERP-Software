import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { custPaymentHistoryApi } from '../../controller/customerManagement/payments.mjs';





// const auth = require("../middleware/auth")



const router = express.Router()



router.post("/getall/:customer_id",authCompanyToken, authMarketToken, authUserToken, custPaymentHistoryApi.getAllPaymentsByCustomer);
router.get("/getallcustomerpayments",authCompanyToken, authMarketToken, authUserToken, custPaymentHistoryApi.getAllCustomerPayments);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, custPaymentHistoryApi.addCustomerPayment);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, custPaymentHistoryApi.updatePayment);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  custPaymentHistoryApi.deletePayment);

// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;


