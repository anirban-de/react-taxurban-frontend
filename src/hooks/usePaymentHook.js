import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useSearchParams, useLocation } from 'react-router-dom';
import { Swalwait, errorToast } from "../utils";

const usePaymentHook = ({ verifyApiUrl, callback }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const removeQueryParams = () => {
        const param = searchParams.get('encResponse');

        if (param) {
            searchParams.delete('encResponse');
            setSearchParams(searchParams);
        }
    };

    const makePayment = async ({ amount, mobile, name, email, extra = [] }) => {
        try {
            const reqBody = {
                payerName: name,
                payerEmail: email,
                payerMobile: mobile,
                amount: amount,
                redirect_to: window.location.href,
                deviceType: "web",
                udf_data: extra
            }

            const response = await axios.post("api/subpaisa-pay", reqBody);

            if (response.data.status === 200) {
                const FromElement = document.createElement('form');
                FromElement.setAttribute('method', 'post');
                FromElement.setAttribute('action', response.data.paymentUrl);

                const data = [
                    { name: "encData", value: response.data.encData },
                    { name: "clientCode", value: response.data.clientCode },
                ]

                data.forEach((item) => {
                    const InputElement = document.createElement('input');
                    InputElement.setAttribute('type', 'hidden');
                    InputElement.setAttribute('name', item.name);
                    InputElement.setAttribute('value', item.value);
                    FromElement.appendChild(InputElement);
                });

                document.body.appendChild(FromElement);
                FromElement.submit();
            }
        } catch (error) {
            errorToast("Payment Failed");
        }
    }

    const verifyPayment = async () => {
        Swalwait();

        try {
            const encData = location.search.split("&")[1].slice(12);
            const response = await axios.post(verifyApiUrl, { crypt_str: encData });

            if (response.data?.status === 200) {
                Swal.fire({
                    title: 'Payment Successfull',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    timer: 3000,
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error in Payment',
                titleText: error?.response?.data?.message,
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 3000,
            });
        } finally {
            removeQueryParams();
            await callback();
        }
    }

    useEffect(() => {
        const param = searchParams.get("encResponse");
        if (param) {
            verifyPayment();
        }
    }, [])

    return { makePayment }
}

export default usePaymentHook;