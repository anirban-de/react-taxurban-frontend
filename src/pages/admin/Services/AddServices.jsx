import React, { useEffect, useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BiRupee } from 'react-icons/bi';
import { CustomInput, CustomSelect } from '../../../components';
import { AiOutlineDelete } from 'react-icons/ai';
import { ToggleSwitch } from 'flowbite-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { deleteServicesSlice } from '../../../redux/ServicesSlice';
import { useDispatch } from 'react-redux';
import { errorToast } from '../../../utils';

const SERVICE_TYPES = [
  {
    name: 'Individual',
    value: 'Individual',
  },
  {
    name: 'Partnership',
    value: 'Partnership',
  },
  {
    name: 'Limited liability partnership(LLP)',
    value: 'Partnership',
  },
  {
    name: 'Hindu Undivided Family(HUF)',
    value: 'Hindu Undivided Family(HUF)',
  },
  {
    name: 'Company',
    value: 'company',
  },
  {
    name: 'Government',
    value: 'Government',
  },
  {
    name: 'Local Government',
    value: 'Local Government',
  },
  {
    name: 'Society',
    value: 'Society',
  },
  {
    name: 'Trust',
    value: 'Trust',
  },
  {
    name: 'Artificial Judicial Person(AJP)',
    value: 'Artificial Judicial Person(AJP)',
  },
  {
    name: 'Association of Persons(AOP)',
    value: 'Association of Persons(AOP)',
  },
  {
    name: 'Body of Individuals(BOI)',
    value: 'Body of Individuals(BOI)',
  },
  {
    name: 'PAN Card for Foreigners',
    value: 'PAN Card for Foreigners',
  }
];

const INPUT_TYPES = [
  {
    name: 'Text',
    value: 'text',
  },
  {
    name: 'yes or no',
    value: 'checkbox',
  },
  {
    name: 'Number',
    value: 'number',
  },
  {
    name: 'Date',
    value: 'date',
  },
];

const CLASS = [
  {
    name: 'Name',
    value: 'Name',
  },
  {
    name: 'Date',
    value: 'Date',
  },
  {
    name: 'PAN',
    value: 'PAN',
  },
  {
    name: 'Aadhar',
    value: 'Aadhar',
  },
  {
    name: 'GSTIN',
    value: 'GSTIN',
  },
  {
    name: 'Mobile',
    value: 'Mobile',
  },
  {
    name: 'Email',
    value: 'Email',
  },
  // {
  //   name: 'Alpha & Symbol',
  //   value: 'Alpha & Symbol',
  // },
  // {
  //   name: 'Alpha & Symbol',
  //   value: 'AlphaS',
  // },
  // {
  //   name: 'Numeric & Symbol',
  //   value: 'NumericS',
  // },
  {
    name: 'None',
    value: 'None',
  },
];

const tableHeadings = ['Particulars', 'Type', 'Class', 'Mandatory'];
const subheadHeadings1 = ['Name'];
const subheadHeadings2 = ['Name', 'Actions'];

