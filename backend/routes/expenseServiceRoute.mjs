import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';
import { expenseServiceTypeApi } from '../controller/catalog/expenseServiceController.mjs';


// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, expenseServiceTypeApi.getAllExpenseServiceTypes);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, expenseServiceTypeApi.addExpenseServiceType);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, expenseServiceTypeApi.updateExpenseServiceType);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, expenseServiceTypeApi.deleteExpenseServiceType);

export default router;