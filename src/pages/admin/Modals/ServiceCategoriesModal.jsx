import axios from 'axios';
import { ToggleSwitch } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { CustomBtn, CustomInput, CustomNumber, InlineLoader, CustomSelect } from '../../../components';
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoReloadCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  setServicesCategories,
  clearServicesCategories,
} from '../../../redux/ServicesSlice';
import { useNavigate } from 'react-router-dom';
import { BiShow } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { errorToast } from '../../../utils';

const ServiceCategoriesModal = ({ toggleCategoryModal }) => {
  const dispatch = useDispatch();
  const tableHeadings = ['SN', 'Name', 'Commision', 'Unit', 'GST', 'HSN', 'Actions'];
  const allcategory = useSelector((state) => state.services.categories);
  const [currentCategory, setCurrentCategory] = useState({
    category_name: '',
    commission_rate: 0,
    gst_rate: 0,
    hsn: '',
    unit: 0,
    mandatory: true,
    category_id: 0,
  });
  const [units, setUnits] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('add');
  const navigate = useNavigate();

  const getCategory = async (id) => {
    setLoadingData(true);
    try {
      await axios.get(`api/admin/add-edit-category/${id}`).then((res) => {
        if (res.data.status === 200) {
          setCurrentCategory({
            category_name: res.data.category.category_name,
            commission_rate: res.data.category.commission_rate,
            gst_rate: res.data.category.gst_rate,
            hsn: res.data.category.hsn,
            unit: res.data.category.unit,
            mandatory: res.data.category.status ? true : false,
            category_id: id,
          });
          setLoadingData(false);
        }
        setLoadingData(false);
      });
    } catch (error) {
      setLoadingData(false);
      errorToast(error)
    }
  };

  const getAllCategory = async () => {
    setLoading(true);
    try {
      await axios.get(`api/admin/all-category`).then((res) => {
        if (res.data.status === 200) {
          dispatch(setServicesCategories(res?.data?.all_category));
          setLoading(false);
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const getAllUnit = async () => {
    setLoading(true);
    try {
      await axios.get(`api/admin/all-unit`).then((res) => {
        if (res.data.status === 200) {
          console.log(res.data.all_unit);
          const flattenedData = res.data.all_unit.map(item => ({
            id: item.id,
            name: item.unit_name,
            ...item
          }));
          res.data.all_unit = flattenedData;
          console.log(res.data.all_unit);
          setUnits(res?.data?.all_unit);
          setLoading(false);
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const deleteCategory = async (id) => {
    setDeletingData(true);
    try {
      const data = {
        id: id,
      };
      await axios.post(`api/admin/delete-category`, data).then((res) => {
        if (res.data.status === 200) {
          getAllCategory();
          setDeletingData(false);
        }
        setDeletingData(false);
      });
    } catch (error) {
      setDeletingData(false);
      errorToast(error)
    }
  };

  const submitCategory = async () => {
    setAdding(true);
    try {
      const data = {
        formData: currentCategory,
      };

      await axios
        .post(`api/admin/add-edit-category-process`, data)
        .then((res) => {
          //console.log('add data', res.data);
          if (res.data.status === 200) {
            dispatch(clearServicesCategories());
            getAllCategory();
            setCurrentCategory({
              category_id: 0,
              commission_rate: 0,
              category_name: '',
              unit: 0,
              hsn: '',
              mandatory: '',
            });
            Swal.fire({
              title: 'Success!',
              text: res.data.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              timer: 3000,
            });
            setAdding(false);
          }
          setAdding(false);
        });
    } catch (error) {
      setAdding(false);
      errorToast(error)
    }
  };

  useEffect(() => {
    if (!allcategory) {
      getAllCategory();
    }
    getAllUnit();
  }, []);

  return (
    <div className="fixed z-10 left-0 right-0 top-0 bottom-0 overflow-auto  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-4/6 w-11/12 p-5 rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semiboldmd:text-lg capitalize">
            Manage categories
          </h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleCategoryModal}
          />
        </div>

        <div className="bg-white p-3 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="capitalize">{mode} category</p>{' '}
            <IoReloadCircleSharp
              onClick={() => {
                setCurrentCategory({
                  category_name: '',
                  mandatory: true,
                  category_id: 0,
                });
                setMode('add');
              }}
              className="cursor-pointer"
              size={20}
            />
          </div>
          <div className="flex justify-between">
                

            <CustomSelect
                label={'Select Unit'}
                options={units}
                value={currentCategory?.option?.id}
                name="unit"
                onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      unit: e.target.value,
                    })
                  }
                defaultOption={'Select'}
            />



            <CustomInput
              value={currentCategory.category_name}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  category_name: e.target.value,
                })
              }
              label={'Category name *'}
              placeholder={'Enter category name'}
            />
            <CustomInput
              value={currentCategory.commission_rate}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  commission_rate: e.target.value,
                })
              }
              label={'Commission Rate'}
              placeholder={'Enter Commission Rate'}
            />
            <CustomNumber
              value={currentCategory.gst_rate}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  gst_rate: e.target.value,
                })
              }
              label={'GST Rate'}
              placeholder={'GST Rate'}
            />
            <CustomInput
              value={currentCategory.hsn}
              onChange={(e) =>
                setCurrentCategory({
                  ...currentCategory,
                  hsn: e.target.value,
                })
              }
              label={'HSN'}
              placeholder={'HSN'}
            />
            <div className="flex items-center">
              <span className="mr-3">Mandatory</span>
              <ToggleSwitch
                checked={currentCategory.mandatory}
                onChange={() =>
                  setCurrentCategory({
                    ...currentCategory,
                    mandatory: !currentCategory.mandatory,
                  })
                }
              />
            </div>
            <CustomBtn onClick={submitCategory} loading={adding}>
              {mode}
            </CustomBtn>
          </div>
        </div>

        {loading && <InlineLoader loadingText={'Categories'} />}

        {!loading && allcategory?.length > 0 && (
          <div className="mt-5">
            <div className="overflow-x-auto relative">
              <table className="w-full text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                <thead className=" text-xs uppercase text-white  bg-green-400">
                  <tr>
                    {tableHeadings?.map((tableHeading, index) => (
                      <th scope="col" className="py-3 px-6" key={index}>
                        {tableHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allcategory?.length > 0 ? (
                    allcategory?.map((data, index) => (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {index + 1}
                        </th>
                        <td className="py-4 px-6">{data?.category_name}</td>
                        <td className="py-4 px-6">{data?.commission_rate}%</td>
                        <td className="py-4 px-6">{data?.unit?.unit_name}</td>
                        <td className="py-4 px-6">{data?.gst_rate}%</td>
                        <td className="py-4 px-6">{data?.hsn}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3 ">
                            <CustomBtn
                              loading={
                                loadingData &&
                                data.id === currentCategory.category_id
                              }
                              onClick={() =>
                                navigate(`/admin/department/${data.id}`)
                              }
                            >
                              <BiShow size={20} className=" text-white" />
                            </CustomBtn>
                            <CustomBtn
                              loading={
                                loadingData &&
                                data.id === currentCategory.category_id
                              }
                              onClick={() => {
                                setMode('edit');
                                setCurrentCategory({
                                  ...currentCategory,
                                  category_id: data.id,
                                });
                                getCategory(data.id);
                              }}
                            >
                              <TbEdit size={20} className=" text-white" />
                            </CustomBtn>
                            <CustomBtn
                              loading={
                                deletingData &&
                                data.id === currentCategory.category_id
                              }
                              onClick={() => {
                                setCurrentCategory({
                                  ...currentCategory,
                                  category_id: data.id,
                                });
                                const con = window.confirm('Are you sure ?');
                                if (con) deleteCategory(`${data?.id}`);
                              }}
                            >
                              <AiOutlineDelete
                                size={20}
                                className=" text-white"
                              />
                            </CustomBtn>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="py-4 px-6" colSpan={3}>
                        No Data Available!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCategoriesModal;
