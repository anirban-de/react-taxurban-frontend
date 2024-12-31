import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomBtn, CustomInput, CustomPagination, InlineLoader } from '../../components';
import { FiDownload, FiRefreshCcw } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';
import { clearCache } from '../../redux/cacheSlice';
import { useDispatch } from 'react-redux';
import loadable from '@loadable/component';
import useAwsS3 from '../../hooks/useAwsS3';

const ActionBtn = loadable(() => import('../../components/shared/ActionBtn'));

const DateView = ({ Dates, updateDates, getCommisionByDate }) => {
  return (
    <div className="flex items-center gap-3 p-2">
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
      <CustomBtn type="button" onClick={getCommisionByDate} >Go</CustomBtn>
    </div>
  );
};

/*const TABLE_HEADIND = [
  'SN',
  'SR ID',
  'BR Code',
  'SR Amount',
  'Gross Amount',
  'TDS Deduction',
  'Net Payable',
];*/

const STATUS = ['pending', 'completed'];
const COMMISSION_BASE_URL = 'api/branch-specific-commission';

const BranchCommision = () => {
  const dispatch = useDispatch();
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
  const { downloadFromS3, isFileDownloading } = useAwsS3();
  const { data, loading, getData, clearData } = useFetch({
    uid: 'admin-commissions',
    url: fetchUrl,
    method: 'GET',
    mount: false,
  });
  const pageCount = Math.ceil(parseInt(data?.countcommission) / 10);

    const [TABLE_HEADIND, setTABLE_HEADIND] = useState([
      'SN',
      'SR ID',
      'BR Code',
      'SR Amount',
      'Gross Amount',
      'TDS Deduction',
      'Net Payable',
    ]);

  const onRefresh = () => {
    dispatch(clearCache({ uid: 'admin-commissions' }));
    clearData();
    setActiveBranchId('');
    setActiveStatus(STATUS[0]);
    setDates({ from: '', to: new Date().toJSON().slice(0, 10) });
    setFetchUrl(`${COMMISSION_BASE_URL}/${activeStatus}/0`);
  };

  const setDyanamicFetchUrl = (status, page = 0) => {
    if (Dates.from !== '') {
      setFetchUrl(
        `${COMMISSION_BASE_URL}/${status}/${page}/${Dates.from}/${Dates.to}`
      );
      return;
    }
    setFetchUrl(`${COMMISSION_BASE_URL}/${status}/${page}`);
  };

  const onPageChange = (page) => {
    setDyanamicFetchUrl(activeStatus, page);
  };

  const onActiveStatusChange = (currentStatus) => {
    setActiveStatus(currentStatus);
    setDyanamicFetchUrl(currentStatus, 0);

    //added by anirban
    if(currentStatus == 'completed'){
        setTABLE_HEADIND((prev) => [...prev,'Action']);
    }else if(currentStatus == 'pending'){
        TABLE_HEADIND.splice(7,1);
        setTABLE_HEADIND(TABLE_HEADIND);
    }
  };

  const getCommisionByDate = () => {
    setDyanamicFetchUrl(activeStatus, 0);
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

  useEffect(() => {
    getData().then(() => {
      setMount(true);
    });
  }, []);

  useEffect(() => {
    if (mount) {
      getData();
    }
  }, [fetchUrl]);

  return (
    <div>
      <div className="flex flex-1 justify-between items-center bg-white px-3 py-1 rounded-md ">
        <div className="flex gap-3 items-center">
          <h1 className="font-semibold md:text-lg">All Commission</h1>
          <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
        </div>

        <DateView
          Dates={Dates}
          updateDates={updateDates}
          getCommisionByDate={getCommisionByDate}
        />
      </div>

      <div className="flex gap-3 my-4">
        {STATUS.map((status, index) => (
          <span
            className={`cursor-pointer px-3 py-1 rounded-md ${activeStatus === status
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

      {loading && <InlineLoader loadingText={'Commission'} />}

      {data?.all_commission?.length === 0 && !loading && (
        <p className="mt-4">No {activeStatus} Commission found ⚠️</p>
      )}

      {data?.all_commission?.length > 0 && (
        <div className="overflow-x-auto relative my-5">
          <table className="w-full text-xs md:text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className=" text-xs uppercase text-white  bg-green-400 ">
              <tr>
                {TABLE_HEADIND.map((tableHeading, index) => (
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

                  {(activeStatus == 'completed') && (
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
    </div>
  );
};

export default BranchCommision;
