import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";



const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const findEmail = await prisma.admin.findUnique({
            where: { email }
        })
        if (findEmail) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashPassword,
                //hash adalah pengubahan ke bentuk acak agar tidak bisa dibaca secara langsung untuk password
            },
        });

        return res.status(201).json({
            message: "Admin created successfully",
            data: admin,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const readAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search
    try {
        const admins = await prisma.admin.findMany({
            where: {
                OR: [{
                    name: {
                        contains: search?.toString() || ""
                    },
                }
                ]
            }
        });
        return res.status(200).json({
            message: "Admins retrieved successfully",
            data: admins,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { name, email, password } = req.body;
        const findAdmin = await prisma.admin.findFirst({
            where: { id: Number(id) }
        })

        if (!findAdmin) {
            return res.status(200).json({ message: "Admin not found" })
        }

        const admin = await prisma.admin.update({
            where: { id: Number(id) },
            data: {
                name: name ? name : findAdmin.name,
                email: email ? email : findAdmin.email,
                password: password ? await bcrypt.hash(password, 12) : findAdmin.password,
            },
        });

        return res.status(200).json({
            message: "Admin updated successfully",
            data: admin,
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await prisma.admin.delete({
            where: { id: Number(id) },
        });

        return res.status(200).json({
            message: "Admin deleted successfully",
        });
    } catch (error) {
        res.status(500)
            .json(error)
    }
};

//function for login (authentication)
const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const findAdmin = await prisma.admin.findFirst({
            where: { email }
        })

        if (!findAdmin) {
            return res.status(200).json({ message: "Email not found" })
        }

        const isMatchPassword = await bcrypt.compare(password, findAdmin.password)
        if (!isMatchPassword) {
            return res.status(200).json({ message: "invalid password" })
        }

        //prepare to generate token with using jsonwebtoken
        const payload = {
            name: findAdmin.name,
            email: findAdmin.email
        }

        const signature = process.env.SECRET || ``
        const token = jwt.sign(payload, signature)

        return res.status(200)
        .json({
            logged: true,
            token,
            id: findAdmin.id,
            name: findAdmin.name,
            email: findAdmin.email
        })


    } catch (error) {
        return res.status(500)
            .json(error)
    }
}

export { 
    createAdmin, updateAdmin, 
    deleteAdmin, readAdmin,
    authentication }