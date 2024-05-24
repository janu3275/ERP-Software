import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { measurementServiceApi } from '../../controller/catalog/glass_services/measurementController.mjs';




// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, measurementServiceApi.getAllMeasurementServices);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, measurementServiceApi.addMeasurementService);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, measurementServiceApi.updateMeasurementService);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,measurementServiceApi.deleteMeasurementService);

export default router;