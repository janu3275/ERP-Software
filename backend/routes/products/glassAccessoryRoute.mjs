import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { glassAccessoryApi } from '../../controller/catalog/products/glassAccessoryController.mjs';

// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, glassAccessoryApi.getAllGlassAccessory);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, glassAccessoryApi.addGlassAccessory);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, glassAccessoryApi.updateGlassAccessory);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,glassAccessoryApi.deleteGlassAccessory);

export default router;