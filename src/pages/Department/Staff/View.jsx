import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomInput } from '../../../components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToggleSwitch } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { clearStaffs } from '../../../redux/OfficeSlice.js';
import { InlineLoader } from '../../../components';
import { toast } from 'react-toastify';
import { errorToast } from '../../../utils/index.js';

const View = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staff_name: '',
    phone: '',
    email: '',
    department_id: 0,
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

  const setMandatory = () => {
    setFormData({ ...formData, mandatory: !formData.mandatory });
  };

  const getStaff = async () => {
    if (id) {
      setLoading(true);
      try {
        await axios.get(`api/department/add-edit-staff/${id}`).then((res) => {
          if (res.data.status === 200) {
            setFormData({
              staff_name: res.data.staff.staff_name,
              phone: res.data.staff.phone,
              email: res.data.staff.email,
              department_id: res.data.staff.department_id,
              mandatory: res.data.staff.status ? true : false,
              staff_id: id,
            });
            setLoading(false);
          }
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        errorToast(error?.response?.data?.message || error?.message || 'Something went wrong')
      }
    }
  };

  useEffect(() => {
    getStaff();
  }, []);

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
              <h1 className="font-semibold md:text-lg">View Staff</h1>
              <hr className="my-3" />
              <div className="grid grid-cols-3 gap-4 ">
                <CustomInput
                  value={formData.staff_name}
                  name="staff_name"
                  onChange={updateFormData}
                  placeholder="Enter Staff Name"
                  required
                  errorMsg={errors?.staff_name}
                  label={'Staff Name'}
                  readOnly
                />

                <CustomInput
                  value={formData.phone}
                  name="phone"
                  onChange={updateFormData}
                  placeholder="Enter Phone Number"
                  required
                  label={'Phone Number'}
                  errorMsg={errors?.phone}
                  readOnly
                />

                <CustomInput
                  value={formData.email}
                  name="email"
                  onChange={updateFormData}
                  placeholder="Enter Email Address"
                  required
                  errorMsg={errors?.email}
                  label={'Email Address'}
                  readOnly
                />

                <div className="flex flex-col items-start justify-start">
                  <p className="mb-4 text-xs md:text-sm">Status</p>
                  {formData.mandatory ? (
                    <span className="bg-green-100 text-green-800  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800  text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default View;
