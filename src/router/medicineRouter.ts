import { Router } from "express";
import { createMedicine, readMedicine } from "../controller/medicineController";
import { createValidation } from "../middleware/medicineValidation";
const router = Router()

/** route for add new medicine */
router.post(`/`, [createValidation], createMedicine)
/**  */
router.get(`/`, readMedicine)
export default router