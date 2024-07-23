import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get(':id')
    async getImageById(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
        const image = await this.filesService.getFileById(+id);

        const stream = Readable.from(image.Data);

        response.set({
            'Content-Disposition': `inline; filename="${image.FileName}"`,
            'Content-Type': 'image',
        });

        return new StreamableFile(stream);
    }
}
