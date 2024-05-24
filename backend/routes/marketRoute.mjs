import express from 'express';

// const auth = require("../middleware/auth")

import { marketplaceApi } from '../controller/catalog/marketController.mjs';
import { authCompanyToken } from '../middleware/authenticate.mjs';


const router = express.Router()



router.get("/getall", authCompanyToken ,marketplaceApi.getAllMarketplaces);
router.post("/add", authCompanyToken ,marketplaceApi.addMarketplace);
router.post("/update", authCompanyToken, marketplaceApi.updateMarketplace);
router.delete("/delete", authCompanyToken, marketplaceApi.deleteMarketplace);
router.post("/select", authCompanyToken,  marketplaceApi.selectMarketplace);

export default router;