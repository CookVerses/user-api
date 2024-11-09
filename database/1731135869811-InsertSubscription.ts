import { MigrationInterface, QueryRunner } from "typeorm"

import { EntityName } from "../src/constants/enums/entity-name.enum"
import { SubscriptionStatus } from "../src/constants/enums/subscription-status"

export class InsertSubscription1731135869811 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = await queryRunner.query(
            `SELECT id FROM "${EntityName.USER}"`
        );
        
        const [normalUser, chef] = users;

        await queryRunner.query(
            `INSERT INTO "${EntityName.SUBSCRIPTION}"
            ("name", "status", "start_date", "end_date", "user_id", "created_at", "updated_at") 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [
                'Premium',
                SubscriptionStatus.Active,
                '2024-03-10',
                '2025-03-10',
                normalUser.id
            ]
        );

        await queryRunner.query(
            `INSERT INTO "${EntityName.SUBSCRIPTION}"
             ("name", "status", "start_date", "end_date", "user_id", "created_at", "updated_at") 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [
                'Basic',
                SubscriptionStatus.Expired,
                '2023-01-01',
                '2024-01-01',
                normalUser.id
            ]
        );

        await queryRunner.query(
            `INSERT INTO "${EntityName.SUBSCRIPTION}"
             ("name", "status", "start_date", "end_date", "user_id", "created_at", "updated_at") 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [
                'Gold',
                SubscriptionStatus.Pending,
                '2024-03-10',
                '2024-06-10',
                chef.id
            ]
        );

        await queryRunner.query(
            `INSERT INTO "${EntityName.SUBSCRIPTION}"
             ("name", "status", "start_date", "end_date", "user_id", "created_at", "updated_at") 
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [
                'Gold',
                SubscriptionStatus.Cancelled,
                '2023-06-10',
                '2023-12-10',
                normalUser.id
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "${EntityName.SUBSCRIPTION}"`);
    }

}
