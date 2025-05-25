import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
// import userRoutes from "./routes/user.routes";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import coursesRoutes from "./routes/courses.routes";
import applicationRoutes from "./routes/application.routes";
import applicantCoursesRoutes from "./routes/applicantCourses.routes";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", coursesRoutes);
app.use("/api", applicationRoutes);
app.use("/api", applicantCoursesRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
