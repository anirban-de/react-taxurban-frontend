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
  'Payment Date',
  'Ref No',
  'Particulars',
  'Branch ID',
  'Amount',
  'Payment done by',
  'Remarks or Details'
];

const AdminServices = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const activepage = 0;

  const allservices = useSelector((state) => state.srreport.report);
  //console.log("", allservices);
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
    let post_data = {
      "from_date": Dates.from,
      "to_date": Dates.to
    }
    const response = await axios.post(`api/branch-received-voucher-search`, post_data);
    //console.log("response", response);
    const jsonData = response.data.wl_list;
    const result =[];
    jsonData.map((item, i) => {
        var obj = item;
        obj.serial_no = i+1;
        result.push(obj);
        //console.log("result", result);
    })


    //console.log("jsonData", jsonData);
    return jsonData;
  }

  const getAllService = async () => {
    // if (allservices?.[0]) {
    //   return;
    // }
    let sr_id = "";

    setLoading(true);
    try {
      let data1 = {
        "from_date": Dates.from,
        "to_date": Dates.to
      }
      const res = await axios.post(`api/branch-received-voucher-search`, data1);
      dispatch(
        setSrReports({
          data: res.data.wl_list,
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
    return [index + 1, data?.payment_date, data?.ref_no, data?.particulars, data?.branch_id, data?.amount, data?.payment_done_by, data?.remarks]
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
    getAllService();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">Branch Received Voucher</h1>
          {/* <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} /> */}
        </div>

        <div className="flex items-center gap-3">
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
              fileName="Branch Received Voucher"
              keys={['serial_no','payment_date','ref_no','particulars','branch_id','amount','payment_done_by','remarks']}
              headerNames={{
                  'serial_no': 'Sl. No',
                  'payment_date': 'Payment Date',
                  'ref_no': 'Ref No',
                  'particulars': 'Particulars',
                  'branch_id': 'Branch ID',
                  'amount': 'Amount',
                  'payment_done_by': 'Payment Done By',
                  'remarks': 'Remarks'
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