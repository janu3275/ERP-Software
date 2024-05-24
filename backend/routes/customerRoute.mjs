import express from 'express';
import { customerApi } from '../controller/catalog/customerController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';
// const auth = require("../middleware/auth")



const router = express.Router()



router.post("/getall", authCompanyToken, authMarketToken, authUserToken, customerApi.getAllCustomer);
router.get("/getbyid/:customerid", authCompanyToken, authMarketToken, authUserToken, customerApi.getCustomerbyid);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, customerApi.addCustomer);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, customerApi.updateCustomer);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, customerApi.deleteCustomer);

export default router;

