import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1740994711252 implements MigrationInterface {
    name = ' $npmConfigName1740994711252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" ADD "type" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP COLUMN "type"`);
    }

}
