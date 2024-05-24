import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { otherProductApi } from '../../controller/catalog/products/otherProductsController.mjs';



// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, otherProductApi.getAllOtherProducts);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, otherProductApi.addOtherProduct);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, otherProductApi.updateOtherProduct);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,otherProductApi.deleteOtherProduct);

export default router;