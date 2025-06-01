import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comment";
import { Applications } from "../entity/Applications";
import { UserInformation } from "../entity/UserInformation";

const router = Router();
const commentRepo = AppDataSource.getRepository(Comment);

// Create a new comment
router.post("/", async (req: Request, res: Response) => {
  const { content, applicationId, lecturerId } = req.body;

  try {
    const comment = commentRepo.create({
      content,
      application: { applicationID: applicationId } as unknown as Applications,
      lecturer: { id: lecturerId } as unknown as UserInformation,
    });

    const result = await commentRepo.save(comment);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save comment" });
  }
});

// Get all comments for an application
router.get("/application/:applicationId", async (req: Request, res: Response) => {
  const { applicationId } = req.params;

  try {
    const comments = await commentRepo.find({
      where: { application: { applicationID: parseInt(applicationId) } },
      relations: ["lecturer"],
      order: { createdAt: "DESC" },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Could not retrieve comments" });
  }
});

export default router;
