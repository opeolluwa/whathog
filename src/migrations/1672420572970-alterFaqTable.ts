import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class alterFaqTable1672420572970 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("questionnaire_response");
        const questionnaireResponseTable = new Table({
            name: "questionnaire_response",
            columns: [
                {
                    name: "id",
                    type: "varchar(36)", //uuid
                    isPrimary: true, //set as primary key
                    isNullable: false,
                },
                {
                    name: "answer",
                    type: "text",
                },
                {
                    name: "question",
                    type: "text",
                },
            ]
        })
        await queryRunner.createTable(questionnaireResponseTable)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const questionnaireResponseTable = new Table({
            name: "questionnaire_response",
            columns: [
                {
                    name: "id",
                    type: "varchar(36)", //uuid
                    isPrimary: true, //set as primary key
                    isNullable: false,
                },
                {
                    name: "answer",
                    type: "text",
                },
                {
                    name: "question",
                    type: "text",
                },
            ]
        })
        await queryRunner.createTable(questionnaireResponseTable)
    }

}
