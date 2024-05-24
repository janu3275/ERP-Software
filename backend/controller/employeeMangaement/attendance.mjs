import Joi from "joi";
import { queryDB } from "../../db.mjs";
import { asyncHandler } from "../../middleware/asynchandler.mjs";
import { getFilesInDirectory } from "../../utils/commonFunction.mjs";

const employeeAttendanceApi = {
  addAllAttendanceByDate: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      date: Joi.date().iso().required(),
      attendance: Joi.array()
        .items(
          Joi.object({
            employee_id: Joi.number().integer().required(),
            attendance_status: Joi.string()
              .valid("present", "absent")
              .required(),
          })
        )
        .required(),
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS ADDING EMPLOYEE ATTENDANCE
    const addAttendanceQuery = `
            INSERT INTO employee_attendance (employee_id, attendance_date, attendance_status, note)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

    const attendanceData = value.attendance.map((emp) => {
      return [
        emp.employee_id,
        value.date,
        emp.attendance_status,
        "Daily attendance",
      ];
    });

    try {
    

      const addedqueries = attendanceData.map((data) => queryDB(addAttendanceQuery, data))
  
      console.log(addedqueries)
      let addedAttendances = await Promise.all(addedqueries);
      addedAttendances = addedAttendances.map((att)=>att.rows)

   

      if (addedAttendances.length > 0) {
        res.status(200).json({
          success: true,
          message: "Employee attendance added successfully",
          data: addedAttendances,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding employee attendance",
          data: null,
        });
      }
    } catch (error) {
     
      return res
        .status(500)
        .json({
          success: false,
          message: "Adding error",
          error: error.message,
        });
    }
  }),

  updateAllAttendanceByDate: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      date: Joi.date().required(),
      attendance: Joi.array()
        .items(
          Joi.object({
            employee_id: Joi.number().integer().required(),
            attendance_status: Joi.string()
              .valid("present", "absent")
              .required(),
          })
        )
        .required(),
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // DELETE EXISTING ATTENDANCE RECORDS FOR THE GIVEN DATE AND EMPLOYEE IDs
    const deleteAttendanceQuery = `
       DELETE FROM employee_attendance 
      WHERE attendance_date = $1 
     
`;


    try {

  
      await queryDB(deleteAttendanceQuery, [value.date]);  // deleting attendance record for the date
   

    // PROCEEDING TOWARDS ADDING EMPLOYEE ATTENDANCE
    const addAttendanceQuery = `
            INSERT INTO employee_attendance (employee_id, attendance_date, attendance_status, note)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`;

    const attendanceData = value.attendance.map((emp) => {
      return [
        emp.employee_id,
        value.date,
        emp.attendance_status,
        "Daily attendance",
      ];
    });

    const addedqueries = attendanceData.map((data) => queryDB(addAttendanceQuery, data))
  
      console.log(addedqueries)
      let addedAttendances = await Promise.all(addedqueries);
      addedAttendances = addedAttendances.map((att)=>att.rows)


  

      if (addedAttendances.length > 0) {
        res.status(200).json({
          success: true,
          message: "Employee attendance added successfully",
          data: addedAttendances,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding employee attendance",
          data: null,
        });
      }
    } catch (error) {
  
      return res
        .status(500)
        .json({
          success: false,
          message: "Adding error",
          error: error.message,
        });
    }
  }),

  deleteAllAttendanceByDate: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      date: Joi.date().required(),
     
    });

    let body = req.query;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // DELETE EXISTING ATTENDANCE RECORDS FOR THE GIVEN DATE AND EMPLOYEE IDs
    const deleteAttendanceQuery = `
       DELETE FROM employee_attendance 
      WHERE attendance_date = $1 returning *;
     
`;


    try {

    

     const deletedEntry =  await queryDB(deleteAttendanceQuery, [value.date]);  // deleting attendance record for the date
   

 

   

      if (deletedEntry) {
        res.status(200).json({
          success: true,
          message: "Employee attendance added successfully",
          data: deletedEntry,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding employee attendance",
          data: null,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(500)
        .json({
          success: false,
          message: "Adding error",
          error: error.message,
        });
    }
  }),

  getAllAttendanceByDate: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      date: Joi.date().required(),
     
    });

    let body = req.params;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    
     // PROCEEDING TOWARDS FETCHING ATTENDANCE datewise
     const getAttendanceQuery = `
     SELECT 
    ea.employee_id as id,
    ea.attendance_date,
    ea.attendance_status,
    ea.note,
    ei.employee_photo,
    ei.first_name,
    ei.last_name,
    ei.address,
    d.department_name,
    p.position_name
FROM 
    employee_attendance ea
INNER JOIN 
    employee_info ei ON ea.employee_id = ei.id
INNER JOIN 
    departments d ON ei.department_id = d.id
INNER JOIN 
    positions p ON ei.position_id = p.id
WHERE 
    ea.attendance_date = $1;

 `;

   

    try {
      await queryDB("BEGIN");

      let attendanceDayWise = (await queryDB(getAttendanceQuery, [value.date])).rows;
       attendanceDayWise = attendanceDayWise.map((employee) => {
        return {
          ...employee,
          employee_photo: getFilesInDirectory(employee.employee_photo) 
        }
       })
      await queryDB("COMMIT");
     
      if (attendanceDayWise) {

        res.status(200).json({
          success: true,
          message: "all Employee attendance retrieved successfully",
          data: attendanceDayWise,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding retrieving attendance",
          data: null,
        });
      }
    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(500)
        .json({
          success: false,
          message: "Adding error",
          error: error.message,
        });
    }
  }),

  updateAttendance: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      attendance_date: Joi.date().required(),
      attendance_id: Joi.number().integer().required(),
      note: Joi.string().allow("").required(),
      attendance_status: Joi.string().valid("present", "absent").required(),
    });

    let body = req.body;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS UPDATING EMPLOYEE ATTENDANCE
    const updateAttendanceQuery = `
            UPDATE employee_attendance
            SET attendance_status = $1, note = $2
            WHERE id = $3
            RETURNING *;`;

    try {
      const updatedAttendance = (
        await queryDB(updateAttendanceQuery, [
          value.attendance_status,
          value.note,
          value.attendance_id,
        ])
      ).rows[0];
      if (updatedAttendance) {
        res.status(200).json({
          success: true,
          message: "Employee attendance updated successfully",
          data: updatedAttendance,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in updating employee attendance",
          data: updatedAttendance,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Updating error", error: error });
    }
  }),

  deleteAttendance: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      attendance_id: Joi.number().integer().required(),
    });

    let body = req.query;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS DELETING EMPLOYEE ATTENDANCE
    const deleteAttendanceQuery = `
            DELETE FROM employee_attendance WHERE id = $1
            RETURNING *;`;

    try {
      const deletedAttendance = (
        await queryDB(deleteAttendanceQuery, [value.attendance_id])
      ).rows[0];
      if (deletedAttendance) {
        res.status(200).json({
          success: true,
          message: "Employee attendance deleted successfully",
          data: deletedAttendance,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in deleting employee attendance",
          data: deletedAttendance,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Deleting error", error: error });
    }
  }),

 

  getAllAttendance: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const schema = Joi.object({
      employee_id: Joi.number().integer().required(),
    });

    let body = req.params;
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(200).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    // PROCEEDING TOWARDS FETCHING EMPLOYEE ATTENDANCE
    const getAttendanceQuery = `
            SELECT * FROM employee_attendance WHERE employee_id = $1;
        `;

    try {
      const allAttendance = (
        await queryDB(getAttendanceQuery, [value.employee_id])
      ).rows;
      if (allAttendance) {
        res.status(200).json({
          success: true,
          message: "Employee attendance retrieved successfully",
          data: allAttendance,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in getting employee attendance",
          data: allAttendance,
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ success: false, message: "Fetching error", error: error });
    }
  }),

  getMonthAttendancestatus: asyncHandler(async (req, res, next) => {
    // BODY VALIDATION
    const dateobj =  JSON.parse(decodeURIComponent(req.params.dateobj));

    console.log("dateobj", dateobj)

    const {month, year} = dateobj;

    const schema = Joi.object({
      dateobj: Joi.object().required(),
     
    });

    let body = {
      dateobj:dateobj
    }
    const { error, value } = schema.validate(body);

    // HANDLE VALIDATION ERROR
    if (error) {
      console.log(error.details);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details,
      });
    }

    
     // PROCEEDING TOWARDS FETCHING ATTENDANCE datewise
     const getAttendanceQuery = `
     SELECT 
    attendance_date,
    COUNT(*) AS attendance_count
FROM 
    employee_attendance
WHERE 
    EXTRACT(YEAR FROM attendance_date) = $1
    AND EXTRACT(MONTH FROM attendance_date) = $2
GROUP BY 
    attendance_date
ORDER BY 
    attendance_date;


 `;

   

    try {
      await queryDB("BEGIN");

      let attendanceMarkedDays = (await queryDB(getAttendanceQuery, [year, month])).rows;
      
      await queryDB("COMMIT");
     
      if (attendanceMarkedDays) {

        res.status(200).json({
          success: true,
          message: "Attendance status retrieved successfully",
          data: attendanceMarkedDays,
        });
      } else {
        res.status(200).json({
          success: false,
          message: "Problem in adding retrieving attendance",
          data: null,
        });
      }

    } catch (error) {
      await queryDB("ROLLBACK");
      return res
        .status(500)
        .json({
          success: false,
          message: "Adding error",
          error: error.message,
        });
    }
  })
};

const getAllAttendaceFilteredQry = `SELECT *
FROM employee_attendance
WHERE employee_id = $1
  AND ($2 IS NULL OR attendance_date >= $2)
  AND ($3 IS NULL OR attendance_date <= $3)
  AND ($4 IS NULL OR attendance_status = $4)
  AND ($5 IS NULL OR note LIKE '%' || $5 || '%')`

export { employeeAttendanceApi };
