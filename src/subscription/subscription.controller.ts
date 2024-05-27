import {Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, UseGuards} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import {SubscriptionDto} from "./dto/subscription.dto";
import { Response } from 'express';
import {AuthService} from "../auth/auth.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "@prisma/client";

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService,
              private authService: AuthService) {}

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all subscriptions',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [SubscriptionDto],
  })
  @ApiResponse({
    status: 404,
    description: "No records found",
  })
  async getAllSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get subscription by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SubscriptionDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionService.getSubscriptionById(+id);
  }

  @Post()
  // @ApiCreatedResponse({ type: SubscriptionDto })
  // @ApiParam({ name: 'CreateSubscriptionDto', type: CreateSubscriptionDto })
  @ApiOperation({
    summary: 'Create a new subscription',
  })
  @ApiResponse({
    status: 201,
    description: 'The subscription has been successfully created.'
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateSubscriptionDto })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Res() res: Response) {
    try {
      await this.subscriptionService.createSubscription(createSubscriptionDto);
      res.status(HttpStatus.OK).send();
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create subscription.' });
    }
  }
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
    @ApiOperation({
    summary: 'Delete subscription by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
    type: SubscriptionDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteSubscription(@Param('id') id: string) {
    return this.subscriptionService.deleteSubscription(+id);
  }
}
