import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("questionnaire_response")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string | undefined

    @Column({ type: "text" })
    firstname: string | undefined

    @Column({ type: "text" })
    lastname: string | undefined

    @Column({ type: "text" })
    email: string | undefined

    @Column({ type: "text" })
    password: string | undefined

    @Column({ type: "text" })
    otpId: String | undefined

    @Column({ type: "text" })
    status: String | undefined //verified, unverifiefd

}