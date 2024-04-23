import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PromouterService } from './promouter.service';
import { Coordinates, RouteStatus } from '@prisma/client';

export type newRoute = {
    City: string;
    userId: number;
    Stage: number;
    Status: RouteStatus;
    DateTimeClose: Date;
};

export type newCoordinate = {
    CoordinateUrl: string;
    Comments: string;
    Id: number;
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

    @Patch('/editCoordinate')
    async editCoordinate(@Body() editedCoordinate: Coordinates) {
        return this.promouterService.editCoordinate(editedCoordinate);
    }

    @Patch('/widespread/:coordinateId')
    async patchWidespread(@Param('coordinateId') coordinateId: string, @Query('widespread') widespread: string) {
        return await this.promouterService.toggleWidespread(coordinateId, widespread);
    }

    @Patch(`/sendRoute`)
    async sendRouteToPromouter(@Query('promId') promId: string, @Query('routeId') routeId: string) {
        return await this.promouterService.sendToPromouter(promId, routeId);
    }

    @Patch('deleteCoordinate/:coordinateId')
    async deleteCoordinate(@Param('coordinateId') coordinateId: string) {
        return await this.promouterService.deleteCoordinate(coordinateId);
    }
}
