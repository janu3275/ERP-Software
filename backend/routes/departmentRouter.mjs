import express from 'express';
import { departmentApi } from '../controller/catalog/departmentcontroller.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';


// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getall", authCompanyToken, authMarketToken , authUserToken,  departmentApi.getAllDepartments);
router.post("/add", authCompanyToken, authMarketToken , authUserToken,  departmentApi.addDepartment);
router.post("/update", authCompanyToken, authMarketToken , authUserToken,  departmentApi.updateDepartment);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken, departmentApi.deleteDepartment);

export default router;