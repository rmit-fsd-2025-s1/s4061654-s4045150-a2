import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Comments } from "../entity/Comments";
import { UserInformation } from "../entity/UserInformation";
import { Applications } from "../entity/Applications";

const router = Router();
const commentRepo = AppDataSource.getRepository(Comments);

// Create a new comment
router.post("/", async (req, res) => {
  const { content, applicationId, lecturerId } = req.body;

  try {
    const newComment = commentRepo.create({
      content,
      application: { applicationID: applicationId } as unknown as Applications,
      lecturer: { id: lecturerId } as unknown as UserInformation,
    });

    const saved = await commentRepo.save(newComment);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to save comment" });
  }
});

// Get all comments for a specific application
router.get("/application/:applicationId", async (req, res) => {
  const { applicationId } = req.params;

  try {
    const comments = await commentRepo.find({
      where: { application: { applicationID: parseInt(applicationId) } },
      relations: ["lecturer"],
      order: { createdAt: "DESC" },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
});

export default router;