const AddServices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allcategory, setAllCategory] = useState([]);
  const [formData, setFormData] = useState({
    serviceType: '',
    category: '',
    tokenAmount: '',
  });
  const [informations, setInformations] = useState([
    {
      particulars: '',
      type: '',
      class: '',
      mandatory: false,
      inform_id: 0,
    },
  ]);

  const [newdoc, setNewDoc] = useState([
    {
      docname: '',
      mandatory: false,
    },
  ]);

  const [subheadlevel1, setSubHeadLevel1] = useState([
    {
      name: '',
      level_id: 0,
    },
  ]);

  const [subheadlevel2, setSubHeadLevel2] = useState([
    {
      name: '',
      level_id: 0,
    },
  ]);

  const [remarks, setRemarks] = useState('');
  const [errors, setErrors] = useState([]);

  const docHeadings = ['Document Name', 'Mandatory'];

  const DEMO_DOCUMENT_DATA = [
    // {
    //   name: 'Adhar',
    //   select: false,
    //   mandatory: false,
    // },
    // {
    //   name: 'PAN',
    //   select: false,
    //   mandatory: false,
    // },
  ];

  const [documents, setDocuments] = useState([...DEMO_DOCUMENT_DATA]);

  const getAllCategories = async () => {
    try {
      await axios.get(`api/admin/get-all-category`).then((res) => {
        if (res.data.status === 200) {
          setAllCategory(res.data.allcategory);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  const getAllDocuments = async () => {
    try {
      const type_name = 'service';

      await axios.get(`api/admin/get-documents/0/${type_name}`).then((res) => {
        if (res.data.status === 200) {
          setDocuments(res.data.docs);
          //console.log(res.data.docs);
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      getAllCategories();
      getAllDocuments();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateInformation = (e, index) => {
    const { name, value } = e.target;
    let temp = [...informations];
    temp[index] = { ...temp[index], [name]: value };
    setInformations(temp);
  };

  const updateSubHeadLevel1 = (e, index) => {
    const { name, value } = e.target;
    let temp = [...subheadlevel1];
    temp[index] = { ...temp[index], [name]: value };
    setSubHeadLevel1(temp);
  };

  const updateSubHeadLevel2 = (e, index) => {
    const { name, value } = e.target;
    let temp = [...subheadlevel2];
    temp[index] = { ...temp[index], [name]: value };
    setSubHeadLevel2(temp);
  };

  const setMandatory = (index) => {
    let temp = [...informations];
    temp[index] = { ...temp[index], mandatory: !temp[index].mandatory };
    setInformations(temp);
  };

  const addMoreInfo = (e) => {
    e.preventDefault();
    let temp = [...informations];
    temp.push({
      id: informations.length + 1,
      particulars: '',
      type: '',
      class: '',
      mandatory: false,
      inform_id: 0,
    });
    setInformations(temp);
  };

  const addMoreSubHead1Info = (e) => {
    e.preventDefault();
    let temp = [...subheadlevel1];
    temp.push({
      id: subheadlevel1.length + 1,
      name: '',
      level_id: 0,
    });
    setSubHeadLevel1(temp);
  };

  const addMoreSubHead2Info = (e) => {
    e.preventDefault();
    let temp = [...subheadlevel2];
    temp.push({
      id: subheadlevel2.length + 1,
      name: '',
      level_id: 0,
    });
    setSubHeadLevel2(temp);
  };

  const deleteInformation = (index) => {
    let temp = [...informations];
    temp.splice(index, 1);
    setInformations(temp);
  };

  const deleteSubHeadLevel1 = (index) => {
    let temp = [...subheadlevel1];
    temp.splice(index, 1);
    setSubHeadLevel1(temp);
  };

  const deleteSubHeadLevel2 = (index) => {
    let temp = [...subheadlevel2];
    temp.splice(index, 1);
    setSubHeadLevel2(temp);
  };

  const submitService = async () => {
    setErrors([]);

    try {
      const data = {
        formData: formData,
        subheadlevel1: subheadlevel1,
        subheadlevel2: subheadlevel2,
        informations: informations,
        documents: documents,
        newdoc: newdoc,
        remarks: remarks,
        service_id: 0,
      };

      await axios
        .post(`api/admin/add-edit-service-process`, data)
        .then((res) => {
          if (res.data.status === 200) {
            dispatch(deleteServicesSlice());

            navigate('/admin/services');

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

  // documents required
  const setDocumentsMandatory = (index) => {
    let temp = [...documents];
    if (temp[index]?.select) {
      temp[index] = { ...temp[index], mandatory: !temp[index].mandatory };
      setDocuments(temp);
    }
  };

  const selectDocuments = (index) => {
    let temp = [...documents];
    temp[index] = { ...temp[index], select: !temp[index].select };
    setDocuments(temp);
  };

  const addMoreDoc = () => {
    setNewDoc([
      ...newdoc,
      {
        docname: '',
        mandatory: '',
      },
    ]);
  };

  const setDocMandatory = (index) => {
    let temp = [...newdoc];
    temp[index] = {
      docname: temp[index].docname,
      mandatory: !temp[index].mandatory,
    };
    setNewDoc(temp);
  };

  const updateDoc = (e, index) => {
    const { name, value } = e.target;
    let temp = [...newdoc];
    temp[index] = { ...temp[index], [name]: value };
    setNewDoc(temp);
  };

  const deleteDoc = (index) => {
    let temp = [...newdoc];
    temp.splice(index, 1);
    setNewDoc(temp);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <FiArrowLeft
          size={24}
          onClick={() => navigate('/admin/services')}
          className="cursor-pointer"
        />
        <h1 className="md:text-lg font-semibold ml-3">Add Services</h1>
      </div>
      <section>
        <form>
          {/* service details  */}
          <div className="bg-white p-6 rounded-md mb-5">
            <h1 className="font-semibold md:text-lg">Service Information</h1>
            <hr className="my-3" />
            <div className="grid gap-5 md:grid-cols-3">
              <CustomSelect
                value={formData.serviceType}
                name="serviceType"
                onChange={updateFormData}
                label={'Service Type *'}
                defaultOption="Select Service type"
                options={SERVICE_TYPES}
                required
              />
              <div>
                <label className="block mb-2 text-xs md:text-sm font-medium text-gray-900 dark:text-gray-300">
                  Select Category
                </label>
                <select
                  name="category"
                  onChange={updateFormData}
                  className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                >
                  <option>Select</option>
                  {allcategory.map((option, index) => (
                    <option value={option?.id} key={index}>
                      {option?.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <CustomInput
                type="number"
                value={formData.tokenAmount}
                name="tokenAmount"
                onChange={updateFormData}
                placeholder="Enter Token Amount"
                label={'Token Amount *'}
                required
                icon={<BiRupee size={20} />}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-md mb-5">
            {/* Sub Head Level 1 */}

            <h1 className="font-semibold md:text-lg">Sub Head Level 1</h1>

            {subheadlevel1.length !== 0 && (
              <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className=" text-xs uppercase text-white  bg-green-400">
                  <tr>
                    {subheadHeadings1?.map((tableHeading, index) => (
                      <th scope="col" className="py-3 px-6" key={index}>
                        {tableHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subheadlevel1?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="py-4 px-6">
                        <CustomInput
                          value={data.name}
                          name="name"
                          onChange={(e) => updateSubHeadLevel1(e, index)}
                          placeholder="Enter Name"
                        />
                      </td>
                      <input
                        type="hidden"
                        value={data.level_id}
                        name="level_id"
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* <button
              onClick={addMoreSubHead1Info}
              type="button"
              className={`mt-3 ${
                subheadlevel1.length > 0 && 'ml-5'
              } text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800`}
            >
              Add more +
            </button> */}

            {/* Sub Head Level 2 */}

            <h1 className="font-semibold md:text-lg mt-5">Sub Head Level 2</h1>

            {subheadlevel2.length !== 0 && (
              <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className=" text-xs uppercase text-white  bg-green-400">
                  <tr>
                    {subheadHeadings2?.map((tableHeading, index) => (
                      <th scope="col" className="py-3 px-6" key={index}>
                        {tableHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subheadlevel2?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="py-4 px-6">
                        <CustomInput
                          value={data.name}
                          name="name"
                          onChange={(e) => updateSubHeadLevel2(e, index)}
                          placeholder="Enter Name"
                        />
                      </td>
                      <input
                        type="hidden"
                        value={data.level_id}
                        name="level_id"
                      />
                      <td className="py-4 px-6 flex justify-between items-center">
                        <div
                          onClick={() => deleteSubHeadLevel2(`${index}`)}
                          className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                        >
                          <AiOutlineDelete size={20} className=" text-white" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={addMoreSubHead2Info}
              type="button"
              className={`mt-3 ${subheadlevel1.length > 0 && 'ml-5'
                } text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800`}
            >
              Add more +
            </button>

            <h1 className="font-semibold md:text-lg">
              Additional Information Required For Service
            </h1>
            <hr className="my-3" />
            {informations.length === 0 && (
              <h1 className="font-medium mb-2">No Information added !</h1>
            )}

            {informations.length !== 0 && (
              <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
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
                  {informations?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="py-4 px-6">
                        <CustomInput
                          value={data.particulars}
                          name="particulars"
                          onChange={(e) => updateInformation(e, index)}
                          placeholder="Enter particulars"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <CustomSelect
                          defaultOption={'Select input type'}
                          value={data?.type}
                          name="type"
                          onChange={(e) => updateInformation(e, index)}
                          options={INPUT_TYPES}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <CustomSelect
                          defaultOption={'Select className'}
                          value={data?.class}
                          name="class"
                          onChange={(e) => updateInformation(e, index)}
                          options={CLASS}
                        />
                      </td>
                      <input
                        type="hidden"
                        value={data.inform_id}
                        name="inform_id"
                      />
                      <td className="py-4 px-6 flex justify-between items-center">
                        <ToggleSwitch
                          checked={data.mandatory}
                          onChange={() => setMandatory(index)}
                        />
                        <div
                          onClick={() => deleteInformation(`${index}`)}
                          className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                        >
                          <AiOutlineDelete size={20} className=" text-white" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={addMoreInfo}
              type="button"
              className={`mt-3 ${informations.length > 0 && 'ml-5'
                } text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800`}
            >
              Add more +
            </button>

            {/* documents required  */}
            {/* <div className="bg-white p-6 rounded-md mb-5"> */}

            <h1 className="font-semibold md:text-lg">Documents Required</h1>
            <div className="flex mt-3 gap-3 flex-wrap">
              {/*
                {documents?.map((item, index) => (
                  <div className="flex items-center justify-center" key={index}>
                    <input
                      value={item.select}
                      onChange={() => selectDocuments(index)}
                      id="default-checkbox"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 bg-gray-100 rounded border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="mx-3">{item?.name}</span>
                    <ToggleSwitch
                      checked={item.mandatory}
                      onChange={() => setDocumentsMandatory(index)}
                    />
                  </div>
                ))}
                */}
            </div>

            {/* </div> */}

            {newdoc.length !== 0 && (
              <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className=" text-xs uppercase text-white  bg-green-400">
                  <tr>
                    {docHeadings?.map((tableHeading, index) => (
                      <th scope="col" className="py-3 px-6" key={index}>
                        {tableHeading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newdoc?.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="py-4 px-6">
                        <CustomInput
                          value={data.docname}
                          name="docname"
                          onChange={(e) => updateDoc(e, index)}
                          placeholder="Enter Doc Name"
                        />
                      </td>
                      <td className="py-4 px-6 flex justify-between items-center">
                        <ToggleSwitch
                          checked={data.mandatory}
                          onChange={() => setDocMandatory(index)}
                        />
                        <div
                          onClick={() => deleteDoc(`${index}`)}
                          className="bg-green-400 hover:bg-green-500 p-1 cursor-pointer"
                        >
                          <AiOutlineDelete size={20} className=" text-white" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={addMoreDoc}
              type="button"
              className={`mt-3 ml-5 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800`}
            >
              Add more doc +
            </button>

            {/* remarks section  */}
            {/* <div className="bg-white p-6 rounded-md mb-5"> */}
            <h1 className="font-semibold md:text-lg">Remarks</h1>
            <div className="flex mt-3 justify-between items-center gap-3 ">
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your remarks"
              />
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                onClick={submitService}
              >
                Submit
              </button>
            </div>
            {/* </div> */}
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddServices;
