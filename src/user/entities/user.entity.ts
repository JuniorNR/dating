import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Announcement } from '@prisma/client';
import { AnnouncementEntity } from 'src/announcement/entities/announcement.entity';
import { RoleEntity } from 'src/role/entities/role.entity';

export class UserEntity {
  @ApiProperty({ example: 1, description: 'Unique id' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username (Not BIO)' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email of user' })
  email: string;

  @ApiProperty({ example: false, description: 'User is banned or not' })
  banned: boolean;

  @ApiPropertyOptional({ example: 'Spam', description: 'Reason for ban' })
  banReason?: string;

  @ApiProperty({
    type: () => [AnnouncementEntity],
    description: 'Announcements list of user',
  })
  announcements: Announcement[];

  @ApiProperty({
    type: () => [RoleEntity],
    description: 'Announcements list of user',
  })
  roles: RoleEntity[];

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-02-15T12:00:00.000Z' })
  updatedAt: Date;
}
