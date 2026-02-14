import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { RolesGuard } from '../guards/rolesGuard';
import { AnnouncementCreateDto } from './announcement.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('announcement')
@ApiTags('Announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('')
  @UseGuards(RolesGuard)
  findAll() {
    return this.announcementService.findAll();
  }

  @Post('')
  @UseGuards(RolesGuard)
  create(@Body() dto: AnnouncementCreateDto) {
    return this.announcementService.create(dto);
  }
}
