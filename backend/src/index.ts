import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import cors from "cors";

import userRoutes from "./routes/user.routes";
import coursesRoutes from "./routes/courses.routes";
import applicationRoutes from "./routes/application.routes";
import applicationcoursesRoutes from "./routes/applicationcourses.routes";
import lecturerRoutes from "./routes/lecturercourses.routes";
import selectionRoutes from "./routes/selections.routes";
import rankingRoutes from "./routes/rankings.routes";
import commentRoutes from "./routes/comment.routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route registration
app.use("/api", userRoutes);
app.use("/api", coursesRoutes);
app.use("/api", applicationRoutes);
app.use("/api", applicationcoursesRoutes);
app.use("/api", lecturerRoutes);
app.use("/api", selectionRoutes);
app.use("/api", rankingRoutes);
app.use("/api/comments", commentRoutes);

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
