import Router from '@koa/router';
import koaBody from 'koa-body';
import {ImageService} from './image.service';

const imageService = new ImageService();

const ImageRouter = new Router({
    prefix: '/api/v1/image'
});

const AllowedImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

ImageRouter.delete('/:filename', async ctx => {
    const {filename} = ctx.params as {filename: string};

    await imageService.deleteImage(filename);

    ctx.body = {
        status: 'Success',
    }

    return ctx;
})

ImageRouter.post('/upload', koaBody({multipart: true}), async (ctx) => {
    const image = ctx.request.files?.image;

    if (!image || !AllowedImageTypes.includes(image.type)) {
        ctx.body = {
            status: 'Error',
            message: 'Invalid image provided',
        }
        ctx.status = 400;

        return ctx;
    }

    const res = await imageService.saveImage(image).catch(e => {

    });

    if (!res) {
        ctx.body = {
            status: 'Error',
            message: 'Error saving image',
        }
        ctx.status = 400;

        return ctx;
    }

    ctx.body = {
        status: 'Success',
        data: {...res},
    }
});

export {ImageRouter};

