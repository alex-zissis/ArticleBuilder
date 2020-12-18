import React, {useContext, useEffect, useState} from "react";
import cx from "classnames";
import {Upload} from "react-feather";
import {IImageBlock} from "~/App.Types";
import {BaseBlockProps} from "../index";
import "./image-block.scss";
import {getApolloContext} from "@apollo/client";
import {GQLUploadImage} from "~/queries/articles";

enum ImageState {
    Initial = "initial",
    Uploading = "uploading",
    Uploaded = "uploaded",
}

const ImageBlock: React.FC<
    BaseBlockProps<IImageBlock> & Omit<IImageBlock, "type">
> = ({className, isFocused, src, onUpdate}) => {
    const [hasDoneInitialUpdate, setHasDoneInitialUpdate] = useState(false);
    const [editedSrc, setEditedSrc] = useState<string | undefined>(src);
    const [imageFile, setImageFile] = useState<File | undefined>();
    const [imageState, setImageState] = useState<ImageState>(
        editedSrc ? ImageState.Uploaded : ImageState.Initial
    );
    const [isInDropzone, setIsInDropzone] = useState(false);

    useEffect(() => {
        if (!hasDoneInitialUpdate) {
            setHasDoneInitialUpdate(true);
            return;
        }

        onUpdate({src: editedSrc});
    }, [editedSrc]);

    useEffect(() => {
        if (imageFile && imageState === ImageState.Initial) {
            setImageState(ImageState.Uploading);
            const formData = new FormData();
            formData.append("image", imageFile);

            fetch("http://localhost:4000/api/v1/image/upload", {
                method: "POST",
                body: formData,
            })
                .then(
                    (res) =>
                        res.json() as Promise<{data: {id: string; type: string; url: string}}>
                )
                .then(({data: {url}}) => {
                    console.log(url);
                    setEditedSrc(url);
                    setImageState(ImageState.Uploaded);
                })
                .catch((err) => {
                    console.log(err);
                });            
        }
    }, [imageFile]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        const [file] = event.dataTransfer.files;
        setImageFile(file);
        setIsInDropzone(false);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsInDropzone(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsInDropzone(false);
    };

    return Boolean(editedSrc) ? (
        <div className={cx(className, "c-block-image")}>
            <img src={editedSrc} alt="" />
            {imageState}
        </div>
    ) : (
        <label
            htmlFor="image-file"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
        >
            <div
                className={cx("c-block-image", "c-block-image--placeholder", {
                    "c-block-image--dropzone": isInDropzone,
                })}
            >
                <Upload size={36} />
                <span className="c-block-image__helper">
                    Click or drag an image to upload it.
                </span>
                <input
                    onChange={handleUpload}
                    id="image-file"
                    className="c-block-image__file"
                    type="file"
                />
                {imageState}
            </div>
        </label>
    );
};

export {ImageBlock};
