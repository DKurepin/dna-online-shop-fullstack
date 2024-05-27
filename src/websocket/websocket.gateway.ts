import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Product } from "@prisma/client";

enum UpdateType {
    PRODUCT_CREATED = 'PRODUCT_CREATED',
    PRODUCT_DELETED = 'PRODUCT_DELETED',
    PRODUCT_UPDATED = 'PRODUCT_UPDATED',
}

@WebSocketGateway({
    cors: {
        origin: 'https://dna-online-shop.onrender.com/',
    },
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('AppGateway');

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', payload);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    sendUpdateMessage(updateType: UpdateType, payload: any) {
        this.server.emit('updateMessage', { type: updateType, payload });
    }

    notifyProductCreation(product: Product) {
        this.sendUpdateMessage(UpdateType.PRODUCT_CREATED, product);
    }

    notifyProductDeletion(product: Product) {
        this.sendUpdateMessage(UpdateType.PRODUCT_DELETED, product);
    }

    notifyProductUpdate(product: Product) {
        this.sendUpdateMessage(UpdateType.PRODUCT_UPDATED, product);
    }
}
