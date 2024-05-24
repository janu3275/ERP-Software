import express from 'express';
import { employeeApi } from '../controller/catalog/employee/employeeController.mjs';
import { authCompanyToken, authMarketToken, authUserToken } from '../middleware/authenticate.mjs';

// const auth = require("../middleware/auth")

const router = express.Router()

router.get("/getall", authCompanyToken, authMarketToken , authUserToken,  employeeApi.getAllEmployees);
router.get("/getbyid/:employee_id", authCompanyToken, authMarketToken , authUserToken,  employeeApi.getEmployeeInfoByid);
router.post("/add", authCompanyToken, authMarketToken , authUserToken, employeeApi.addEmployee);
router.post("/update", authCompanyToken, authMarketToken , authUserToken, employeeApi.updateEmployee);
router.delete("/delete", authCompanyToken, authMarketToken , authUserToken,  employeeApi.deleteEmployee);

export default router;
