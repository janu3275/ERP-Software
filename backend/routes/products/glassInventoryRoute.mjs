import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { glassInventoryApi } from '../../controller/catalog/products/glassInventoryController.mjs';



// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, glassInventoryApi.getAllGlassInventory);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, glassInventoryApi.addGlassInventory);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, glassInventoryApi.updateGlassInventory);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, glassInventoryApi.deleteGlassInventory);

export default router;