import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PromouterService } from './promouter.service';
import { RouteStatus } from '@prisma/client';

export type newRoute = {
    City: string;
    userId: number;
    Stage: number;
    Status: RouteStatus;
    DateTimeClose: Date;
};

export type newCoordinate = {
    Latitude: string;
    Longitude: string;
    RouteId: number;
    MapUrl?: string;
};

@Controller('prom')
export class PromouterController {
    constructor(private readonly promouterService: PromouterService) {}

    @Get('')
    async getAllRoutes() {
        return this.promouterService.getAll();
    }

    @Get('/coordinate')
    async getAllCoordinatesByRouteId(@Query('routeId') routeId: string) {
        return this.promouterService.getAllCoordinatesByRouteId(routeId);
    }

    @Get(':promId')
    async getRoutesByPromId(@Param('promId') promId: string) {
        return this.promouterService.getAllByPromId(promId);
    }

    @Post('/newRoute')
    async postNewRoute(@Body() newRoute: newRoute) {
        return this.promouterService.createNewRoute(newRoute);
    }

    @Post('/newCoordinate')
    async postNewCoordinate(@Body() newCoordinate: newCoordinate) {
        return this.promouterService.createNewCoordinate(newCoordinate);
    }
}
