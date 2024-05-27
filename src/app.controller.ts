import {
  Body,
  Controller,
  Get,
  Post, Req,
  Res, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { AppService } from './app.service';
import { TimingInterceptor } from './interceptor';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {ProductService} from "./product/product.service";
import {AuthService} from "./auth/auth.service";
import {UserController} from "./user/user.controller";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {RolesGuard} from "./auth/guards/roles.guard";
import {Roles} from "./auth/roles.decorator";
import {Role} from "@prisma/client";

@ApiTags('app')
@Controller()
@UseInterceptors(TimingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService,
              private productService: ProductService,
              private authService: AuthService,
              private userController: UserController) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get index page',
  })
  @ApiResponse({
    status: 200,
    description: 'The page is rendered',
  })
  async getIndexPage(@Res() res: Response) {
    let products = await this.productService.getAllProducts();

    return res.render('index', {
      layout: 'layout',
      style: 'style.css',
      loadTimeScript: 'loadTime.js',
      products: products,
      autoTopScrollButton: 'autoTopScrollButton.js',
      activePage: 'activePage.js',
      subscribeScript: 'subscribeScript.js',
      websocketScript: 'websocketScript.js'

    });

    // return res.render('index', {
    //   layout: 'layout',
    //   style: 'style.css',
    //   loadTimeScript: 'loadTime.js',
    // });

  }
  @Get('/about')
  @ApiOperation({
    summary: 'Get about page',
  })
  @ApiResponse({
    status: 200,
    description: 'The page is rendered',
  })
  getAboutPage(@Res() res: Response) {
    return res.render('about', {
      layout: 'layout',
      style: 'about.css',
      loadTimeScript: 'loadTime.js',
      autoTopScrollButton: 'autoTopScrollButton.js',
      activePage: 'activePage.js',
      websocketScript: 'websocketScript.js'
    });
  }
  @Get('/account')
  @ApiOperation({
    summary: 'Get account page',
  })
  @ApiResponse({
    status: 200,
    description: 'The page is rendered',
  })
  async getAccountPage(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.jwt;
    if (token !== undefined) {
      // get user info from token
      let user = await this.authService.getUserFromToken(token);
      return res.redirect('/users/page/' + user.id);
    }
    return res.render('account', {
      layout: 'layout',
      style: 'account.css',
      loadTimeScript: 'loadTime.js',
      autoTopScrollButton: 'autoTopScrollButton.js',
      activePage: 'activePage.js',
      subscribeScript: 'subscribeScript.js',
      websocketScript: 'websocketScript.js'
    });
  }
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('/cart')
  @ApiOperation({
    summary: 'Get cart page',
  })
  @ApiResponse({
    status: 200,
    description: 'The page is rendered',
  })
  async getCartPage(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.jwt;
    if (token !== undefined) {
      let user = await this.authService.getUserFromToken(token);
      return res.redirect('/user-product/' + user.id);
    }
    return res.render('cartUser', {
      layout: 'layout',
      style: 'cart.css',
      loadTimeScript: 'loadTime.js',
      autoTopScrollButton: 'autoTopScrollButton.js',
      activePage: 'activePage.js',
      subscribeScript: 'subscribeScript.js',
      websocketScript: 'websocketScript.js'
    });
  }
  @Get('/signIn')
  @ApiOperation({
      summary: 'Get sign in page',
  })
  @ApiResponse({
      status: 200,
      description: 'The page is rendered',
  })
  getSignInPage(@Res() res: Response) {
      return res.render('signIn', {
          layout: 'layout',
          style: 'account.css',
          loadTimeScript: 'loadTime.js',
          autoTopScrollButton: 'autoTopScrollButton.js',
          activePage: 'activePage.js',
          subscribeScript: 'subscribeScript.js',
          websocketScript: 'websocketScript.js'
      });
  }
  @Get('/signUp')
  @ApiOperation({
    summary: 'Get sign up page',
  })
  @ApiResponse({
    status: 200,
    description: 'The page is rendered',
  })
  getSignUpPage(@Res() res: Response) {
    return res.render('signUp', {
        layout: 'layout',
        style: 'account.css',
        loadTimeScript: 'loadTime.js',
        autoTopScrollButton: 'autoTopScrollButton.js',
        activePage: 'activePage.js',
        subscribeScript: 'subscribeScript.js',
      websocketScript: 'websocketScript.js'

    });
  }
}
