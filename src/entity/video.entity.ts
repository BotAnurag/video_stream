import { Column, Entity } from "typeorm";

import { BaseEntity } from "../base.entity";

@Entity()
export class videoEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  hah?: string;

  @Column()
  notanurag?: string;

  @Column()
  yes?: string;
  @Column()
  nes?: string;
}
