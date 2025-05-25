import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";
const router = Router();
const applicationController = new ApplicationController();

router.get("/applications", async (req, res) => {
  await applicationController.all(req, res);
});

router.post("/applications", async (req, res) => {
  await applicationController.save(req, res);
});

export default router;
