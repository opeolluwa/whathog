import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("questionnaire_response")
export class Response {
  @PrimaryGeneratedColumn("uuid")
  id!: string | undefined



  @Column({ type: "text" })
  answer: string | undefined

  @Column({ type: "text" })
  question: string | undefined
}