import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../CustomBtn';
import CustomInput from '../CustomInput';
import { toast } from 'react-toastify';
import { setBranchActivationAmount } from '../../../redux/AccountSlice';
import { errorToast } from '../../../utils';
import InlineLoader from '../InlineLoader';

const AdminSettings = () => {
    const account = useSelector((state) => state?.account);
    const dispatch = useDispatch();
    const [activationAmount, setActivationAmount] = React.useState(account?.branch_activation_amount);
    const [loading, setLoading] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const getSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`api/admin/account`)
            if (res.data.status === 200) {
                setActivationAmount(res?.data?.setting.branch_activation_amount);
                dispatch(
                    setBranchActivationAmount(
                        res?.data?.setting.branch_activation_amount
                    )
                );
            }
        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false);
        }
    };

    const submitSettings = async () => {

        if (activationAmount === '' || null || undefined) {
            errorToast('Please enter activation amount');
            return;
        }

        const data = {
            branch_activation_amount: activationAmount,
        };

        try {
            setSubmitting(true);
            const res = await axios.post(`api/admin/save-settings`, data)
            if (res.data.status === 200) {
                dispatch(setBranchActivationAmount(activationAmount));
                toast.success(res.data.message);
            }
        } catch (error) {
            errorToast(error)
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        getSettings();
    }, []);

    return (
        <div className="bg-white p-6 rounded-md">
            {loading && <InlineLoader loadingText={`Loading Settings`} />}

            {!loading &&
                <div className="flex justify-center items-end gap-3 ">
                    <CustomInput
                        placeholder={`Branch Activation Amount`}
                        label={`Branch Activation Amount`}
                        value={activationAmount}
                        name="branch_activation_amount"
                        onChange={(e) => setActivationAmount(e.target.value)}
                    />
                    <CustomBtn loading={submitting} onClick={submitSettings} >Save</CustomBtn>
                </div>
            }
        </div>
    )
}

export default AdminSettings