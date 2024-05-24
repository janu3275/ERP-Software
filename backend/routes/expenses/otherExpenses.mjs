import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { paymentsForOtherExpensesApi } from '../../controller/expenses/otherExpenses.mjs';







// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken, authUserToken, paymentsForOtherExpensesApi.getAllPaymentsForOtherExpenses);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, paymentsForOtherExpensesApi.addPaymentForOtherExpense);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, paymentsForOtherExpensesApi.updatePaymentForOtherExpense);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  paymentsForOtherExpensesApi.deletePaymentForOtherExpense);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;

