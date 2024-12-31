import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ServiceCategoriesModal from '../Modals/ServiceCategoriesModal';
import { useDispatch, useSelector } from 'react-redux';
import { setInvoiceReports } from '../../../redux/InvoiceReportSlice';
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
  'Balance'
];

const AdminServices = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const activepage = 0;

  const allservices = useSelector((state) => state.invoicereport.report);
  //console.log("", allservices);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const toggleCategoryModal = () => setCategoryModal(!categoryModal);
  const [searchType, setSearchType] = useState('Receipt-Vouchers');
  const [headerKeys, setHeaderKeys] = useState(['serial_no','sr_id','client_id','client_name','gst','statecode','receipt_num','receipt_date','gst_amount','receipt_taxable_amount','cgst','sgst','igst','receipt_amount','agreed_service_charge','type_of_payment','balance','receipt_paid_by']);
  const [headerNames, setHeaderNames] = useState({
    'serial_no': 'Sl. No',
    'sr_id': 'SR ID',
    'client_id': 'Client ID',
    'client_name': 'Client name',
    'gst': 'GST No',
    'statecode': 'State Code',
    'receipt_num': 'Receipt No',
    'receipt_date': 'Receipt Date',
    'gst_amount': 'GST Rate',
    'receipt_taxable_amount': 'Taxable Value',
    'cgst': 'CGST',
    'sgst': 'SGST',
    'igst': 'IGST',
    'receipt_amount': 'Total',
    'agreed_service_charge': 'Agreed Service Charges',
    'type_of_payment': 'Types of payment',
    'balance': 'Balance',
    'receipt_paid_by': 'Paid by'
  });

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

  const setSearchTypeFunction = function(value){
    setSearchType(value);
    if(value == "Receipt-Vouchers")
    {
      setHeaderKeys(['serial_no','sr_id','client_id','client_name','gst','statecode','receipt_num','receipt_date','gst_amount','receipt_taxable_amount','cgst','sgst','igst','receipt_amount','agreed_service_charge','type_of_payment','balance','receipt_paid_by']);
      setHeaderNames({
          'serial_no': 'Sl. No',
          'sr_id': 'SR ID',
          'client_id': 'Client ID',
          'client_name': 'Client name',
          'gst': 'GST No',
          'statecode': 'State Code',
          'receipt_num': 'Receipt No',
          'receipt_date': 'Receipt Date',
          'gst_amount': 'GST Rate',
          'receipt_taxable_amount': 'Taxable Value',
          'cgst': 'CGST',
          'sgst': 'SGST',
          'igst': 'IGST',
          'receipt_amount': 'Total',
          'agreed_service_charge': 'Agreed Service Charges',
          'type_of_payment': 'Types of payment',
          'balance': 'Balance',
          'receipt_paid_by': 'Paid by'
      });
    }else{
        setHeaderKeys(['serial_no','sr_id','client_id','client_name','gst','invoice_date','invoice_num','particulars_of_work','statecode','hsn','quantity','unit','gst_amount','taxable_amount','cgst','sgst','igst','final','balance']);
        setHeaderNames({
            'serial_no': 'Sl. No',
            'sr_id': 'SR ID',
            'client_id': 'Client ID',
            'client_name': 'Client name',
            'gst': 'GST No',
            'invoice_date': 'Invoice Date',
            'invoice_num': 'Invoice No',
            'particulars_of_work': 'Particulars of Works',
            'statecode': 'State Code',
            'hsn': 'HSN',
            'quantity': 'Quantity',
            'unit': 'UQC/Unit',
            'gst_amount': 'GST Rate',
            'taxable_amount': 'Taxable Value',
            'cgst': 'CGST',
            'sgst': 'SGST',
            'igst': 'IGST',
            'final': 'Total',
            'balance': 'Balance'
        });
    }
  }

  const fetchData = async() => {
    let post_data = {
        "from_date": Dates.from,
        "to_date": Dates.to,
        "searchtype": searchType
    }
    const response = await axios.post(`api/report-sr-search`, post_data);
    //console.log("response", response);
    const jsonData = response.data.sr_list;
    const result =[];
    jsonData.map((item, i) => {
        var obj = item;
        obj.serial_no = i+1;
        if(item.type_of_payment == "Token")
        { 
          obj.receipt_num = item.receipt_num_token;
          obj.receipt_date = item.receipt_date_token;
          obj.receipt_taxable_amount = item.token_taxable_amount;
          obj.receipt_amount = item.token_amount;
          obj.receipt_paid_by = item.paid_by_token;
        }else{
          obj.receipt_num = item.receipt_num_total;
          obj.receipt_date = item.receipt_date_total;
          obj.receipt_taxable_amount = item.rest_taxable_amount;
          obj.receipt_amount = item.rest_amount;
          obj.receipt_paid_by = item.paid_by_total;
        }
        const keysToRemove = ['receipt_num_token', 'receipt_date_token', 'token_taxable_amount', 'token_amount', 'paid_by_token', 'receipt_num_total', 'receipt_date_total', 'rest_taxable_amount', 'rest_amount', 'paid_by_total'];

        const newObj = Object.keys(obj).reduce((acc, key) => {
          if (!keysToRemove.includes(key)) {
            acc[key] = obj[key];
          }
          return acc;
        }, {}); 
        result.push(newObj);
        //console.log("result", result);
    })


    //console.log("jsonData", jsonData);
    return jsonData;
  }

  const getAllService = async () => {
    // if (allservices?.[0]) {
    //   return;
    // }
    // let sr_id = "";
    // if(!Dates.from || !Date.to)
    // {
    //   sr_id = searchType;
    // }

    // if(!Dates.from && !Date.to && sr_id == "")
    // {
    //   alert("Please enter SR id or date to search");
    //   return;
    // }

    setLoading(true);
    try {
      let data1 = {
        "from_date": Dates.from,
        "to_date": Dates.to,
        "searchtype": searchType
      }
      const res = await axios.post(`api/report-sr-search`, data1);
      dispatch(
        setInvoiceReports({
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
    return [index + 1, data?.sr_id, data?.client_name, data?.balance]
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
      //console.log('loaded service');
      getAllService();
    }
  }, [allservices]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">Voucher & Invoice Reports</h1>
          {/* <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} /> */}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <select
                className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg block w-fit pr-10 p-2.5"
                onChange={(e) => setSearchTypeFunction(e.target.value)}
            >
                <option value="Receipt-Vouchers">Receipt Vouchers</option>
                <option value="Invoice-Generated">Invoice Generated</option>
            </select>
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
            //   fileName="Receipt voucher report"
                fileName={searchType === 'Receipt-Vouchers' ? 'Receipt voucher report' : 'Invoice Generated Report'}
              keys={headerKeys}
              headerNames={headerNames}
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