import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import OtpInput from 'react-otp-input';
import CustomBtn from '../shared/CustomBtn';

const OtpModal = ({ visible = false, setVisible, onSubmit }) => {
  window.document.body.style.overflow = 'hidden';
  const [otp, setOtp] = React.useState('');
  const [timer, setTimer] = React.useState(120);

  const secsToMin = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min > 0 ? min : ''}${min > 0 ? ':' : ''}${sec <= 9 ? `0${sec}` : sec}`;
  }

  useEffect(() => {
    if (timer === 0) return;

    if (visible) {
      window.document.body.style.overflow = 'hidden';
    }

    setTimeout(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => {
      window.document.body.style.overflow = 'auto';
    };
  }, [timer]);

  if (!visible) return null;


  return (
    <div className="overflow-hidden fixed z-30 left-0 right-0 top-0 bottom-0  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
      <div
        className="bg-gray-100 md:w-2/6 w-11/12 p-5  rounded-lg overflow-auto"
        style={{ maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center">
          <p>Verify OTP</p>
          <FiX
            onClick={() => {
              const shouldClose = window.confirm('Are you sure you want to close this modal?');
              if (shouldClose) {
                window.document.body.style.overflow = 'none';
                setVisible();
              }
            }}
          />
        </div>

        <div className='flex justify-center flex-col gap-5 items-center my-3'>
          <h1>Enter your 4 Digit OTP</h1>
          <OtpInput
            containerStyle={{ alignItems: 'center', gap: 10 }}
            inputStyle={{ width: 50, height: 50, borderRadius: 10, border: '1px solid #ccc', fontSize: 20 }}
            value={otp}
            onChange={setOtp}
            shouldAutoFocus
            numInputs={4}
            renderInput={(props) => <input {...props} />}
          />
          {timer === 0 ?
            <p className='text-sm'>Didn't receive the OTP? <span className='text-blue-500 cursor-pointer'>Resend OTP</span></p> :
            <p className='text-sm'>OTP will expire in {secsToMin()} seconds</p>
          }
          <CustomBtn onClick={(e) => { e.preventDefault(); onSubmit(otp) }}>
            Verify
          </CustomBtn>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
