import { MigrationInterface, QueryRunner } from "typeorm"

import { EntityName } from "../src/constants/enums/entity-name.enum"
import { UserRole } from "../src/constants/enums/user-role.enum"
import { Gender } from "../src/constants/enums/gender.enum"

export class migrations1731135865005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
       
        const adminResult = await queryRunner.query(
            `INSERT INTO "${EntityName.USER}"
            (username, password, first_name, last_name, gender, email, dob, phone_number, role, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING id`,
            [
                'admin',
                'admin', 
                'Admin',
                'User',
                Gender.MALE,
                'admin@gmai.com',
                new Date('2003-01-03T00:00:00.000Z'),
                '+84123456789',
                UserRole.ADMIN,
            ]
        );
 
        const userResult = await queryRunner.query(
            `INSERT INTO "${EntityName.USER}"
            (username, password, first_name, last_name, gender, email, dob, phone_number, role, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING id`,
            [
                'user123',
                'userpassword',
                'Normal',
                'User',
                Gender.FEMALE,
                'user@cookverse.com', 
                new Date('2003-01-03T00:00:00.000Z'),
                '+84987654321',
                UserRole.USER,
            ]
        );

        
        const chefResult = await queryRunner.query(
            `INSERT INTO "${EntityName.USER}"
            (username, password, first_name, last_name, gender, email, dob, phone_number, role, created_at, updated_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING id`,
            [
                'chef123',
                'chefpassword',
                'Chef', 
                'Cook',
                Gender.MALE,
                'chef@cookverse.com',
                new Date('2003-01-03T00:00:00.000Z'),
                '+84369852147',
                UserRole.USER
            ]
        );

        await queryRunner.manager.connection.synchronize(false);
        return {
            adminId: adminResult[0].id,
            userId: userResult[0].id,
            chefId: chefResult[0].id
        };
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "${EntityName.USER}"`);
    }
}
