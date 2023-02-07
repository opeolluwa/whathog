import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class createUserAccoutTable1675704427014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const UserInformation = new Table({
            name: "whathog_user_information",
            columns: [
                {
                    name: "id",
                    type: "varchar(36)", //uuid
                    isPrimary: true, //set as primary key
                    isNullable: false,
                },
                {
                    name: "firstname",
                    type: "text",
                },
                {
                    name: "lastname",
                    type: "text",
                },
                {
                    name: "email",
                    type: "text"
                },
                {
                    name: "otp",
                    type: "text"
                },
                {
                    name: "password",
                    type: "text"
                },
                {
                    name: "status",
                    type: "text"
                }
            ]
        })
        await queryRunner.createTable(UserInformation)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("whathog_user_information")
    }

}
