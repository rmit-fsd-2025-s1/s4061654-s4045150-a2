import { Router } from 'express'
import { ExperienceController } from '../controller/ExperienceController'

const router = Router()
const experienceController = new ExperienceController()

router.get("/experience", async (req, res) => {
  await experienceController.findByApplicationId(req, res);
});
export default router
