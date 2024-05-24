import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { paymentHistoryApi } from '../../controller/employeeMangaement/payments.mjs';




// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall/:employee_id",authCompanyToken, authMarketToken, authUserToken, paymentHistoryApi.getAllPaymentsByEmployee);
router.get("/getallemployeepayments",authCompanyToken, authMarketToken, authUserToken, paymentHistoryApi.getAllEmployeePayments);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, paymentHistoryApi.addEmployeePayment);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, paymentHistoryApi.updatePayment);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  paymentHistoryApi.deletePayment);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;

