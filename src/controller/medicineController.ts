import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"

/** create object of prisma */
const prisma = new PrismaClient()
type DrugType = "Syrup" | "Tablet" | "Powder"
const createMedicine = async (req: Request, res: Response) => {
    try {
        const name: string = req.body.name
        const stock: number = Number(req.body.stock)
        const exp_date: Date = new Date(req.body.exp_date)
        const price: number = Number(req.body.price)
        const type: DrugType =  req.body.type

        /** save a new medicine to DB */
        const newMedicine = await prisma.medicine.create({
            data: {
                name, stock, exp_date, price, type
            }
        })
        return res.status(200)
        .json({
            message: "Medicine created successfully",
            data: newMedicine
        })
    } catch (error) {
        console.log(error)
        return res.status(500)
            .json(error)
    }
}

const readMedicine = async (
    req: Request,
    res: Response
) => {
    try {
       /** get all medicine */
       const allMedicine = await prisma.medicine.findMany()
       return res.status(200)
       .json({
        message:`medicine has been retrivired`,
        data: allMedicine
       }) 
    } catch (error) {
        res.status(500)
        .json(error)
    }
}

export {createMedicine,readMedicine}