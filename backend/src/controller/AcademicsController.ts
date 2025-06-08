import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Academics } from "../entity/Academics";

export class AcademicsController {
  // Using AppDataSource to get the Academics repository instance
  private academicsRepo = AppDataSource.getRepository(Academics);

  // Retrieves all academics
  async findByApplicationId(request: Request, response: Response) {
    // Extracting applicationId from query parameters
    const appIdRaw = request.query.applicationId;
    if (!appIdRaw) {
      return response.status(400).json({ message: "Missing applicationId" });
    }
    // Parsing applicationId to ensure it's a valid number
    const applicationId = parseInt(appIdRaw as string, 10);
    if (isNaN(applicationId)) {
      return response.status(400).json({ message: "Invalid applicationId" });
    }
    // Ensuring applicationId is a positive integer
    if (applicationId <= 0) {
      return response
        .status(400)
        .json({ message: "applicationId must be positive" });
    }

    try {
      //After all the validations, we query the Academics repository
      // to find all academics associated with the applicationID
      const items = await this.academicsRepo.find({
        where: { application: { applicationID: applicationId } },
      });
      return response.json(items);
    } catch (err) {
      console.error("Error in AcademicsController.findByApplicationId:", err);
      return response
        .status(500)
        .json({ message: "Failed to fetch academics" });
    }
  }
}
