import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { glassCustomizationServiceApi } from '../../controller/catalog/glass_services/customisationController.mjs';



// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, glassCustomizationServiceApi.getAllGlassCustomizationServices);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, glassCustomizationServiceApi.addGlassCustomizationService);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, glassCustomizationServiceApi.updateGlassCustomizationService);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,glassCustomizationServiceApi.deleteGlassCustomizationService);

export default router;