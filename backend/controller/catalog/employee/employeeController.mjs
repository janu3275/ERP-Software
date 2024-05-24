import { asyncHandler } from "../../../middleware/asynchandler.mjs";
import { queryDB } from "../../../db.mjs";
import Joi from "joi";
import { deleteDirectory, generateRandomId, getFilesInDirectory, saveFilesToLocalDisk } from "../../../utils/commonFunction.mjs";

const updateEmployeeTaskCapable = async (employeeId, taskCapable) => {
    try {
        // Delete existing task_capable entries for the employee
        const deleteTasksQuery = `
            DELETE FROM employee_tasks
            WHERE employee_id = $1;`;
        await queryDB(deleteTasksQuery, [employeeId]);

        // Insert task_capable into employee_tasks table
        const insertTaskQueries = taskCapable.map(taskId => {
            const insertTaskQuery = `
                INSERT INTO employee_tasks (employee_id, task_id) VALUES ($1, $2);`;
            return queryDB(insertTaskQuery, [employeeId, taskId]);
        });

        await Promise.all(insertTaskQueries);
        return true; // Success
    } catch (error) {
        console.error("Error updating task_capable:", error);
        throw error;
    }
};

const employeeApi = {
    addEmployee: asyncHandler(async (req, res, next) => {
        console.log("entered add employee")
        const market_id = req.market.market_id;
        // BODY VALIDATION
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email(),
            phone_number: Joi.string().allow(null),
            whatsapp_number: Joi.string().allow(null),
            date_of_birth: Joi.date(),
            address: Joi.string().allow(null),
            city: Joi.string().allow(null),
            state_province: Joi.string().allow(null),
            country: Joi.string().allow(null),
            postal_code: Joi.string().allow(null),
            department_id: Joi.number().integer().required(),
            department_name: Joi.string(),
            position_id: Joi.number().integer().required(),
            position_name: Joi.string(),
            emergency_contact_name: Joi.string().required(),
            emergency_contact_phone: Joi.string().required(),
            employee_photo: Joi.object().allow(null),
            notes_comments: Joi.string().allow(null).allow(''),
            market_id: Joi.number().integer().required(),
            bank: Joi.string().required(),
            account_number: Joi.string().required(),
            ifsc_code: Joi.string().required(),
            salary: Joi.number().required()
        });

        let body = {
            ...req.body,
            market_id
        };
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

        // PROCEEDING TOWARDS ADDING EMPLOYEE
        let addEmployeeQuery = `
            INSERT INTO employee_info (
                first_name, last_name, email, phone_number,whatsapp_number, date_of_birth, address, 
                city, state_province, country, postal_code, department_id, position_id, 
                emergency_contact_name, emergency_contact_phone, 
                employee_photo, notes_comments, market_id,
                bank,  account_number, ifsc_code, salary
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            RETURNING *;`;

        try {
            let files = value.employee_photo?[value.employee_photo]:[];
            let item_Id = `I-${generateRandomId(7)}`;
            let itemPath = `./Uploads/${Date.now()}/employeeID-${item_Id}`;
            console.log("lkl")
            const addedEmployee = (await queryDB(addEmployeeQuery, [
                body.first_name, body.last_name, body.email, body.phone_number,body.whatsapp_number, body.date_of_birth,
                body.address, body.city, body.state_province, body.country, body.postal_code,
                body.department_id, body.position_id,
                body.emergency_contact_name, body.emergency_contact_phone, itemPath,
                body.notes_comments, body.market_id,
                body.bank, body.account_number, body.ifsc_code, body.salary
            ])).rows[0];
            console.log("lklff")
            if (addedEmployee) {
                // Inserting task_capable into employee_tasks table
                // const taskCapablePromises = body.task_capable.map(taskId => {
                //     const insertTaskQuery = `
                //         INSERT INTO employee_tasks (employee_id, task_id) VALUES ($1, $2);`;
                //     return queryDB(insertTaskQuery, [addedEmployee.employee_id, taskId]);
                // });

                // await Promise.all(taskCapablePromises);
                saveFilesToLocalDisk(files, itemPath); // saving files to path
                res.status(200).json({
                    success: true,
                    message: "Employee added successfully",
                    data: addedEmployee,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in creating new employee",
                    data: addedEmployee,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Creating error", error: error });
        }
    }),

    updateEmployee: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            employee_id: Joi.number().integer().required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            phone_number: Joi.string().required(),
            whatsapp_number: Joi.string().allow(null),
            date_of_birth: Joi.date(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            state_province: Joi.string().required(),
            country: Joi.string().required(),
            postal_code: Joi.string().required(),
            department_id: Joi.number().integer().required(),
            department_name: Joi.string(),
            position_id: Joi.number().integer().required(),
            position_name: Joi.string(),
            emergency_contact_name: Joi.string().required(),
            emergency_contact_phone: Joi.string().required(),
            employee_photo: Joi.object().allow(null),
            notes_comments: Joi.string().allow(null).default(null),
            bank: Joi.string().required(),
            account_number: Joi.string().required(),
            ifsc_code: Joi.string().required(),
            salary: Joi.number().required()
        });

        let body = req.body;
        const { error, value } = schema.validate(body);

        // HANDLE VALIDATION ERROR
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details
            });
        }

        const getEmployeeByIdQry = `select employee_photo from employee_info where id = $1`;

        // PROCEEDING TOWARDS UPDATING EMPLOYEE
        let updateEmployeeQuery = `
            UPDATE employee_info 
            SET 
                first_name = $1, last_name = $2, email = $3, phone_number = $4, date_of_birth = $5,
                address = $6, city = $7, state_province = $8, country = $9, postal_code = $10,
                department_id = $11, position_id = $12, emergency_contact_name = $13, emergency_contact_phone = $14,
                employee_photo = $15, notes_comments = $16, whatsapp_number = $17,
                bank = $18, account_number = $19, ifsc_code = $20, salary = $21
            WHERE
                id = $22
            RETURNING *;`;

        try {

            const prevPath = (
                await queryDB(getEmployeeByIdQry, [value.employee_id])
            ).rows[0]?.employee_photo;

            const updatedEmployee = (await queryDB(updateEmployeeQuery, [
                body.first_name, body.last_name, body.email, body.phone_number, body.date_of_birth,
                body.address, body.city, body.state_province, body.country, body.postal_code,
                body.department_id, body.position_id, body.emergency_contact_name, body.emergency_contact_phone,
                prevPath, body.notes_comments, body.whatsapp_number,
                body.bank, body.account_number, body.ifsc_code, body.salary,
                body.employee_id
            ])).rows[0];

            if (updatedEmployee) {

                let files = value.employee_photo?[value.employee_photo]:[];
                deleteDirectory(prevPath)
                saveFilesToLocalDisk(files, prevPath) // saving files to path

                res.status(200).json({
                    success: true,
                    message: "Employee updated successfully",
                    data: updatedEmployee
                });

            } else {
                res.status(404).json({
                    success: false,
                    message: "Employee not found or cannot be updated",
                    data: null
                });
            }

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Error updating employee",
                error: error.message
            });

        }
    }),

    deleteEmployee: asyncHandler(async (req, res, next) => {
        // BODY VALIDATION
        const schema = Joi.object({
            employee_id: Joi.number().integer().required(),
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

        // PROCEEDING TOWARDS DELETING EMPLOYEE
        let deleteEmployeeQuery = `
            DELETE FROM employee_info
            WHERE id = $1
            RETURNING *;`;
        try {
            const deletedEmployee = (await queryDB(deleteEmployeeQuery, [value.employee_id])).rows[0]
            if (deletedEmployee) {
                const prevPath = deletedEmployee.employee_photo
                deleteDirectory(prevPath)

                res.status(200).json({
                    success: true,
                    message: "Employee deleted successfully",
                    data: deletedEmployee,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in deleting employee",
                    data: deletedEmployee,
                });
            }
        } catch (error) {
            return res.status(200).json({ success: false, message: "Deleting error", error: error });
        }
    }),

    getAllEmployees: asyncHandler(async (req, res, next) => {
        const market_id = req.market.market_id;
        // BODY VALIDATION
        const schema = Joi.object({
            market_id: Joi.number().integer().required(),
        });
    
        let body = {
            market_id
        };
        const { error, value } = schema.validate(body);
    
        // HANDLE VALIDATION ERROR
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details
            });
        }
        // PROCEEDING TOWARDS GETTING ALL EMPLOYEES
        let getAllEmployeesQuery = `
            SELECT 
                e.id AS id,
                e.first_name,
                e.last_name,
                e.email,
                e.phone_number,
                e.whatsapp_number,
                e.date_of_birth,
                e.address,
                e.city,
                e.state_province,
                e.country,
                e.postal_code,
                d.department_name,
                p.position_name,
                e.emergency_contact_name,
                e.emergency_contact_phone,
                e.employee_photo,
                e.notes_comments,
                e.bank,
                e.account_number,
                e.ifsc_code,
                e.salary
            FROM 
                employee_info e
            JOIN 
                departments d ON e.department_id = d.id
            JOIN 
                positions p ON e.position_id = p.id
            WHERE
                e.market_id = $1; 
        `;
        try {
            let allEmployees = (await queryDB(getAllEmployeesQuery, [value.market_id])).rows
           console.log("llll")
            allEmployees = allEmployees.map((employee) => {
                console.log(employee, getFilesInDirectory(employee.employee_photo))
                return {
                    ...employee,
                    employee_photo: getFilesInDirectory(employee.employee_photo)
                }
             })
            console.log("reached", allEmployees)
            if (allEmployees) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: allEmployees,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting employees",
                    data: allEmployees,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Fetching error", error: error });
        }
    }),


    getEmployeeInfoByid: asyncHandler(async (req, res, next) => {
        
        // BODY VALIDATION
        const schema = Joi.object({
            employee_id: Joi.number().integer().required(),
        });
    
        let body = {
            ...req.params
        };
        const { error, value } = schema.validate(body);
    
        // HANDLE VALIDATION ERROR
        if (error) {
            console.log(error.details);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.details
            });
        }
        // PROCEEDING TOWARDS GETTING ALL EMPLOYEES
        let getAllEmployeesQuery = `
            SELECT 
                e.id AS id,
                e.first_name,
                e.last_name,
                e.email,
                e.phone_number,
                e.whatsapp_number,
                e.date_of_birth,
                e.address,
                e.city,
                e.state_province,
                e.country,
                e.postal_code,
                d.department_name,
                p.position_name,
                e.emergency_contact_name,
                e.emergency_contact_phone,
                e.employee_photo,
                e.notes_comments,
                e.bank,
                e.account_number,
                e.ifsc_code,
                e.salary
            FROM 
                employee_info e
            JOIN 
                departments d ON e.department_id = d.id
            JOIN 
                positions p ON e.position_id = p.id
            WHERE
                e.id = $1; 
        `;
        try {
            let EmployeeInfo = (await queryDB(getAllEmployeesQuery, [value.employee_id])).rows[0]
            

            EmployeeInfo =  {
                    ...EmployeeInfo,
                    employee_photo: getFilesInDirectory(EmployeeInfo.employee_photo)
                }
            
            if (EmployeeInfo) {
                res.status(200).json({
                    success: true,
                    message: "Request successful",
                    data: EmployeeInfo,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Problem in getting employees",
                    data: EmployeeInfo,
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Fetching error", error: error });
        }
    })
    
};

export { employeeApi };