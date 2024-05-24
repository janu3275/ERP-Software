import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { deliveryServiceApi } from '../../controller/catalog/glass_services/dileveryController.mjs';

// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, deliveryServiceApi.getAllDeliveryServices);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, deliveryServiceApi.addDeliveryService);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, deliveryServiceApi.updateDeliveryService);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,deliveryServiceApi.deleteDeliveryService);

export default router;