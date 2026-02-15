import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { RolesGuard } from '../common/guards/rolesGuard';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('announcement')
@ApiTags('Announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Get all',
    description: 'Get all announcements',
  })
  @ApiResponse({
    status: 200,
    description: 'List of announcements',
    type: [AnnouncementEntity],
  })
  findAll() {
    return this.announcementService.findAll();
  }

  @Post('')
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Create',
    description: 'Create new announcement',
  })
  @ApiResponse({
    status: 201,
    description: 'User is created',
    type: AnnouncementEntity,
  })
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementService.create(dto);
  }
}
