import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CustomBtn,
  CustomInput,
  CustomPagination,
  CustomSelect,
  InlineLoader,
} from '../../../components';
import { FiDownload, FiRefreshCcw } from 'react-icons/fi';
import useFetch from '../../../hooks/useFetch';
import { clearCache } from '../../../redux/cacheSlice';
import { useDispatch } from 'react-redux';
import PayCommisionModal from '../../../components/Modals/PayCommisionModal';
import TableToExcel from '../../../components/shared/TableToExcel';
import useAwsS3 from '../../../hooks/useAwsS3';
import loadable from '@loadable/component';

const ActionBtn = loadable(() => import('../../../components/shared/ActionBtn'));

const BranchSelectView = ({
  activeBranchId,
  setActiveBranchId,
  onSelectChange,
}) => {
  const { data: branches } = useFetch({
    url: 'api/all-branch/Approved',
    method: 'get',
  });

  const optionList =
    branches?.allbranch?.map((branch) => ({
      value: branch.user_id,
      name: `1. ${branch.name}, 2. ${branch.business_name}`,
    })) || [];

  return (
    <div className="w-full flex items-center gap-3">
      <CustomSelect
        style={{ paddingRight: '30px' }}
        value={activeBranchId}
        onChange={(e) => {
          setActiveBranchId(e.target.value);
          onSelectChange(e.target.value, branches);
        }}
        defaultOption={'Select a branch'}
        className="w-52"
        options={optionList}
      />
    </div>
  );
};

