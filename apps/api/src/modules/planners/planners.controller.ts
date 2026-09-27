import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlannersService } from './planners.service';
import { CreatePlannerDto } from './dto/create-planner.dto';
import { UpdatePlannerDto } from './dto/update-planner.dto';
import { AddClientDto } from './dto/add-client.dto';

@Controller('planners')
@UseGuards(JwtAuthGuard)
export class PlannersController {
  constructor(private readonly plannersService: PlannersService) {}

  @Post()
  create(
    @Request() req: { user: { userId: string } },
    @Body() dto: CreatePlannerDto,
  ) {
    return this.plannersService.create(req.user.userId, dto);
  }

  @Get('me')
  findOwn(@Request() req: { user: { userId: string } }) {
    return this.plannersService.findByOwner(req.user.userId);
  }

  @Patch('me')
  update(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdatePlannerDto,
  ) {
    return this.plannersService.update(req.user.userId, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: { user: { userId: string } }) {
    return this.plannersService.remove(req.user.userId);
  }

  @Get('me/clients')
  findAllClients(@Request() req: { user: { userId: string } }) {
    return this.plannersService.findAllClients(req.user.userId);
  }

  @Post('me/clients')
  addClient(
    @Request() req: { user: { userId: string } },
    @Body() dto: AddClientDto,
  ) {
    return this.plannersService.addClient(req.user.userId, dto.weddingId);
  }

  @Delete('me/clients/:clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeClient(
    @Request() req: { user: { userId: string } },
    @Param('clientId') clientId: string,
  ) {
    return this.plannersService.removeClient(req.user.userId, clientId);
  }
}
