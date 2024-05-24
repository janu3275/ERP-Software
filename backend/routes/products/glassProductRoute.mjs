import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { glassProductApi } from '../../controller/catalog/products/glassProductController.mjs';


// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, glassProductApi.getAllGlassProducts);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, glassProductApi.addGlassProduct);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, glassProductApi.updateGlassProduct);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,glassProductApi.deleteGlassProduct);

export default router;