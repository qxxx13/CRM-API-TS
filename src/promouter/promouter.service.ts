import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { newCoordinate, newRoute } from './promouter.controller';

@Injectable()
export class PromouterService {
    constructor(private prisma: PrismaService) {}

    async getAll() {
        const routes = await this.prisma.route.findMany();

        return routes;
    }

    async getAllByPromId(promId: string) {
        const routes = await this.prisma.route.findMany({
            where: {
                userId: +promId,
            },
        });

        return routes;
    }

    async createNewRoute(newRoute: newRoute) {
        const route = await this.prisma.route.create({ data: newRoute });

        return route;
    }

    async createNewCoordinate(newCoordinate: newCoordinate) {
        const coordinate = await this.prisma.coordinates.create({ data: newCoordinate });

        return coordinate;
    }

    async getAllCoordinatesByRouteId(routeId: string) {
        const coordinates = await this.prisma.coordinates.findMany({
            where: { RouteId: +routeId },
        });

        return coordinates;
    }
}
