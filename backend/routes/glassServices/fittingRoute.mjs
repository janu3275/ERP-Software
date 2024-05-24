import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';

import { fittingServiceApi } from '../../controller/catalog/glass_services/fittingController.mjs';

// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, fittingServiceApi.getAllFittingServices);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, fittingServiceApi.addFittingService);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, fittingServiceApi.updateFittingService);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,fittingServiceApi.deleteFittingService);

export default router;