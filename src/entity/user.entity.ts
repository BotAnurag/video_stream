import { Column, Entity } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  username!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
