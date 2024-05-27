import {Injectable} from '@nestjs/common';
import {UserProductRepository} from "./user-product.repository";
import {CreateUserProductDto} from "./dto/create-user-product.dto";
import {UserProductDto} from "./dto/user-product.dto";
import {UserRepository} from "../user/user.repository";
import {ProductRepository} from "../product/product.repository";
import {UpdateUserProductDto} from "./dto/update-user-product.dto";

@Injectable()
export class UserProductService {

    constructor(private readonly userProductRepository: UserProductRepository,
                private readonly userRepository: UserRepository,
                private readonly productRepository: ProductRepository) {
    }

    async addProductToCart(data: CreateUserProductDto): Promise<UserProductDto> {
        let user = await this.userRepository.getUsers({where: {id: data.userId}});
        if (user.length === 0) {
            throw new Error('User not found');
        }
        let product = await this.productRepository.getProducts({where: {id: data.productId}});
        if (product.length === 0) {
            throw new Error('Product not found');
        }
        let userProduct = {
            user: {connect: {id: data.userId}},
            product: {connect: {id: data.productId}},
            quantity: data.quantity
        }
        return await this.userProductRepository.createUserProduct({data: userProduct});
    }

    async updateProduct(data: UpdateUserProductDto): Promise<{
        product: any;
        quantity: any;
        user: any
    }> {
        let userProduct = await this.userProductRepository.getUserProducts({where: {userId: data.userId, productId: data.productId}});
        if (userProduct.length === 0) {
            throw new Error('User product not found');
        }
        let userProductData = {
            quantity: data.quantity
        }
        let userProductRes = await this.userProductRepository.updateUserProduct({where: {id: userProduct[0].id}, data: userProductData});
        return {
            user: userProductRes.userId,
            product: userProductRes.productId,
            quantity: userProductRes.quantity
        };
    }

    async getProductsByUserId(userId: number): Promise<UserProductDto[]> {
        return await this.userProductRepository.getUserProducts({where: {userId}});
    }

    async deleteProductFromCart(id: number): Promise<UserProductDto> {
        return await this.userProductRepository.deleteUserProduct({where: {id}});
    }

    async getTotalPriceForUser(userId: number): Promise<number> {
        let userProducts = await this.userProductRepository.getUserProducts({where: {userId}});
        let totalPrice = 0;
        for (let userProduct of userProducts) {
            let product = await this.productRepository.getProducts({where: {id: userProduct.productId}});
            totalPrice += product[0].price * userProduct.quantity;
        }
        return totalPrice;
    }

    async deleteAllProductsFromCart(userId: number): Promise<UserProductDto[]> {
        let userProducts = await this.userProductRepository.getUserProducts({where: {userId}});
        for (let userProduct of userProducts) {
            await this.userProductRepository.deleteUserProduct({where: {id: userProduct.id}});
        }
        return userProducts;
    }
}
