import express from 'express';
import { colorApi } from '../../controller/catalog/glasspropertiescatalog/glass_colorController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';

// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, colorApi.getAllcolor);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, colorApi.addcolor);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, colorApi.updatecolor);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,colorApi.deletecolor);

export default router;