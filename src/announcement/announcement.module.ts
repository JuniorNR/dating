import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { PrismaService } from '../../prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AnnouncementController],
  providers: [AnnouncementService, PrismaService, ConfigService],
})
export class AnnouncementModule {}