const DateView = ({ Dates, updateDates, getCommisionByDate }) => {
  return (
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
      {Dates.from !== '' && (
        <div
          onClick={() => updateDates('reset')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <p>Reset</p>
          <FiRefreshCcw />
        </div>
      )}
      <CustomBtn onClick={getCommisionByDate} >Go</CustomBtn>
    </div>
  );
};

const FILTER_MODES = ['All', 'Branch'];

const TABLE_HEADIND_PENDING_ALL = [
  'Sl no.',
  'SR ID',
  'BR Code',
  'SR Amount',
  'Gross Amount',
  'TDS Deduction',
  'Net Payable',
  'Created Date'
];

const TABLE_HEADIND_PENDING = [
  "Select",
  'Sl no.',
  'SR ID',
  'BR Code',
  'SR Amount',
  'Gross Amount',
  'TDS Deduction',
  'Net Payable',
  'Created Date'
];

const TABLE_HEADIND_COMPLETED = [
  'Sl no.',
  'SR ID',
  'BR Code',
  'SR Amount',
  'Gross Amount',
  'TDS Deduction',
  'Net Payable',
  'Created Date',
  'Action',
];

const STATUS = ['pending', 'completed', 'closed'];
const COMMISSION_BASE_URL = 'api/branch-all-commission';

const all_commission = [
  {
      "id": 2,
      "branch_id": 136,
      "branch_code": "AS-24-00000136",
      "customer_id": 137,
      "sr_id": 8,
      "sr_request": "SR1204240000002",
      "sr_cat": 1,
      "sr_amount": "500.00",
      "cat_commission": "15.00",
      "gross_commission": "75.00",
      "tds_percent": "5.00",
      "tds_deduction": "3.75",
      "net_commission": "71.25",
      "paymentstatus": "Pending",
      "invoice_link": null,
      "doc_link": null,
      "payment_date": null,
      "created_at": "2024-04-14T16:10:11.000000Z",
      "updated_at": "2024-04-14T16:10:11.000000Z"
  },
  {
      "id": 1,
      "branch_id": 136,
      "branch_code": "AS-24-00000136",
      "customer_id": 137,
      "sr_id": 5,
      "sr_request": "SR1104240000001",
      "sr_cat": 1,
      "sr_amount": "1000.00",
      "cat_commission": "15.00",
      "gross_commission": "150.00",
      "tds_percent": "5.00",
      "tds_deduction": "7.50",
      "net_commission": "142.50",
      "paymentstatus": "Pending",
      "invoice_link": null,
      "doc_link": null,
      "payment_date": null,
      "created_at": "2024-04-14T16:02:56.000000Z",
      "updated_at": "2024-04-14T16:02:56.000000Z"
  }
]

const keysToInclude = ['sr_request', 'branch_code', 'sr_amount', 'net_commission', 'gross_commission', 'tds_deduction'];

const AdminCommission = () => {
  const dispatch = useDispatch();
  const [filterMode, setFilterMode] = useState(FILTER_MODES[0]);
  const [Dates, setDates] = useState({
    from: '',
    to: new Date().toJSON().slice(0, 10),
  });
  const [mount, setMount] = useState(false);
  const [activeStatus, setActiveStatus] = useState(STATUS[0]);
  const [fetchUrl, setFetchUrl] = useState(
    `${COMMISSION_BASE_URL}/${activeStatus}/0`
  );
  const [activeBranchId, setActiveBranchId] = useState(0);
  const [activeBranchData, setActiveBranchData] = useState(null);
  const [selectedCommisions, setSelectedCommisions] = useState({})
  const [showPayModal, setShowPayModal] = useState(false);
  const selectedCommisionsLength = Object.keys(selectedCommisions).length
  const { downloadFromS3, isFileDownloading } = useAwsS3();


  const { data, loading, getData, clearData } = useFetch({
    uid: 'admin-commissions',
    url: fetchUrl,
    method: 'GET',
    mount: false,
  });

  const pageCount = Math.ceil(parseInt(data?.countcommission) / 10);

  const onRefresh = () => {
    dispatch(clearCache({ uid: 'admin-commissions' }));
    clearData();
    setActiveBranchId('');
    setFilterMode(FILTER_MODES[0]);
    setActiveStatus(STATUS[0]);
    setFetchUrl(`${COMMISSION_BASE_URL}/${activeStatus}/0`);
  };

  const refreshOnPaid = () => {
    dispatch(clearCache({ uid: 'admin-commissions' }));
    clearData();
  }

  const setDyanamicFetchUrl = (status, page = 0, branch) => {
    if (filterMode === FILTER_MODES[0]) {
      if (Dates.from !== '') {
        setFetchUrl(
          `${COMMISSION_BASE_URL}/${status}/${page}/nobranch/${Dates.from}/${Dates.to}`
        );
        return;
      }
      setFetchUrl(`${COMMISSION_BASE_URL}/${status}/${page}`);
    }

    if (filterMode === FILTER_MODES[1]) {
      if (Dates.from !== '') {
        setFetchUrl(
          `${COMMISSION_BASE_URL}/${status}/${page}/${branch}/${Dates.from}/${Dates.to}`
        );
        return;
      }
      setFetchUrl(`${COMMISSION_BASE_URL}/${status}/${page}/${branch}`);
    }
  };

  const onBranchChange = (id, branches) => {
    console.log(id);
    setDyanamicFetchUrl(activeStatus, 0, id);
    const currentBranch = branches?.allbranch?.find(branch => branch.user_id == parseInt(id))
    setActiveBranchData(currentBranch)
  };

  const onPageChange = (page) => {
    setDyanamicFetchUrl(activeStatus, page, activeBranchId);
  };

  const onActiveStatusChange = (currentStatus) => {
    setActiveStatus(currentStatus);
    setDyanamicFetchUrl(currentStatus, 0, activeBranchId);
  };

  const getCommisionByDate = (e) => {
    setDyanamicFetchUrl(activeStatus, 0, activeBranchId);
  };

  const updateDates = (e) => {
    if (typeof e === 'string' && e === 'reset') {
      setDates({ from: '', to: new Date().toJSON().slice(0, 10) });
      setFetchUrl(`${COMMISSION_BASE_URL}/${activeStatus}/0`);
      return;
    }
    const { name, value } = e.target;
    setDates({ ...Dates, [name]: value });
  };

  const onSelectCommission = (e, data) => {
    const { name, checked } = e.target
    console.log(name, checked);

    if (checked) {
      setSelectedCommisions({ ...selectedCommisions, [name]: { ...data } })
    } else {
      let temp = { ...selectedCommisions };
      delete temp[name]
      setSelectedCommisions(temp)
    }

  }

  const selectionAvailable = activeStatus === STATUS[0] && filterMode === FILTER_MODES[1] && activeBranchId !== 0

  const FILTER_VIEWS = {
    All: null,
    Branch: (
      <BranchSelectView
        activeBranchId={activeBranchId}
        setActiveBranchId={setActiveBranchId}
        onSelectChange={onBranchChange}
      />
    ),
  };

  useEffect(() => {
    getData().then(() => {
      setMount(true);
    });
  }, []);

  useEffect(() => {
    if (mount) {
      setDyanamicFetchUrl(activeStatus, 0, activeBranchId);
    }
  }, [filterMode]);

  useEffect(() => {
    if (mount) {
      getData();
    }
  }, [fetchUrl]);

  return (
    <div>
      <div className="flex gap-3 items-center mb-4">
        <h1 className="font-semibold md:text-lg">All Commission</h1>
        <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
      </div>
      
      <div className="flex flex-1 justify-between items-center bg-white px-3 py-1 rounded-md ">
        <div className="flex gap-3 items-center">
          <h1 className="font-medium text-xs md:text-sm">Filter By: </h1>
          <select
            className=" mb-2bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg block w-fit pr-10 p-2.5"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
          >
            {FILTER_MODES.map((filterMode, index) => (
              <option key={index} value={filterMode}>
                {filterMode}
              </option>
            ))}
          </select>
          <div>{FILTER_VIEWS[filterMode]}</div>
        </div>

        <DateView
          Dates={Dates}
          updateDates={updateDates}
          getCommisionByDate={getCommisionByDate}
        />
      </div>

      <div className="flex justify-between items-center gap-3 my-4">
        <div className='flex items-center gap-3'>
          {STATUS.map((status, index) => (
            <span
              className={`cursor-pointer px-3 capitalize py-1 rounded-md ${activeStatus === status
                ? 'bg-green-400 text-white'
                : 'text-gray-500 bg-white '
                } `}
              key={index}
              onClick={() => onActiveStatusChange(status)}
            >
              {status}
            </span>
          ))}
        </div>
        <div className='flex items-center gap-3'>
          {selectedCommisionsLength > 0 && selectionAvailable &&
            <button
              onClick={() => setShowPayModal(true)}
              className={`cursor-pointer px-3 py-1 flex items-center rounded-md  bg-green-400 text-white`}
            >
              Pay for <p className='bg-white  text-xs w-4 h-4 mx-2 rounded-full text-center text-gray-800'>{selectedCommisionsLength}</p>
            </button>
          }
        </div>
        <TableToExcel
          data={data?.all_commission}
          keys={['sr_request','branch_code','sr_amount','gross_commission','tds_deduction','net_commission','paymentstatus','payment_date']}
          headerNames={{
            'sr_request': 'SR ID',
            'branch_code': 'Branch Code',
            'sr_amount': 'SR Amount',
            'gross_commission': 'Gross Amount',
            'tds_deduction': 'TDS Deduction',
            'net_commission': 'Net Payable',
            'paymentstatus': 'Payment Status',
            'payment_date': 'Payment Date'
          }}
          fileName="commissionData"
        />
      </div>

      {loading && <InlineLoader loadingText={'Commission'} />}

      {data?.all_commission?.length === 0 && !loading && (
        <p className="mt-4">No {activeStatus} Commission found ⚠️</p>
      )}

      {data?.all_commission?.length > 0 && (
        <div className="overflow-x-auto relative my-5">
          <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className=" text-xs uppercase text-white  bg-green-400 ">
              <tr>
                {(activeStatus === STATUS[0] ? selectionAvailable ? TABLE_HEADIND_PENDING : TABLE_HEADIND_PENDING_ALL : TABLE_HEADIND_COMPLETED).map((tableHeading, index) => (
                  <th scope="col" className="py-3 px-6" key={index}>
                    {tableHeading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.all_commission?.map((data, index) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={index}
                >
                  {selectionAvailable && (
                    <td
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <input checked={selectedCommisions?.[data.id] || false} name={data.id} onChange={(e) => onSelectCommission(e, data)} type='checkbox' />
                    </td>)
                  }
                  <td
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <Link to={`/admin/service-request/edit/${data.sr_id}`}>
                      {data.sr_request}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <Link to={`/admin/edit-branch/${data.branch_id}`}>
                      {data.branch_code}
                    </Link>
                  </td>
                  <td className="py-4 px-6">{`₹ ${data.sr_amount}`}</td>
                  <td className="py-4 px-6">
                    {`₹ ${data.gross_commission}`}
                    <br />({`${data.cat_commission} %`})
                  </td>
                  <td className="py-4 px-6">
                    {`₹ ${data.tds_deduction}`}
                    <br />({`${data.tds_percent} %`})
                  </td>
                  <td className="py-4 px-6">{`₹ ${data.net_commission}`}</td>
                  <td className="py-4 px-6">{new Date(data.created_at).toDateString()}</td>
                  {activeStatus === STATUS[1] && (
                    <td>
                      <div className='flex justify-center gap-3'>
                        <ActionBtn loading={isFileDownloading(`${data.doc_link}${index}`)} onClick={() => downloadFromS3(data.doc_link, index)} tooltip='Download Payment Recipt' >
                          <FiDownload className='text-white' />
                        </ActionBtn>
                        <ActionBtn loading={isFileDownloading(`${data.invoice_link}${index}`)} onClick={() => downloadFromS3(data.invoice_link, index)} tooltip='Branch Commission' >
                          <FiDownload className='text-white' />
                        </ActionBtn>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && pageCount > 1 && (
        <div className="flex justify-end mt-4 ">
          <CustomPagination total={pageCount} onPageChange={onPageChange} />
        </div>
      )}

      {showPayModal &&
        <PayCommisionModal showModal={showPayModal} refresh={refreshOnPaid} activeBranchData={activeBranchData} commissionData={selectedCommisions} toggleModal={() => setShowPayModal(!showPayModal)} />
      }
    </div>
  );
};

export default AdminCommission;
