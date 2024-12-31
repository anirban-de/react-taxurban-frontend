import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import CustomTables from './CustomTables';
import { CustomBtn } from '../../components';
import CustomPagination from './CustomPagination';
//import { SR_MODES } from '../../utils/config';
import { FiRefreshCcw } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../config';
import CustomInput from './CustomInput';
import TableToExcelApi from '../shared/TableToExcelApi';

let allData = [];

let searchFlag = 0;

let SR_MODES = [
    'Verification',
    'Accepted',
    'Processing',
    'Completed',
    'Closed',
    'Pending',
    'Rejected',
];

const SRComponent = ({ ActionBtnsElement, TABLE_HEADINGS, HeaderRightContainer }) => {
    const queryClient = useQueryClient();
    const user = useSelector((state) => state?.auth);
    const { mode, page } = useParams();
    const activeMode = mode || SR_MODES[0];
    const currentPage = parseInt(page) || 1;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if(user.role == 4 || user.role == 5)
        {
            SR_MODES = [
                'Processing',
                'Completed',
                'Closed',
                'Pending',
                'Rejected',
            ];
        }else{
            SR_MODES = [
                'Verification',
                'Accepted',
                'Processing',
                'Completed',
                'Closed',
                'Pending',
                'Rejected',
            ];
        }
    }, [user?.role])

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

    const getSRData = async () => {
        const response = await axios.get(`api/get-all-sr/${activeMode}?page=${currentPage}`)
        searchFlag = 0;
        return response.data;
    }

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['SR', activeMode, currentPage],
        queryFn: getSRData,
        staleTime: 10 * 1000
    })

    const searchData = async () => {
        try {
            if(search == "")
            {
                const response = await axios.get(`api/sr-search/${activeMode}?from_date=${Dates.from}&to_date=${Dates.to}`);
                allData = response.data;
            }else{
                const response = await axios.get(`api/sr-search/${activeMode}?sr_id=${search}`);
                allData = response.data;
            }
            //console.log("response", response.data);
            
            searchFlag = 1;
            // Optional: trigger a re-render
            setDates({ ...Dates }); // Update state to force re-render
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    }


    const onActiveModeChange = (currentMode) => {
        navigate(`${ROUTES[user.role]}/service-request/${currentMode}/1`);
    };

    const onPageChange = (page) => {
        navigate(`${ROUTES[user.role]}/service-request/${activeMode}/${page}`);
    }

    const getRowData = (data, index) => {
        if (!data) {
            return [];
        }
        if(user.role == 1)
            return [index + 1, data[4], data[5], data[2], data[14], data[13], new Date(data[3]).toDateString(), data[15] != null ? new Date(data[15]).toDateString() : '', data[12]]
        else
            return [index + 1, data[4], data[5], data[2], new Date(data[3]).toDateString(), data[12]]

    }

    const getSearchRowData = (data, index) => {
        if (!data) {
            return [];
        }
        return [index+1, data[1], data[5], data[7], new Date(data[2]).toDateString(), data[3]]
    }

    const onRefresh = () => {
        queryClient.removeQueries(['SR']);
        refetch();
    }

    const fetchData = async() => {
        let data = {
            "from_date": Dates.from,
            "to_date": Dates.to
        }
        const response = await axios.post(`api/sr-search`, data);
        //console.log("response", response);
        const jsonData = response.data.sr_list;
        const result =[];
        jsonData.map((item, i) => {
            var obj = item;
            obj.serial_no = i+1;
            if(item.type_of_payment == "Token")
            {
                obj.payment_date  = item.payment_date_token;
                obj.total_paid  = item.token_amount;
                obj.taxable_amount = item.token_taxable_amount;
                obj.gst_amount = item.token_gst_amount;
                obj.voucher_no = item.voucher_num_token;
            }else{
                obj.payment_date  = item.payment_date_total;
                obj.total_paid  = item.rest_amount;
                obj.taxable_amount = item.rest_taxable_amount;
                obj.gst_amount = item.rest_gst_amount;
                obj.voucher_no = item.voucher_num_total;
            }
            result.push(obj);
            //console.log("result", result);
        })


        //console.log("jsonData", jsonData);
        return jsonData;
    }

    if (error) {
        return <div>{error.message}</div>
    }


    return (
        <>
            <div className="flex justify-between items-start">
                <div className="flex items-start flex-col">
                    <h1 className="font-semibold md:text-lg">All Service Requests</h1>
                    <FiRefreshCcw className="cursor-pointer" onClick={onRefresh} />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <CustomInput
                        type="text"
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search SR"
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
                    <div>
                        <CustomBtn
                        onClick={() => searchData()}
                        >
                        {user.role == 2? 'Search SR to Pay': 'Search SR'}
                        </CustomBtn>
                    </div>
                    {/* <TableToExcelApi
                        fetchData={fetchData}
                        fileName="Sr Search Data"
                        keys={['serial_no','sr_id','client_id','client_name','gst_no','invoice_date','invoice_number','particulars_of_work','hsn','qnty','payment_date','type_of_payment','total_paid','taxable_amount','gst_amount','total_amount','balance','voucher_no']}
                        headerNames={{
                            'serial_no': 'Sl. No',
                            'sr_id': 'SR ID',
                            'client_id': 'Client ID',
                            'client_name': 'Client name',
                            'gst_no': 'GST No',
                            'invoice_date': 'Invoice Date',
                            'invoice_number': 'Invoice No',
                            'particulars_of_work': 'Particulars of Works',
                            'hsn': 'HSN',
                            'qnty': 'Qnty',
                            'payment_date': 'Payment Date',
                            'type_of_payment': 'Type of Payment',
                            'total_paid': 'Total Paid',
                            'taxable_amount': 'Taxable Amount',
                            'gst_amount': 'GST',
                            'total_amount': 'Total Amount',
                            'balance': 'Balance',
                            'voucher_no': 'Voucher No'
                        }}
                    /> */}
                    {HeaderRightContainer && typeof ActionBtnsElement === "function" &&
                        <HeaderRightContainer />
                    }
                </div>
            </div><br></br>
            <CustomTables.Modes MODES={SR_MODES} activeMode={activeMode} setActiveMode={onActiveModeChange} />
            {searchFlag == 0 && (
                <div className='overflow-auto'>
                    <CustomTables.Table
                        activeMode={activeMode}
                        loading={isLoading}
                        noDataMessage='No Service Request Found ⚠️'
                        loadingMessage={`${activeMode} SR's`}
                        DATA={data?.allsr}
                        ROW_DATA={getRowData}
                        TABLE_HEADINGS={TABLE_HEADINGS}
                        ActionBtnsElement={ActionBtnsElement}
                    />
                </div>
            )}
            {searchFlag == 1 && (
                <div className='overflow-auto'>
                    <CustomTables.Table
                        activeMode={activeMode}
                        loading={isLoading}
                        noDataMessage='No Service Request Found ⚠️'
                        loadingMessage={`${activeMode} SR's`}
                        DATA={allData?.allsr}
                        ROW_DATA={getSearchRowData}
                        TABLE_HEADINGS={TABLE_HEADINGS}
                        ActionBtnsElement={ActionBtnsElement}
                    />
                </div>
            )}
            {
                data?.paginatedata?.last_page > 1 &&
                <CustomPagination total={data?.paginatedata?.last_page} currentPage={currentPage} onPageChange={onPageChange} />
            }
        </>
    )
}

export default SRComponent