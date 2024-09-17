import Express from "express"
import MedicineRoute 
from "./router/medicineRouter"

const app = Express()
/** allow to read a body request with 
 * JSON format 
*/
app.use(Express.json())

/** prefix for meedicine route */
app.use(`/medicine`, MedicineRoute)

const PORT = 8790
app.listen(PORT, () => { })
console.log(`server Drugstore run on port ${PORT}`)