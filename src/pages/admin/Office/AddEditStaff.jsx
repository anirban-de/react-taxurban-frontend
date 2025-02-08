import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomInput } from '../../../components/index.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToggleSwitch } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { clearStaffs, clearPageCount } from '../../../redux/OfficeSlice.js';
import { InlineLoader } from '../../../components/index.js';
import { errorToast } from '../../../utils/index.js';

const AddEditStaff = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staff_name: '',
    phone: '',
    email: '',
    password: '',
    //department_id: 0,
    department_id: [],
    mandatory: true,
    staff_id: 0,
  });
  const [alldepartment, setAllDepartment] = useState([]);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (id) => {
       setFormData((prevData) => {
           const isChecked = prevData.department_id.includes(id);

           return {
               ...prevData,
               department_id: isChecked
                   ? prevData.department_id.filter((deptId) => deptId !== id)
                   : [...prevData.department_id, id],
           };
       });
   };

  const setMandatory = () => {
    setFormData({ ...formData, mandatory: !formData.mandatory });
  };

  const getStaff = async () => {
    if (id) {
      setLoading(true);
      try {
        await axios.get(`api/admin/add-edit-staff/${id}`).then((res) => {
          if (res.data.status === 200) {
            setFormData({
              staff_name: res.data.staff.staff_name,
              phone: res.data.staff.phone,
              email: res.data.staff.email,
              password: res.data.staff.password,
              department_id: res.data.staff.department_id,
              mandatory: res.data.staff.status ? true : false,
              staff_id: id,
            });
            console.log('formData department_id= '+formData.department_id);
            setLoading(false);
          }
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        errorToast(error)
      }
    }
  };

  const getAllDepartment = async () => {
    try {
      await axios.get(`api/admin/get-all-category`).then((res) => {
        if (res.data.status === 200) {
          setAllDepartment(res.data.allcategory);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    getStaff();
    getAllDepartment();
  }, []);

  const submitStaff = async () => {
    setErrors([]);

    console.log('formData= '+formData.department_id);
    //return;



    try {
      const data = {
        formData: formData,
      };

      await axios.post(`api/admin/add-edit-staff-process`, data).then((res) => {
        if (res.data.status === 200) {
          dispatch(clearStaffs());
          dispatch(clearPageCount());
          //navigate('/admin/office-management');

          Swal.fire({
            title: 'Success!',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
            timer: 3000,
          });
        } else if (res.data.status === 400) {
          setErrors(res.data.validation_errors);
        }
      });
    } catch (error) { }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="md:text-lg font-semibold ml-3">Manage Staff</h1>
      </div>

      {loading && <InlineLoader loadingText="staff data" />}

      {!loading && (
        <section>
          <form>
            {/* category details  */}
            <div className="bg-white p-6 rounded-md mb-5">
              <h1 className="font-semibold md:text-lg">
                {id > 0 ? 'Edit' : 'Add'} Staff
              </h1>
              <hr className="my-3" />
              <div className="grid grid-cols-3 gap-4 ">
                <CustomInput
                  value={formData.staff_name}
                  name="staff_name"
                  onChange={updateFormData}
                  placeholder="Enter Staff Name"
                  required
                  errorMsg={errors?.staff_name}
                  label={'Enter Staff Name*'}
                />

                <CustomInput
                  value={formData.phone}
                  name="phone"
                  onChange={updateFormData}
                  placeholder="Enter Phone Number"
                  required
                  label={'Enter Phone Number*'}
                  errorMsg={errors?.phone}
                />

                <CustomInput
                  value={formData.email}
                  name="email"
                  onChange={updateFormData}
                  placeholder="Enter Email Address"
                  required
                  errorMsg={errors?.email}
                  label={'Enter Email Address*'}
                />

                <CustomInput
                  value={formData.password}
                  name="password"
                  onChange={updateFormData}
                  placeholder="Enter Password"
                  required
                  errorMsg={errors?.password}
                  label={'Enter Password *'}
                />


                {/*<div>
                  <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                    Select Department
                  </label>
                  <select  
                    name="department_id"
                    onChange={updateFormData}
                    className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  >
                    <option>Select</option>
                    {alldepartment.map((option, index) => (
                      <option
                        value={option?.id}
                        key={index}
                        selected={
                          option.id === formData.department_id ? true : false
                        }
                      >
                        {option?.category_name}
                      </option>
                    ))}
                  </select>
                </div>*/}

                



                <div>
                {alldepartment.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      className="outline-none text-green-400 rounded-md"
                      type="checkbox"
                      key={index}
                      //checked={option.id === formData.department_id}
                      checked={formData.department_id.includes(option.id)}
                      value={option.id} 
                      //onChange={(e) => updateFormData(e.target.checked)}
                      onChange={() => handleCheckboxChange(option.id)}
                    />
                    <span>{option?.category_name}</span>
                  </label>
                ))}
                </div>







                <div className="flex flex-col items-start justify-start">
                  <p className="mb-4 text-xs md:text-sm">Status</p>
                  <ToggleSwitch
                    checked={formData.mandatory}
                    onChange={() => setMandatory()}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg
              text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              onClick={submitStaff}
            >
              Submit
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default AddEditStaff;
