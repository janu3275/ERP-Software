import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { paymentsForEMIsApi } from '../../controller/expenses/emi.mjs';





// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken, authUserToken, paymentsForEMIsApi.getAllPaymentsForEMIs);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, paymentsForEMIsApi.addPaymentForEMI);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, paymentsForEMIsApi.updatePaymentForEMI);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  paymentsForEMIsApi.deletePaymentForEMI);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;

