import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

declare const module: any;

async function bootstrap() {
    const keyFile = fs.readFileSync('cert/key.pem');
    const certFile = fs.readFileSync('cert/cert.pem');

    const app = await NestFactory.create(AppModule, {
        cors: true,
        httpsOptions: {
            key: keyFile,
            cert: certFile,
        },
    });
    app.setGlobalPrefix('api');
    await app.listen(5555);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
