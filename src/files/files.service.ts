import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) {}

    async uploadFile(dataBuffer: Buffer, fileName: string) {
        const newFile = await this.prisma.image.create({
            data: { FileName: fileName, Data: dataBuffer },
        });

        return newFile;
    }

    async getFileById(fileId: number) {
        const file = await this.prisma.image.findFirst({ where: { Id: fileId } });

        if (!file) {
            throw new NotFoundException();
        }

        return file;
    }

    async deleteFileById(fileId: number) {
        const file = await this.prisma.image.findFirst({ where: { Id: fileId } });

        if (!file) {
            throw new NotFoundException();
        } else {
            await this.prisma.image.delete({ where: { Id: file.Id } });
            return 'File deleted successfully';
        }
    }
}
