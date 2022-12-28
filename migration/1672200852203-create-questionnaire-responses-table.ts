import { MigrationInterface, QueryRunner , Table} from "typeorm"

export class createQuestionnaireResponsesTable1672200852203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        //create table 
        const questionnaireResponseTable = new Table({
            name:"questionnaire_response",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "response",
                    type: "text",
                },
            ]
        })
        await queryRunner.createTable(questionnaireResponseTable)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("questionnaire_response")
    }

}
