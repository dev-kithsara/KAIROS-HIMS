import { Router } from "express";
import { createIncident } from "../controllers/incident.controller";
import upload from "../middleware/upload.middleware";

const router = Router();


// POST /api/v1/incidents
router.post(
    "/",
    upload.array("evidence", 5),
    createIncident
);


export default router;