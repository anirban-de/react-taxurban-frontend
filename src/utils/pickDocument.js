import { toast } from 'react-toastify';

export const pickDocument = (e) => {
    const { files } = e.target;

    if (files[0].size > 1000000) {
        toast.info("Image size must be less than 1MB")
        e.target.value = null;
        return null;
    }

    return files[0];
}