import { UserService } from "./user.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query, Res, UseInterceptors, UseGuards, Req,
} from "@nestjs/common";
import {
  ApiBody, ApiCookieAuth,
  ApiOperation, ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import {TimingInterceptor} from "../interceptor";
import {Response} from "express";
import { Request } from 'express';
import {OrderService} from "../order/order.service";
import {AuthService} from "../auth/auth.service";
import {LocalAuthGuard} from "../auth/guards/local-auth.guard";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Roles} from "../auth/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Role} from "@prisma/client";
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import {WebsocketGateway} from "../websocket/websocket.gateway";

@ApiTags("users")
@Controller("users")
@UseInterceptors(TimingInterceptor)
export class UserController {
  @WebSocketServer() server: Server;

  constructor(private readonly userService: UserService,
              private orderService: OrderService,
              private authService: AuthService,
              private websocketGateway: WebsocketGateway) {}

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: "Get all users",
  })
  @ApiResponse({
    status: 201,
    description: "The found records",
    type: [UserDto],
  })
  @ApiResponse({
    status: 404,
    description: "No records found",
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(":id")
  // @ApiParam({ name: "id", type: "number" })
  @ApiOperation({
    summary: "Get user by id",
  })
  @ApiResponse({
    status: 201,
    description: "OK",
    type: UserDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getUserById(@Param("id") id: string, @Res() res: Response) {
    // return this.userService.getUserById(+id);
    let user = await this.userService.getUserById(+id);
    if (user === null) {
        return res.send({message: 'User not found.'})
    }
    let orders = await this.orderService.getOrdersByUserId(user.id)
    return user;
  }

  @Post()
  // @ApiCreatedResponse({ type: UserDto })
  // @ApiParam({ name: "CreateUserDto", type: CreateUserDto })
  @ApiOperation({
    summary: "Create a new user",
  })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: UserDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    // return this.userService.createUser(createUserDto);
    let user = await this.userService.createUser(createUserDto);
    if (user === null) {
      return {message: 'User already exists.'}
    }
    return res.redirect('signIn');
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Put()
  // @ApiParam({ name: "UpdateUserDto", type: UpdateUserDto })
  @ApiOperation({
    summary: "Update user by id",
  })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully updated.",
    type: UserDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  @ApiOperation({
    summary: "Delete user by id",
  })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully deleted.",
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async deleteUser(@Param("id") id: number) {
    return this.userService.deleteUser(+id);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get("page/edit/:id")
  @ApiOperation({
    summary: "Get edit user page",
  })
  @ApiResponse({
    status: 200,
    description: "The page is rendered",
  })
  async getEditUserPage(@Param("id") id: number, @Res() res: Response) {
    let user = await this.userService.getUserById(+id);
    if (user === null) {
      return res.status(404).send({message: 'User not found.'})
    }

    let orders = await this.orderService.getOrdersByUserId(user.id)
    return res.render('accountEditPage', {
      layout: 'layout',
      style: '../../../account.css',
      loadTimeScript: '../../../loadTime.js',
      autoTopScrollButton: '../../../autoTopScrollButton.js',
      activePage: '../../../activePage.js',
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      phoneNumber: user.phoneNumber,
      address: user.address,
      orders: orders,
      subscribeScript: '../../../subscribeScript.js',
      editUserScript: '../../../editUserScript.js',
        websocketScript: '../../../websocketScript.js'
    });
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get("page/:id/add/product")
  @ApiOperation({
    summary: "Get add product page",
  })
  @ApiResponse({
    status: 200,
    description: "The page is rendered",
  })
  async getAddProductPage(@Param("id") id: number, @Res() res: Response) {
    let user = await this.userService.getUserById(+id);
    if (user === null) {
      return res.status(404).send({message: 'User not found.'})
    }

    let orders = await this.orderService.getOrdersByUserId(user.id)
    return res.render('addProductPage', {
      layout: 'layout',
      style: '../../../../account.css',
      loadTimeScript: '../../../../loadTime.js',
      autoTopScrollButton: '../../../../autoTopScrollButton.js',
      activePage: '../../../../activePage.js',
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      phoneNumber: user.phoneNumber,
      address: user.address,
      orders: orders,
      subscribeScript: '../../../../subscribeScript.js',
      websocketScript: '../../../../websocketScript.js',
      addProductScript: '../../../../addProductScript.js'
    });
  }

  @ApiCookieAuth()
  @UseGuards(LocalAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post("login")
  @ApiOperation({
    summary: "Login user",
  })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully logged in.",
    type: UserDto,
  })
  @ApiResponse({
    status: 403,
    description: "Invalid email/password.",
  })
  @ApiParam({ name: "email", type: "string" })
  @ApiParam({ name: "password", type: "string" })
  async loginUser(@Body("email") email: string, @Body("password") password: string
  ,@Res() res: Response) {
    // let user = await this.userService.loginUser(email, password);
    // if (user === null) {
    //     return res.status(403).send({message: 'Invalid email/password.'})
    // }
    // return res.redirect('page/' + user.id);
    let user = await this.authService.validateUser(email, password);
    if (user === null) {
        return res.status(403).send({message: 'Invalid email/password.'})
    }
    const token = await this.authService.login(user);
    res.setHeader('Authorization', 'Bearer ' + token.access_token);
    console.log(res.getHeaders());
    res.cookie('jwt', token.access_token, {httpOnly: true});
    console.log(token);
    return res.redirect('/users/page/' + user.id);
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post("logout")
  @ApiOperation({
    summary: "Logout user",
  })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully logged out.",
  })
  async logoutUser(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.redirect('/account');
  }

  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get("page/:id")
  @ApiOperation({
    summary: "Get user by id",
  })
  @ApiResponse({
    status: 201,
    description: "OK",
    type: UserDto,
  })
  @ApiResponse({
    status: 422,
    description: "Invalid data",
  })
  async getUserPageById(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    // return this.userService.getUserById(+id);
    let user = await this.userService.getUserById(+id);
    if (user === null) {
      return res.send({message: 'User not found.'})
    }
    let orders = await this.orderService.getOrdersByUserId(user.id)
    if (user.role === Role.ADMIN) {
      return res.render('accountPageAdmin', {
        layout: 'layout',
        style: '../../account.css',
        loadTimeScript: '../../loadTime.js',
        autoTopScrollButton: '../../autoTopScrollButton.js',
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        phoneNumber: user.phoneNumber,
        address: user.address,
        orders: orders,
        subscribeScript: '../../subscribeScript.js',
        websocketScript: '../../websocketScript.js'
      })
    } else {
      return res.render('accountPage', {
        layout: 'layout',
        style: '../../account.css',
        loadTimeScript: '../../loadTime.js',
        autoTopScrollButton: '../../autoTopScrollButton.js',
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        phoneNumber: user.phoneNumber,
        address: user.address,
        orders: orders,
        subscribeScript: '../../subscribeScript.js',
        websocketScript: '../../websocketScript.js'
      });
    }
  }
}
