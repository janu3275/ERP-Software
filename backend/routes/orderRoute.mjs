import express from 'express';

// const auth = require("../middleware/auth")


import { upload } from '../middleware/multer.mjs';
import { orderApi } from '../controller/salesOrder/orderController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';


const router = express.Router()


router.get("/getallOrders", authCompanyToken, authMarketToken , authUserToken, orderApi.getallOrders);
router.get("/getall", authCompanyToken, authMarketToken , authUserToken, orderApi.getOrdersByOrderStatus);
router.get("/getbyid",authCompanyToken, authMarketToken , authUserToken, orderApi.getOrderbyId);
router.get("/getbycustomer",authCompanyToken, authMarketToken , authUserToken, orderApi.getOrdersByCustomer);
router.get("/getcustomersummary",authCompanyToken, authMarketToken , authUserToken, orderApi.getallCustomerSummary);
router.post("/add", authCompanyToken, authMarketToken , authUserToken,orderApi.addNewOrder);
router.post("/addPaymenthis",authCompanyToken, authMarketToken , authUserToken, orderApi.addPaymentHis);
router.post("/addProduct",authCompanyToken, authMarketToken , authUserToken, orderApi.addProduct);
router.post("/updateGeneralInfo",authCompanyToken, authMarketToken , authUserToken, orderApi.updateGeneralInfo);
router.post("/updateProduct",authCompanyToken, authMarketToken , authUserToken, orderApi.updateproducts);
router.post("/updatePaymenthis",authCompanyToken, authMarketToken , authUserToken, orderApi.updatePaymentHis);
router.post("/updatePayment",authCompanyToken, authMarketToken , authUserToken, orderApi.updatePayment);
router.delete("/delete",authCompanyToken, authMarketToken , authUserToken, orderApi.deleteOrder);
router.delete("/delproduct",authCompanyToken, authMarketToken , authUserToken, orderApi.deleteProduct);
router.delete("/delPaymenthis", authCompanyToken, authMarketToken , authUserToken,orderApi.deletePaymenthis);
router.post("/updateOrderStatus",authCompanyToken, authMarketToken , authUserToken, orderApi.changeOrderstatus);
router.post("/multipleDelete",authCompanyToken, authMarketToken , authUserToken, orderApi.deleteOrders);


export default router;
