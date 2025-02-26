import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineDownload, AiOutlineExport } from 'react-icons/ai';
import { BiQuestionMark } from 'react-icons/bi';
import StatusReason from '../../../components/Modals/StatusReason';
import SRComponent from '../../../components/shared/SRComponent';
import { SR_MODES } from '../../../utils/config';
import { FiEdit } from 'react-icons/fi';
import ActionBtn from '../../../components/shared/ActionBtn';
import { errorToast } from '../../../utils';
import { CustomBtn } from '../../../components';

const TABLE_HEADINGS = [
  'SN',
  'SR ID',
  'Client ID',
  'Service Category',
  'Created On',
  'Status',
  'Action',
];

const List = () => {
  const navigation = useNavigate();
  const { mode } = useParams();
  const activeMode = mode ? mode : SR_MODES[0];
  const [moneyModal, setMoneyModal] = useState(false);
  const [message, setMessage] = useState('');

  const toggleMoneyModal = (msg) => {
    setMoneyModal(!moneyModal);
    setMessage(msg);
  };

  const exportSr = async (id) => {
    try {
        const res = await axios.post(`api/export-sr`,{srid : id});
        if (res.status === 200) {
            window.open(res.data.invoice, '_blank');  
        }
      } catch (error) {
        errorToast(error)
      }
  }

  const ActionBtnsElement = ({ data }) => {
    console.log('activeMode '+activeMode);
    return (
      <div className="flex gap-3">

        {(activeMode !== 'Processing' && activeMode !== 'Completed' && activeMode !== 'Closed') && (
        <ActionBtn tooltip='Edit SR' onClick={() => navigation(`/verificationteam/service-request/view/${data[0]}`)}  >
          <FiEdit size={15} className="text-white" />
        </ActionBtn>
        )}

        {/*{(activeMode === 'Pending' || activeMode === 'Rejected') && data[9] !== null && (
          <ActionBtn tooltip='Reason' onClick={() => toggleMoneyModal(`${data[9]}`)} >
            <BiQuestionMark size={15} className="text-white" />
          </ActionBtn>
        )}*/}
        {(activeMode === 'Pending' || activeMode === 'Rejected') && data[11] !== null && (
          <ActionBtn tooltip='Reason' onClick={() => toggleMoneyModal(`${data[11]}`)} >
            <BiQuestionMark size={15} className="text-white" />
          </ActionBtn>
        )}

        {(activeMode === SR_MODES[2] || activeMode === SR_MODES[3] || activeMode === SR_MODES[4]) && (

            <ActionBtn tooltip='Export SR' onClick={() => exportSr(data[0])} >
                <AiOutlineExport
                size={15}
                className="text-white"
            />
            </ActionBtn>
        )}
      </div>
    )
  }

  const HeaderRightContainer = () => {
    return (
      <div>
        <CustomBtn
          onClick={() => navigation('/verificationteam/service-request/generate')}
        >
          Generate SR
        </CustomBtn>
      </div>
    )
  }

  return (
    <div>
      <SRComponent ActionBtnsElement={ActionBtnsElement} TABLE_HEADINGS={TABLE_HEADINGS} HeaderRightContainer={HeaderRightContainer} />
      {moneyModal && (
        <StatusReason toggleMoneyModal={toggleMoneyModal} message={message} />
      )}
    </div>
  );
};

export default List;
