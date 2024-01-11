import { Elysia } from "elysia";
import { HealthCheckHandler } from "../handlers/health-check";
import { ApplicationHandler, CreateApplicationHandler, UpdateApplicationHandler } from "../handlers/application";
import { ValidateTraceidMiddleware } from "../middleware/validate-header";

const router = new Elysia()
  .get("/", HealthCheckHandler)
  .use(ValidateTraceidMiddleware)
  .get("/application", (context) => ApplicationHandler(context))
  .post("/application", (context) => CreateApplicationHandler(context))
  .put("/application/:id", (context) => UpdateApplicationHandler(context as any));

export default router;
