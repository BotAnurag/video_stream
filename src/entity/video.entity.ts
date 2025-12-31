import { Column, Entity } from "typeorm";

import { BaseEntity } from "../base.entity";
import { VideoStatus } from "../utils/enum.utils";

@Entity()
export class videoEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  video!: string;

  @Column({ type: "enum", enum: VideoStatus, default: VideoStatus.PROCESSING })
  status!: VideoStatus;

  // @Column({ type: "enum", enum: VideoResolution })
  // resolution!: VideoResolution;
  @Column()
  originalVideo!: string;

  @Column()
  masterPlaylist!: string;

  @Column({ type: "json", nullable: true })
  resolution?: { name: string; path: string }[];
}
