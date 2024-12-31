import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { errorToast } from "../utils";

function base64ToBlob(base64String, contentType = "application/octet-stream") {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

const useAwsS3 = () => {
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isFileDownloading = (url) => {
        if (!downloading?.[url]) {
            return false;
        }

        if (downloading?.[url] === true) {
            return true;
        }
        return false;

    }

    const uploadMultipleToS3 = (files, container = "/test") => {
        console.log('files: ', files);
        return new Promise(async (resolve, reject) => {
            try {
                const requestArr = [];
                files.forEach(async (file, index) => {
                    if (file === null || (typeof file === "string" && file.includes("aws"))) {
                        requestArr.push(Promise.resolve(true));
                    } else {
                        const fromData = new FormData();
                        fromData.append('featured_image', file);
                        fromData.append('container', container);
                        requestArr.push(axios.post(`api/upload-aws-s3`, fromData, { headers: { 'Content-Type': 'multipart/form-data' } }));
                    }
                });

                const responses = await Promise.all(requestArr);
                resolve({ success: true, responses: responses });

            } catch (error) {
                reject(error?.message);
            }
        });
    }

    const deleteFromS3 = (image_url) => {
        return new Promise(async (resolve, reject) => {
            setDeleting(true);
            try {
                const res = await axios.post("api/delete-aws-s3", { featured_image: image_url })
                if (res.data.status === 200) {
                    resolve({ success: true });
                }
            } catch (error) {
                errorToast(error?.message);
                reject(error?.message);
            } finally {
                setDeleting(false);
            }
        });
    }

    const uploadToS3 = (file, container = "/test", showToast = true) => {
        return new Promise(async (resolve, reject) => {
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('featured_image', file);
                formData.append('container', container);
                const res = await axios.post(`api/upload-aws-s3`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (res.data.status === 200) {
                    if (showToast) {
                        toast.success(res.data.message);
                    }
                    resolve({ url: res.data?.file_path });
                }

                if (res.data.status !== 200) {
                    if (showToast) {
                        errorToast(res.data.message);
                    }
                    reject(res.data?.message);
                }

            } catch (error) {
                errorToast("Error Uploading Image");
                reject(error?.message);
            } finally {
                setUploading(false);
            }
        });
    }

    const downloadFromS3 = async (image_url, index, fileName = "file") => {
        try {
            setDownloading({ [`${image_url}${index}`]: true });
            const res = await axios.post("api/aws-downloader", { file_link: image_url });
            console.log(res.data);
            const blob = base64ToBlob(`data:${res.data.content_type};base64,${res.data.image_data}`);
            const url = URL.createObjectURL(blob);
            const aTag = document.createElement('a');
            aTag.href = url;
            const fileExtension = res.data.content_type.split('/')[1];
            aTag.download = `${fileName}.${fileExtension}`;
            aTag.click();
        } catch (error) {
            errorToast("Error Downloading Image");
        } finally {
            setDownloading({ [`${image_url}${index}`]: false });
        }
    }

    return { uploadToS3, downloadFromS3, deleteFromS3, uploadMultipleToS3, isFileDownloading, uploading, downloading, deleting }
}

export default useAwsS3;