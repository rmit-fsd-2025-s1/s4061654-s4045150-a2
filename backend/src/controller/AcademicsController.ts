import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Academics } from '../entity/Academics'

export class AcademicsController {
  private academicsRepo = AppDataSource.getRepository(Academics)

  async findByApplicationId(request: Request, response: Response) {
    const appIdRaw = request.query.applicationId
    if (!appIdRaw) {
      return response.status(400).json({ message: 'Missing applicationId' })
    }
    const applicationId = parseInt(appIdRaw as string, 10)
    if (isNaN(applicationId)) {
      return response.status(400).json({ message: 'Invalid applicationId' })
    }

    try {
      const items = await this.academicsRepo.find({
        where: { application: { applicationID: applicationId } },
      })
      return response.json(items)
    } catch (err) {
      console.error('Error in AcademicsController.findByApplicationId:', err)
      return response.status(500).json({ message: 'Failed to fetch academics' })
    }
  }
}
