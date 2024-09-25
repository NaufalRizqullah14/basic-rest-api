import { Router } from "express";
import { createMedicine, deleteMedicine, readMedicine, updateMedicine } from "../controller/medicineController";
import { uploadMedicinePhoto } from "../middleware/uploadMedicinePhoto";
import { createValidation, updateValidation } from "../middleware/medicineValidation";
import { verifyToken } from "../middleware/authorization";
const router = Router()


/** route for add new medicine */
router.post(`/`, [verifyToken,uploadMedicinePhoto.single(`photo`), createValidation], createMedicine)

/** route for show all medicine */
router.get(`/`, [verifyToken] ,readMedicine)


/** route for update medicine */
router.put(`/:id`, [verifyToken,updateValidation], updateMedicine)

/** route for remove medicine */
router.delete(`/:id`, [verifyToken] ,deleteMedicine)

export default router