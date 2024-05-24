import express from 'express';
import { sizeApi } from '../../controller/catalog/glasspropertiescatalog/glass_sizesController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';



// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall",authCompanyToken, authMarketToken , authUserToken, sizeApi.getAllsize);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, sizeApi.addsize);
router.post("/update", authCompanyToken, authMarketToken , authUserToken,sizeApi.updatesize);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,sizeApi.deletesize);

export default router;