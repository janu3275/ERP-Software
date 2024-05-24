import express from 'express';
import { authCompanyToken, authMarketToken, authUserToken } from '../../middleware/authenticate.mjs';
import { employeeAttendanceApi } from '../../controller/employeeMangaement/attendance.mjs';



// const auth = require("../middleware/auth")



const router = express.Router()



router.get("/getByEmployee/:employee_id",authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.getAllAttendance);
router.get("/getbydate/:date",authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.getAllAttendanceByDate);
router.get("/getMarkedDays/:dateobj",authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.getMonthAttendancestatus);
router.post("/addbydate", authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.addAllAttendanceByDate);
router.post("/updatebydate", authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.updateAllAttendanceByDate);
router.post("/updateByEmployee", authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.updateAttendance);
router.delete("/deleteByEmployee", authCompanyToken, authMarketToken , authUserToken,  employeeAttendanceApi.deleteAttendance);
router.delete("/deletebydate", authCompanyToken, authMarketToken , authUserToken, employeeAttendanceApi.deleteAllAttendanceByDate);
// router.get("/getbyid/:vendorId",authCompanyToken, authMarketToken , authUserToken, vendorApi.getVendorById);

export default router;

