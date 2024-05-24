import express, { json } from "express";
import dotenv from "dotenv";
import registerRouter from "./routes/registerRoute.mjs";
import loginRouter from "./routes/loginRoute.mjs";
import unitRouter from "./routes/unitRoute.mjs";
import customerRouter from "./routes/customerRoute.mjs";
import customerPaymentsRouter from "./routes/customerManagement/paymentsRoute.mjs";
import vendorRouter from "./routes/vendorRoute.mjs";
import vendorBillRouter from "./routes/vendorAccounting/vendorbillRouter.mjs";
import vendorPoRouter from "./routes/vendorAccounting/vendorPoRouter.mjs";
import vendorPaymentRouter from "./routes/vendorAccounting/vendorPaymentRouter.mjs";
import employeeRouter from "./routes/employeeRoute.mjs";
import employeePaymentsRouter from "./routes/employeeManagement/paymentsRoute.mjs";
import employeeAttendanceRouter from "./routes/employeeManagement/attendanceRoute.mjs";
import orderRouter from "./routes/orderRoute.mjs";
import awsS3Router from "./routes/awsS3Route.mjs";
import marketRouter from "./routes/marketRoute.mjs";
import thicknessRouter from "./routes/glassProperties/thicknessRoute.mjs";
import colorRouter from "./routes/glassProperties/colorRoute.mjs";
import sizeRouter from "./routes/glassProperties/sizeRoute.mjs";
import typeRouter from "./routes/glassProperties/typeRoute.mjs";
import glassProductRouter from "./routes/products/glassProductRoute.mjs";
import glassInventoryRouter from "./routes/products/glassInventoryRoute.mjs";
import glassAccessoryRouter from "./routes/products/glassAccessoryRoute.mjs";
import otherProductRouter from "./routes/products/otherProductRoute.mjs";
import glassCustomRouter from "./routes/glassServices/glassCustomizationRoute.mjs";
import fittingRouter from "./routes/glassServices/fittingRoute.mjs";
import dileveryRouter from "./routes/glassServices/dileveryRoute.mjs";
import measurementRouter from "./routes/glassServices/measurement.mjs";
import departmentRouter from "./routes/departmentRouter.mjs";
import positionRouter from "./routes/positionRouter.mjs";
import emiTypeRouter from "./routes/emiTypeRoute.mjs";
import emiPaymentsRouter from "./routes/expenses/emiPayments.mjs";
import otherExpensesRouter from "./routes/expenses/otherExpenses.mjs";
import servicesUsedPaymentsRouter from "./routes/expenses/servicesUsedPayments.mjs";
import expenseServiceTypeRouter from "./routes/expenseServiceRoute.mjs";
import companyRouter from "./routes/glassProperties/companyRoute.mjs";
import messageRouter from "./routes/whatsappRoute.mjs"
import transactionRouter from "./routes/alltransactions.mjs"
import cors from "cors";
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3000;

// or any port you prefer

app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/unit", unitRouter);
app.use("/glassCustomization", glassCustomRouter);
app.use("/glassFitting", fittingRouter);
app.use("/glassMeasurement", measurementRouter);
app.use("/glassDilevery", dileveryRouter);
app.use("/glassproduct", glassProductRouter);
app.use("/glassInventory", glassInventoryRouter);
app.use("/glassAccessory", glassAccessoryRouter);
app.use("/otherProduct", otherProductRouter);
app.use("/Customer", customerRouter);
app.use("/CustomerPayment", customerPaymentsRouter);
app.use("/Vendor", vendorRouter);
app.use("/VendorBill", vendorBillRouter);
app.use("/VendorPO", vendorPoRouter);
app.use("/VendorPayment", vendorPaymentRouter);
app.use("/Department", departmentRouter);
app.use("/Position", positionRouter);
app.use("/EmiType", emiTypeRouter);
app.use("/ExpenseService", expenseServiceTypeRouter);
app.use("/employee", employeeRouter);
app.use("/employeeAttendance", employeeAttendanceRouter);
app.use("/employeePayment", employeePaymentsRouter);
app.use("/order", orderRouter);
app.use("/awsS3", awsS3Router);
app.use("/marketplace", marketRouter);
app.use("/glassThickness", thicknessRouter);
app.use("/glassColor", colorRouter);
app.use("/glassCompany", companyRouter);
app.use("/glassSize", sizeRouter);
app.use("/glassType", typeRouter);
app.use("/EmiPayments", emiPaymentsRouter);
app.use("/OtherExpensePayments", otherExpensesRouter);
app.use("/ServicesUsedPayments", servicesUsedPaymentsRouter);
app.use("/whatsapp", messageRouter);
app.use("/transactions", transactionRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shutdown = () => {
  server.close(() => {
    console.log("Server shut down gracefully.");
    process.exit(0);
  });
};

// Capture SIGINT signal (Ctrl+C) to gracefully shut down the server
process.on("SIGINT", () => {
  console.log("Received SIGINT signal");
  shutdown();
});

// Capture SIGTERM signal to gracefully shut down the server
process.on("SIGTERM", () => {    
  console.log("Received SIGTERM signal");
  shutdown();
});
