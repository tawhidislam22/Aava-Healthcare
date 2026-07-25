import express,{ Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import path from "path";
import cors from "cors";
import { envVars } from "./app/config/env";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";

const app: Application = express();
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views",path.resolve(process.cwd(), `src/app/templates`) )

app.use(cors({
  origin : [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/auth',toNodeHandler(auth))

app.use('/api/v1', IndexRoutes);

app.use(globalErrorHandler)

app.use(notFound)

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

export default app;
