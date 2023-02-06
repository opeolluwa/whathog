import { Request, Response } from "express";
import { User as UserModel } from "../models/User";
import { dataSource as AppDataSource } from "../config/database-config";
import { generateErrorMessage } from "../lib/generate-error-message";
import { Mailer } from "../lib/mailer"
import { OtpGenerator } from "../lib/otp-generator"
import { Jwt } from "../lib/jwt"
import * as EmailValidator from "email-validator"
import bcrypt from "bcrypt"

const UserInformationSource = AppDataSource.getRepository(UserModel)
export class UserAuthControllers {
    static async signUp(req: Request, res: Response) {
        const { firstname, lastname, email, password } = req.body
        try {
            const userExists = await UserInformationSource.findOneBy({
                email
            })

            let error: any = {

            }
            // validationn 
            if (!email) {
                error.email = "Email is required"
            }
            if (!password) {
                error.password = "Password is required"
            }
            if (!firstname) {
                error.firstname = "Firstname is required"
            }
            if (!lastname) {
                error.lastname = "Lastname is required"
            }
            if (!EmailValidator.validate(email)) {
                error.email = "Email is invalid"
            }
            if (password && !(password.length >= 8)) {
                error.password = "please use a password, at least 8 characters long"
            }
            if (Object.keys(error).length > 0) {
                const errorMessage: string = generateErrorMessage(error)
                return res.status(400).json({
                    success: false,
                    message: errorMessage,
                    data: null,
                })
            }

            if (userExists) {
                return res.status(409).send({
                    message: "A user with the provided email already exists",
                    success: false,
                    code: 409,
                })
            }

            //create new record
            const user = new UserModel()
            user.email = email
            user.password = await bcrypt.hash(password, 13)
            user.firstname = firstname
            user.lastname = lastname
            const token = await Jwt.encode({ id: user.id, email: user.email })
            // send mail to user containing magic link to verify email address
            await Mailer.sendMail({
                email: email,
                subject: "Confirm your email address",
                template: "confirm-email",
                data: {
                    firstname: user.firstname,
                    magicLink: `${process.env.FRONTEND_URL}/auth/confirm-email/${token}`,
                },
            })
            console.log(`${process.env.APP_URL}/auth/confirm-email/${token}`)
            return res.send({
                success: true,
                message:
                    "User created successfully, please confirm your email to proceed",
                data: null,
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }


    //to confirm the user's email address, verify the jwt sent to the user's email address and if it is valid, set the user's account to verified
    static async confirmEmail(req: Request, res: Response) {
        const { token } = req.params
        const decoded = await Jwt.decode(token)
        console.log(decoded)

        const { id, email } = decoded
        //if  token has not expired
        try {
            const user = await AppDataSource.getRepository(UserModel).findOneBy({
                id,
            })
            if (!user) {
                return res.status(404).send({
                    message: "user not found",
                    success: false,
                    code: 404
                })
            }
            if (user.email !== email) {
                return res.status(401).send({
                    message: "unauthorized access",
                    code: 401,
                    success: false
                })
            }
            //update the user status to verified
            // user.status = UserAccountStatus.VERIFIED
            await AppDataSource.manager.save(user)
            return res.send({ success: true, message: "Email verified successfully" })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    /**
     * -------------------------FORGOT PASSWORD------------------------
     * find the user by emaIL
     * if the user does not exist send off an error message else
     * generate a new otp and save it to the database using the otp data model
     * send a message to the user containing the otp
     */
    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body
        try {
            const user = await AppDataSource.getRepository(UserModel).findOneBy({
                email,
            })
            if (!user) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            }

            /**
             * generate new otp and save it to the otp database,
             * save the otp id to the user's database, referencing the user that requested for reset
             * finally, send mail to user containing the otp
             */
            //save the otp id to the user's database, referencing the user that requested for reset
            const otpObject = await OtpGenerator.generate(6)
            console.log(otpObject)

            // user.otpId = otpObject?.id
            AppDataSource.manager.save(user)
            //send the mail
            Mailer.sendMail({
                email: email,
                subject: "Reset your password",
                template: "reset-password",
                data: { firstname: user.firstname, otp: otpObject?.otp },
            })
            //send feedback to client application the otp has been sent to the user's email
            return res.send({ success: true, message: "OTP sent to your email" })
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    //confirm the otp and if it is valid, set the user's password to the new password
    static async verifyOtp(req: Request, res: Response) {
        const { email } = req.body
        try {
            const user = await AppDataSource.getRepository(UserModel).findOneBy({
                email,
            })
            if (!user) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            }
            /* if (!user.otpId) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            } */
            /**
             * confirm the otp and if it is valid,  then
             * invalidate the otp and send jwt containing user email and id to the client application,
             * the token will be used to authenticate the user for password reset where it will be passed as authorization header
             */
            /*  const hasTokenExpired = await OtpGenerator.verify(user.otpId)
             if (hasTokenExpired) {
                 return res.status(422).send({
                     message: "Invalid er expired token",
                     success: false,
                 })
             } */
            //invalidate the otp
            /*  const usedOtp = await OtpGenerator.invalidate(user.otpId)
             if (!usedOtp) {
                 return res.status(500).send({
                     message: "error validation the OTP",
                     success: false
                 })
             } */
            user.otpId = ""
            AppDataSource.manager.save(user)
            const payload = await Jwt.encode({ id: user.id, email: user.email })
            return res.send({
                success: true,
                message: "OTP verified",
                bearerToken: payload,
            })
        } catch (error) {
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    /**
     * to set new password for the user,
     * verify the jwt sent to the user's email address and if it is valid,
     * set the user's password to the new password
     */
    static async setNewPassword(req: Request, res: Response) {
        const { email } = req.app.get("user")
        const { password } = req.body
        const user = await AppDataSource.getRepository(UserModel).findOneBy({
            email,
        })

        if (!user) {
            return res.status(404).send({
                message: "user not found ",
                success: false,
                code: 404
            })
        }
        try {
            //set new password
            user.password = await bcrypt.hash(password, 13)
            await AppDataSource.manager.save(user)
            return res.send({ success: true, message: "Password reset successfully" })
        } catch (error: any) {
            console.log(error.message)
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    /**
     * to login a user,
     * find the user by email and password
     * if the user does not exist send off an error message
     * else if the user is not verified send off an error message
     * else if the user is verified, send jwt containing user email and id to the client application,
     * the token will be used to authenticate where it will be passed as authorization header
     * afterward, the token will be invalidated and reset token will be generated every 10 minutes
     */
    static async login(req: Request, res: Response) {
        const { email, password } = req.body
        try {
            const user = await AppDataSource.getRepository(
                UserModel)
                .createQueryBuilder("user")
                .where("user.email = :email", { email })
                .addSelect("user.password")
                .getOne()
            if (!user) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            }
            //validate account status
            if (user.status !== "verified") {
                return res.status(401).send({
                    message: "user not found ",
                    success: false,
                    code: 401
                })
            }
            //validate password
            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).send({
                    message: "Invalid username or password",
                })
            }
            const payload = await Jwt.encode({ id: user.id, email: user.email })
            return res.send({
                success: true,
                message: "Login successful",
                bearerToken: payload,
            })
        } catch (error: any) {
            console.log(error.message)
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    //user profile
    static async getUserProfile(req: Request, res: Response) {
        const { email } = req.app.get("user")
        try {
            const user = await AppDataSource.getRepository(UserModel)
                .createQueryBuilder("user")
                .where("user.email = :email", { email })
                .addSelect("user.password")
                .getOne()
            if (!user) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            }
            //build the payload
            const payload = {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,

            }
            return res.send({ success: true, message: "User profile", payload })
        } catch (error: any) {
            console.log(error.message)
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }

    /**
     * to logout a user,
     * invalidate the jwt sent to the user
     */
    static async logout(req: Request, res: Response) { }

    //generate refresh token
    static async generateRefreshToken(req: Request, res: Response) {
        const { email } = req.app.get("user")

        try {
            const user = await AppDataSource.getRepository(UserModel)
                .createQueryBuilder("user")
                .where("user.email = :email", { email })
                .addSelect("user.password")
                .getOne()
            if (!user) {
                return res.status(404).send({
                    message: "user not found ",
                    success: false,
                    code: 404
                })
            }
            //build the payload
            const payload = {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            }
            return res.send({ success: true, message: "User profile", payload })
        } catch (error: any) {
            console.log(error.message)
            console.log(error.message)
            return res.status(500).send({
                success: false,
                message: (error as Error).message,
                data: null,
            })
        }
    }
}