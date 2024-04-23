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

    async getCoordinateById(id: number) {
        const coordinate = await this.prisma.coordinates.findUnique({ where: { Id: id } });

        return coordinate;
    }

    async getRouteById(id: number) {
        const route = await this.prisma.route.findUnique({ where: { Id: id } });

        return route;
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
            orderBy: { Id: 'asc' },
        });

        return coordinates;
    }

    async editCoordinate(editCoordinate: newCoordinate) {
        const coordinate = await this.getCoordinateById(editCoordinate.Id);

        const Latitude = editCoordinate.CoordinateUrl.split(',')[0];
        const Longitude = editCoordinate.CoordinateUrl.split(' ')[1];

        const editedCoordinate = await this.prisma.coordinates.update({
            where: { Id: coordinate.Id },
            data: {
                Latitude: Latitude,
                Longitude: Longitude,
                CoordinateUrl: editCoordinate.CoordinateUrl,
                Comments: editCoordinate.Comments,
            },
        });

        return editedCoordinate;
    }

    async toggleWidespread(coordinateId: string, widespread: string) {
        const coordinate = await this.getCoordinateById(+coordinateId);

        const patchWidespread = await this.prisma.coordinates.update({
            where: { Id: coordinate.Id },
            data: { Widespread: widespread },
        });

        return patchWidespread;
    }

    async deleteCoordinate(coordinateId: string) {
        const coordinate = await this.getCoordinateById(+coordinateId);

        return await this.prisma.coordinates.delete({ where: { Id: coordinate.Id } });
    }

    async sendToPromouter(promId: string, routeId: string) {
        const route = await this.getRouteById(+routeId);

        return await this.prisma.route.update({ where: { Id: route.Id }, data: { userId: +promId } });
    }
}
