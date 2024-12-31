import { useQuery } from '@tanstack/react-query';
import React from 'react'
import CustomInput from '../CustomInput';
import axios from 'axios';
import InlineLoader from '../InlineLoader';

const getBranchInfo = async () => {
    const response = await axios.get('api/branch/get-branch-info')
    return response.data;
}

const BranchDetails = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['branchDetails'],
        queryFn: getBranchInfo,
        staleTime: 30 * 1000
    })

    return (
        <div className="bg-white p-6 rounded-md">
            <h1 className="font-semibold md:text-lg">General Information</h1>
            <hr className="my-3" />

            {isLoading && <InlineLoader loadingText={`Loading Branch Details`} />}

            {!isLoading && (
                <div className="grid grid-cols-3 gap-3">
                    {/* info area  */}
                    <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-4">
                            <CustomInput 
                                value={data?.user?.name} 
                                label={'Branch Name'} 
                            />
                            <CustomInput 
                                value={data?.branch?.branch_code} 
                                label={'Branch Code'} 
                            />
                            <CustomInput
                                value={data?.branch?.business_name}
                                label={'Business Name'}
                            />
                            <CustomInput
                                value={data?.branch?.applicant_name}
                                label={'Applicants Name'}
                            />
                            <CustomInput
                                label={'Fathers Name'}
                                value={data?.branch?.fathers_name}
                            />
                            <CustomInput label={'Date of Birth'} value={data?.branch?.dob} />
                            <CustomInput
                                value={data?.branch?.pan_number}
                                label={'PAN Card'}
                            />
                            <CustomInput
                                value={data?.branch?.aadhar_number}
                                label={'Aadhar of Applicant'}
                            />
                            <CustomInput
                                value={data?.branch?.constitution}
                                label={'Constitution of Business'}
                            />
                            <CustomInput
                                label={'Qualification'}
                                value={data?.branch?.qualification}
                            />
                            <CustomInput label={'Email'} value={data?.user?.email} />
                            <CustomInput
                                label={'Mobile No'}
                                value={data?.branch?.mobile_no}
                            />
                            <CustomInput
                                value={data?.branch?.alternative_mobile_no}
                                label={'AlterNative Mobile No'}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BranchDetails