import { Elysia } from "elysia";
import { HealthCheckHandler } from "../handlers/health-check";
import { ApplicationHandler, CreateApplicationHandler, DeleteApplicationHandler, UpdateApplicationHandler } from "../handlers/application";
import { ValidateTraceidMiddleware } from "../middleware/validate-header";
import { JobTypeHandler, CreateJobTypeHandler, DeleteJobTypeHandler, UpdateJobTypeHandler } from "../handlers/job-type";

const router = new Elysia()
  .get("/", HealthCheckHandler)
  .use(ValidateTraceidMiddleware)
  .get("/application", (context) => ApplicationHandler(context))
  .post("/application", (context) => CreateApplicationHandler(context))
  .put("/application/:id", (context) => UpdateApplicationHandler(context as any))
  .delete("/application/:id", (context) => DeleteApplicationHandler(context as any))
  .get("/job-type", (context) => JobTypeHandler(context))
  .post("/job-type", (context) => CreateJobTypeHandler(context))
  .put("/job-type/:id", (context) => UpdateJobTypeHandler(context as any))
  .delete("/job-type/:id", (context) => DeleteJobTypeHandler(context as any));

export default router;
