import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ServiceCategoriesModal from '../Modals/ServiceCategoriesModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSrReports } from '../../../redux/SrReportSlice';
import { CustomBtn, CustomInput } from '../../../components';
import { FiEdit, FiRefreshCcw } from 'react-icons/fi';
import ActionBtn from '../../../components/shared/ActionBtn';
import CustomTables from '../../../components/shared/CustomTables';
import { errorToast } from '../../../utils';
import TableToExcelApi from '../../../components/shared/TableToExcelApi';

const TABLE_HEADINGS = [
  'SN',
  'SR ID',
  'Client Name',
  'SR Date',
  'First Payment Date',
  'Status'
];

const AdminServices = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const activepage = 0;

  const allservices = useSelector((state) => state.srreport.report);
  //console.log("", allservices);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const toggleCategoryModal = () => setCategoryModal(!categoryModal);
  const [search, setSearch] = useState('');

  let modifyDate = (date) => {
      if (date !== '') {
        date.toLocaleDateString().split('/').reverse().join('-');
      }
  };

  const [Dates, setDates] = useState({
      from: modifyDate(''),
      to: modifyDate(''),
  });

  const updateDates = (e) => {
      const { name, value } = e.target;
      setDates({ ...Dates, [name]: value });
  };

  const fetchData = async() => {
    let data = {
        "from_date": Dates.from,
        "to_date": Dates.to
    }
    const response = await axios.post(`api/sr-search`, data);
    //console.log("response", response);
    const jsonData = response.data.sr_list;
    // const result =[];
    // jsonData.map((item, i) => {
    //     var obj = item;
    //     obj.serial_no = i+1;
    //     if(item.type_of_payment == "Token")
    //     {
    //         obj.payment_date  = item.payment_date_token;
    //         obj.total_paid  = item.token_amount;
    //         obj.taxable_amount = item.token_taxable_amount;
    //         obj.gst_amount = item.token_gst_amount;
    //         obj.voucher_no = item.voucher_num_token;
    //     }else{
    //         obj.payment_date  = item.payment_date_total;
    //         obj.total_paid  = item.rest_amount;
    //         obj.taxable_amount = item.rest_taxable_amount;
    //         obj.gst_amount = item.rest_gst_amount;
    //         obj.voucher_no = item.voucher_num_total;
    //     }
    //     result.push(obj);
    //     //console.log("result", result);
    // })


    //console.log("jsonData", jsonData);
    return jsonData;
  }

  const getAllService = async () => {
    // if (allservices?.[0]) {
    //   return;
    // }
    let sr_id = "";
    if(!Dates.from || !Date.to)
    {
      sr_id = search;
    }

    if(!Dates.from && !Date.to && sr_id == "")
    {
      alert("Please enter SR id or date to search");
      return;
    }

    setLoading(true);
    try {
      let data1 = {
        "from_date": Dates.from,
        "to_date": Dates.to,
        "sr_id": search
      }
      const res = await axios.post(`api/sr-search`, data1);
      dispatch(
        setSrReports({
          data: res.data.sr_list,
        })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      errorToast(error)
    }
  };

  const onRefresh = () => {
    //dispatch(deleteServicesSlice());
  };

  const getRowData = (data, index) => {
    if (!data) {
      return [];
    }
    return [index + 1, data.sr_id, data.client_name, data.sr_date, data.first_payment_date, data.sr_status]
  }

  // const ActionBtnsElement = ({ data }) => {
  //   return (
  //     <div className="flex gap-3">
  //       <ActionBtn tooltip='Edit service' onClick={() => navigation(`/admin/services/editService/${data?.service_id}`)} >
  //         <FiEdit size={15} className=" text-white" />
  //       </ActionBtn>
  //       <ActionBtn loading={deleting &&
  //         currentSelection.id === data?.service_id} tooltip='Delete service' onClick={() => {
  //           setCurrentSelection({ id: data.service_id });
  //           deleteService(`${data.service_id}`);
  //         }} >
  //         <AiOutlineDelete
  //           size={15}
  //           className=" text-white"
  //         />
  //       </ActionBtn>
  //     </div>
  //   )
  // }

  useEffect(() => {
    if (!allservices) {
      console.log('loaded service');
      getAllService();
    }
  }, [allservices]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">SR Reports</h1>
          {/* <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} /> */}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <CustomInput
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SR ID"
            />
          </div>  
          <div className="flex items-center gap-2">
              <span>From</span>
              <CustomInput
                  type="date"
                  value={Dates.from}
                  name="from"
                  onChange={updateDates}
              />
          </div>
          <div className="flex items-center gap-2">
              <span>To</span>
              <CustomInput
                  type="date"
                  name="to"
                  value={Dates.to}
                  onChange={updateDates}
              />
          </div>
          <CustomBtn onClick={() => getAllService()} >
            Search
          </CustomBtn>
          <TableToExcelApi
              fetchData={fetchData}
              fileName="Sr Search Data"
              keys={['sr_id','client_id','client_name','particulars_of_work','sr_date','first_payment_date','sr_status']}
              headerNames={{
                  'sr_id': 'SR ID',
                  'client_id': 'Client ID',
                  'client_name': 'Client name',
                  'particulars_of_work': 'Particulars of Works',
                  'sr_date': 'SR Date',
                  'first_payment_date': 'First Payment Date',
                  'sr_status': 'SR Status'
              }}
          />
          
          {/* {HeaderRightContainer && typeof ActionBtnsElement === "function" &&
              <HeaderRightContainer />
          } */}
      </div>
      </div>

      <CustomTables.Table
        loading={loading}
        noDataMessage='No Reports Found ⚠️'
        TABLE_HEADINGS={TABLE_HEADINGS}
        DATA={allservices}
        ROW_DATA={getRowData}
        //ActionBtnsElement={ActionBtnsElement}
      />

      {categoryModal && (
        <ServiceCategoriesModal toggleCategoryModal={toggleCategoryModal} />
      )}
    </div>
  );
};

export default AdminServices;
