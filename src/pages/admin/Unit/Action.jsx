import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomInput } from '../../../components/index.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToggleSwitch } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { clearUnits } from '../../../redux/UnitSlice.js';
import { InlineLoader } from '../../../components/index.js';
import { errorToast } from '../../../utils/index.js';

const Action = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    unit_id: 0,
    unit_name: ''
  });
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    axios.get(`api/admin/all-unit`)
    .then(res => {
      if (res.data.status === 200) {
        const unit = res.data.all_unit.find(unit => unit.id == id);
        if (unit) {
          setFormData({
            unit_id: unit.id,
            unit_name: unit.unit_name
          });
        }
        setLoading(false);
      } else if (res.data.status == 404) {
        errorToast(res.data.msg);
        setLoading(false);
      }
    })
    .catch(err => {
      console.log(err);
      setLoading(false);
    })
  }, []);

  const submitUnit = async () => {
    setErrors([]);

    // Check if formData.unit_name is empty
    if (!formData.unit_name) {
      Swal.fire({
        title: 'Warning!',
        text: 'Unit Name is required',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return; // Exit the function if validation fails
    }

    try {
      const data = {
        formData: formData
      };

      await axios.post(`api/admin/add-edit-unit-process`, data).then((res) => {
        if (res.data.status === 200) {
          dispatch(clearUnits());
          navigate('/admin/unit');

          Swal.fire({
            title: 'Success!',
            text: res.data.msg,
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
        <h1 className="md:text-lg font-semibold ml-3">Manage Unit</h1>
      </div>

      {loading && <InlineLoader loadingText="staff data" />}

      {!loading && (
        <section>
          <form>
            {/* category details  */}
            <div className="bg-white p-6 rounded-md mb-5">
              <h1 className="font-semibold md:text-lg">
                {id > 0 ? 'Edit' : 'Add'} Unit
              </h1>
              <hr className="my-3" />
              <div className="grid grid-cols-3 gap-4 ">
                <CustomInput
                  value={formData.unit_name}
                  name="unit_name"
                  onChange={updateFormData}
                  placeholder="Enter Unit Name"
                  required
                  errorMsg={errors?.unit_name}
                  label={'Enter Unit Name*'}
                />
              </div>
            </div>

            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg
              text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              onClick={submitUnit}
            >
              Submit
            </button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Action;
