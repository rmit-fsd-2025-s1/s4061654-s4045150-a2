import { Request, Response } from 'express'
import { AppDataSource } from '../data-source'
import { Experience } from '../entity/Experience'

export class ExperienceController {
  private experienceRepo = AppDataSource.getRepository(Experience)

  async findByApplicationId(req: Request, res: Response) {
  const { applicationId } = req.query;
  if (!applicationId) {
    return res.status(400).json({ error: "Missing applicationId" });
  }

  try {
    const experiences = await AppDataSource
      .getRepository(Experience)
      .find({
        where: {
          application: {
            applicationID: Number(applicationId),
          },
        },
        relations: ["application"],
      });

    return res.json(experiences);
  } catch (err) {
    console.error("Error fetching experience:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

}
