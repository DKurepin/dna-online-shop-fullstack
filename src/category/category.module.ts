import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import {CategoryRepository} from "./category.repository";
import {PrismaModule} from "../prisma/prisma.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from "path";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [CategoryController],
  imports: [PrismaModule, AuthModule],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
