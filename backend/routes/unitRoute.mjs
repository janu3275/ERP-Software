import express from 'express';
import { unitApi } from '../controller/catalog/unitController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';

// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, unitApi.getAllUnit);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, unitApi.addUnit);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, unitApi.updateUnit);
router.delete("/delete",authCompanyToken, authMarketToken , authUserToken, unitApi.deleteUnit);

export default router;




