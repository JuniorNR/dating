import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Announcement } from '@prisma/client';
import { AnnouncementEntity } from 'src/announcement/entities/announcement.entity';

export class UserEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: false })
  banned: boolean;

  @ApiPropertyOptional({ example: 'Spam' })
  banReason?: string;

  @ApiProperty({ type: () => [AnnouncementEntity] })
  announcements: Announcement[];

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  updatedAt: Date;
}
