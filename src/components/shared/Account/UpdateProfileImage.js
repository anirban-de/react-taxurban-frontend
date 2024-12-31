import React from 'react'
import { NoAvatarImage } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useAwsS3 from '../../../hooks/useAwsS3';
import { uploadFolders } from '../../../utils/uploadFolders';
import { setPhoto } from '../../../redux/AccountSlice';
import axios from 'axios';
import Swal from 'sweetalert2';
import InlineLoader from '../../shared/InlineLoader';
import { pickDocument } from '../../../utils/pickDocument';
import { errorToast } from '../../../utils';

const UpdateProfileImage = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state?.account);
  const auth = useSelector((state) => state?.auth);

  const [loading, setLoading] = React.useState(false);

  const location = useLocation();
  const { uploadToS3, deleteFromS3 } = useAwsS3();

  const userType = location.pathname.split('/')[1];

  const updatePhoto = async (e) => {
    e.preventDefault();
    const file = pickDocument(e);
    if (file === null) {
      return;
    }

    setLoading(true);
    try {
      if (account.photo !== null && typeof account.photo === 'string') {
        await deleteFromS3(account.photo);
      }

      const imageRes = await uploadToS3(file, `${uploadFolders.UserFiles.customer}/${auth?.email.split('@')[0]}`);
      if (imageRes?.url) {
        dispatch(setPhoto(imageRes.url));
        const data = {
          photo: imageRes.url,
          photo_id: null,
        };
        const res = await axios.post(`api/${userType}/update-${userType}-photo`, data)
        if (res.data.status === 200) {
          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        }
      }
    } catch (error) {
      errorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-start gap-3 ">
        <div className="w-full flex flex-col gap-3">
          <div className="w-[200px] h-[200px]">
            <img
              src={account.photo || NoAvatarImage}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          {loading ? <InlineLoader customText={"Updating Image"} /> :
            <input
              name="photo"
              type="file"
              accept='image/*'
              onChange={updatePhoto}
              className="block text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer w-fit mt-2"
              required={true}
            />
          }
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileImage