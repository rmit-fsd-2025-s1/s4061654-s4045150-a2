import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import coursesRoutes from "./routes/courses.routes";
import applicationRoutes from "./routes/application.routes";
import applicantCoursesRoutes from "./routes/applicantCourses.routes";
import lecturerRoutes from "./routes/lecturer.routes";
import selectionRoutes from "./routes/selections.routes";
import rankingRoutes from "./routes/rankings.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route registration
app.use("/api", userRoutes);
app.use("/api", coursesRoutes);
app.use("/api", applicationRoutes);
app.use("/api", applicantCoursesRoutes);
app.use("/api", lecturerRoutes);
app.use("/api", selectionRoutes);
app.use("/api", rankingRoutes);

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
