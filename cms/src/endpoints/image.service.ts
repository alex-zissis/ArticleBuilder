import path from "path";
import {copyFile, unlink} from "fs/promises";
import {File} from "formidable";
import {nanoid} from "nanoid";

class ImageService {
    private readonly publicImageDir = path.join(__dirname, `../../public`);
    private readonly publicImageBaseUrl = "http://localhost:4000/public";

    async deleteImage(fileName: string) {
        await unlink(`${this.publicImageDir}/${fileName}`).catch((err) => {
            console.log(err);
            throw new Error();
        });
    }

    async saveImage(file: File) {
        const id = nanoid(12);
        const extension = file.type.split("/")[1];

        await copyFile(
            file.path,
            `${this.publicImageDir}/${id}.${extension}`
        ).catch((err) => {
            console.log(err);
            throw Error(err);
        });

        return {
            id,
            imageType: file.type,
            url: `${this.publicImageBaseUrl}/${id}.${extension}`,
        };
    }
}

export {ImageService};
