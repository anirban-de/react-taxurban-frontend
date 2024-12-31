import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import CustomBtn from '../shared/CustomBtn'
import CustomInput from '../shared/CustomInput'
import useAwsS3 from '../../hooks/useAwsS3'
import { toast } from 'react-toastify'
import axios from 'axios'
import { uploadFolders } from '../../utils/uploadFolders'
import { pickDocument } from '../../utils/pickDocument'
import { errorToast } from '../../utils'

const TABLE_HEADIND = ['Sl no.', 'SR ID', "Gross Amount", "tds deduction", 'Amount']

const MODES = ['Payment Details', 'Commission Details']

const PayCommisionModal = ({ showModal, refresh, commissionData, activeBranchData, toggleModal }) => {
    const totalAmount = Object.values(commissionData).reduce((acc, curr) => acc + parseFloat(curr.net_commission), 0.0)
    const [mode, setMode] = useState(MODES[1]);
    const { uploadToS3, uploading } = useAwsS3();
    const [submitting, setSubmitting] = useState(false);
    const [reciptUrl, setReciptUrl] = useState('');

    const uploadRecipt = (e) => {
        e.preventDefault();
        const file = pickDocument(e);
        if (file === null) {
            return;
        }
        uploadToS3(file, `${uploadFolders.UserFiles.branch}/Recipts/${activeBranchData.branch_code}`)
            .then((res) => {
                setReciptUrl(res?.url);
            })
    }

    const markComissionsAsPaid = async (e) => {
        e.preventDefault();

        if (reciptUrl === '') {
            toast.info('Please upload payment recipt')
            return;
        }

        try {
            setSubmitting(true);
            const Commissions = Object.keys(commissionData).map(((key) => parseInt(key)))

            const data = {
                comm_ids: Commissions,
                container_path: `${uploadFolders.UserFiles.branch}/Recipts/${activeBranchData.branch_code}`,
                invoice_img: reciptUrl,
            }

            const res = await axios.post('api/make-commission-pay', data);

            if (res.data.status === 200) {
                toggleModal()
                refresh()
                toast.success(res.data.message || 'Commissions marked as paid')
            }

            if (res.data.status === 400) {
                errorToast(res.data.message)
            }

        } catch (error) {
            errorToast(error)
        } finally {
            setSubmitting(false);
        }

    }

    return (
        <div className="overflow-hidden fixed z-30 left-0 right-0 top-0 bottom-0  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
            {mode === MODES[1] &&
                <div
                    className="bg-gray-100 min-w-[50%] w-fit p-5 flex flex-col gap-4  rounded-lg overflow-auto"
                    style={{ maxHeight: '90vh' }}
                >
                    <div className='flex items-center justify-between'>
                        <p className='font-semibold text-base'>Commission payment details</p>
                        <FiX size={20} onClick={toggleModal} className='cursor-pointer' />
                    </div>
                    <div className='flex gap-3'>
                        <p>Branch code : {activeBranchData.branch_code}</p>
                        <p>Branch Name : {activeBranchData.branch_name}</p>
                    </div>
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
                            {Object.entries(commissionData).map(([key, value], index) => (
                                <tr className="bg-white border-b ">
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium  whitespace-nowrap dark:text-white"
                                    >{index + 1}</td>
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium  whitespace-nowrap dark:text-white"
                                    >{value.sr_request}</td>
                                    <td className="py-4 px-6">
                                        {`₹ ${value.gross_commission}`}
                                        <br />({`${value.cat_commission} %`})
                                    </td>
                                    <td className="py-4 px-6">
                                        {`₹ ${value.tds_deduction}`}
                                        <br />({`${value.tds_percent} %`})
                                    </td>
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium  whitespace-nowrap dark:text-white"
                                    >₹ {value.net_commission}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='bg-white flex items-center justify-between p-3'>
                        <div>
                            <p className=' text-gray-500'> Grand Total : ₹ {totalAmount} </p>
                            <p className='cursor-pointer underline text-green-400' onClick={() => setMode(MODES[0])}>Branch Bank Details</p>
                        </div>
                        <form className='flex items-center gap-3' onSubmit={markComissionsAsPaid}>
                            <input
                                disabled={uploading}
                                required
                                placeholder='Upload payment recipt'
                                onChange={uploadRecipt}
                                name="recipt"
                                type="file"
                                accept='image/*,.pdf'
                                className="block w-full text-xs md:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                            />
                            {reciptUrl !== '' &&
                                <CustomBtn type="submit" loading={submitting || uploading} >Submit </CustomBtn>
                            }
                        </form>
                    </div>
                </div>
            }
            {mode === MODES[0] &&
                <div
                    className="bg-gray-100 min-w-[30%] w-fit p-5 flex flex-col gap-4  rounded-lg overflow-auto"
                    style={{ maxHeight: '90vh' }}
                >
                    <div className='flex items-center justify-between'>
                        <p className='font-semibold text-base'>Branch Pay Details</p>
                        <FiX size={20} onClick={() => setMode(MODES[1])} className='cursor-pointer' />
                    </div>
                    <div className="bg-white p-3 rounded-md gap-3 flex flex-col">
                        <CustomInput
                            disabled
                            value={activeBranchData?.bank_name}
                            placeholder="ex : State bank of India"
                            name="bankName"
                            label={'Bank Name'}
                        />
                        <CustomInput
                            disabled
                            value={activeBranchData?.branch_name}
                            placeholder="ex : Durgapur"
                            name="branchName"
                            label={'Branch Name'}
                        />
                        <CustomInput
                            disabled
                            label={'IFSC'}
                            placeholder="ex : FGBS132S"
                            required
                            value={activeBranchData?.ifsc_code}
                            name="ifsc"
                        />
                        <CustomInput
                            disabled
                            placeholder="ex : 128678123612876123867"
                            label={'Bank Account No.'}
                            value={activeBranchData?.account_number}
                            name="bankAcNumber"
                        />
                        <CustomInput
                            disabled
                            placeholder="ex : John Doe"
                            label={'Account Name *'}
                            value={activeBranchData?.account_holder_name}
                            name="accountName"
                        />
                    </div>
                </div>
            }
        </div >
    )
}

export default PayCommisionModal