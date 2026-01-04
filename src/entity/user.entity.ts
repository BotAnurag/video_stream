import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  userName!: string;

  @Column({ nullable: true })
  fullName?: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: "1080p" })
  quality!: string;
}
