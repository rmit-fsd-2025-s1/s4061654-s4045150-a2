import { Router } from 'express'
import { AcademicsController } from '../controller/AcademicsController'

const router = Router()
const academicsController = new AcademicsController()

router.get(
  '/academics',
  async (req, res) => { await academicsController.findByApplicationId(req, res) }
)

export default router
