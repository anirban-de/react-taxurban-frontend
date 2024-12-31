import axios from 'axios';
import { ToggleSwitch } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { CustomBtn, CustomInput, InlineLoader } from '../../../components';
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoReloadCircleSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { setDepartment } from '../../../redux/OfficeSlice';
import { errorToast } from '../../../utils';

const DepartmentModal = ({ toggleDepartmentModal }) => {
  const dispatch = useDispatch();
  const tableHeadings = ['SN', 'Name', 'Actions'];
  const allDeapartment = useSelector((state) => state.office.departments);
  const [currentDepartment, setCurrentDepartment] = useState({
    department_name: '',
    mandatory: true,
    department_id: 0,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('add');

  const getDepartment = async (id) => {
    setLoadingData(true);
    try {
      await axios.get(`api/admin/add-edit-department/${id}`).then((res) => {
        if (res.data.status === 200) {
          setCurrentDepartment({
            department_name: res.data.department.department_name,
            mandatory: res.data.department.status ? true : false,
            department_id: id,
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

  const getAllDeparment = async () => {
    setLoading(true);
    try {
      await axios.get(`api/admin/all-department`).then((res) => {
        if (res.data.status === 200) {
          dispatch(setDepartment(res?.data?.all_department));
          setLoading(false);
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const deleteDepartment = async (id) => {
    setDeletingData(true);
    try {
      const data = {
        id: id,
      };
      await axios.post(`api/admin/delete-department`, data).then((res) => {
        if (res.data.status === 200) {
          getAllDeparment();
          setDeletingData(false);
        }
        setDeletingData(false);
      });
    } catch (error) {
      setDeletingData(false);
      errorToast(error)
    }
  };

  const submitDepartment = async () => {
    setAdding(true);
    try {
      const data = {
        formData: currentDepartment,
      };

      await axios
        .post(`api/admin/add-edit-department-process`, data)
        .then((res) => {
          console.log('add data', res.data);
          if (res.data.status === 200) {
            getAllDeparment();
            setCurrentDepartment({
              department_name: '',
              mandatory: true,
              department_id: 0,
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
    if (!allDeapartment) {
      getAllDeparment();
    }
  }, []);

  return (
    <div className="fixed z-10 left-0 right-0 top-0 bottom-0 overflow-auto  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-2/6 w-11/12 p-5 rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-semiboldmd:text-lg capitalize">
            Manage Deparments
          </h1>
          <AiFillCloseCircle
            size={24}
            className="cursor-pointer"
            onClick={toggleDepartmentModal}
          />
        </div>

        <div className="bg-white p-3 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="capitalize">{mode} Department</p>{' '}
            <IoReloadCircleSharp
              onClick={() => {
                setCurrentDepartment({
                  department_name: '',
                  mandatory: true,
                  department_id: 0,
                });
                setMode('add');
              }}
              className="cursor-pointer"
              size={20}
            />
          </div>
          <div className="flex justify-between">
            <CustomInput
              value={currentDepartment.department_name}
              onChange={(e) =>
                setCurrentDepartment({
                  ...currentDepartment,
                  department_name: e.target.value,
                })
              }
              placeholder={'Enter Deparment name'}
            />
            <div className="flex items-center">
              <span className="mr-3">Mandatory</span>
              <ToggleSwitch
                checked={currentDepartment.mandatory}
                onChange={() =>
                  setCurrentDepartment({
                    ...currentDepartment,
                    mandatory: !currentDepartment.mandatory,
                  })
                }
              />
            </div>
            <CustomBtn onClick={submitDepartment} loading={adding}>
              {mode}
            </CustomBtn>
          </div>
        </div>

        {loading && <InlineLoader loadingText={'Categories'} />}

        {!loading && allDeapartment?.length > 0 && (
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
                  {allDeapartment?.length > 0 ? (
                    allDeapartment?.map((data, index) => (
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
                        <td className="py-4 px-6">{data?.department_name}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3 ">
                            <CustomBtn
                              loading={
                                loadingData &&
                                data.id === currentDepartment.department_id
                              }
                              onClick={() => {
                                setMode('edit');
                                setCurrentDepartment({
                                  ...currentDepartment,
                                  department_id: data.id,
                                });
                                getDepartment(data.id);
                              }}
                            >
                              <TbEdit size={20} className=" text-white" />
                            </CustomBtn>
                            <CustomBtn
                              loading={
                                deletingData &&
                                data.id === currentDepartment.department_id
                              }
                              onClick={() => {
                                setCurrentDepartment({
                                  ...currentDepartment,
                                  department_id: data.id,
                                });
                                const con = window.confirm('Are you sure ?');
                                if (con) deleteDepartment(`${data?.id}`);
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

export default DepartmentModal;
