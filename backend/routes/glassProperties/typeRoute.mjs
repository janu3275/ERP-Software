import express from 'express';

import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { glassTypeApi } from '../../controller/catalog/glasspropertiescatalog/glass_typeController.mjs';






// const auth = require("../middleware/auth")




const router = express.Router();



router.get("/getall", authCompanyToken, authMarketToken , authUserToken, glassTypeApi.getAllglass_type);
router.post("/add",authCompanyToken, authMarketToken , authUserToken, glassTypeApi.addglasstype);
router.post("/update",authCompanyToken, authMarketToken , authUserToken, glassTypeApi.updateglass_type);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, glassTypeApi.deleteglass_type);

export default router;