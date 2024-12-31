import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AiOutlineDownload } from 'react-icons/ai';
import { BiQuestionMark } from 'react-icons/bi';
import { CustomBtn } from '../../../components';
import { BiRupee } from 'react-icons/bi';
import { TiDocument } from 'react-icons/ti';
import StatusReason from '../../../components/Modals/StatusReason';
import loadable from '@loadable/component';
import SRComponent from '../../../components/shared/SRComponent';
import { SR_MODES } from '../../../utils/config';
import { FaFilePdf } from 'react-icons/fa';
const ActionBtn = loadable(() => import('../../../components/shared/ActionBtn'));
const DownloadDocsModal = loadable(() => import('../../../components/Modals/DownloadDocument'));


const TABLE_HEADINGS = [
  'SN',
  'SR ID',
  'Client ID',
  'Category',
  'Created On',
  'Status',
  'Action',
];

const CustomerServiceRequest = () => {
  const { mode } = useParams();
  const activeMode = mode ? mode : SR_MODES[0];
  const navigation = useNavigate();
  const [reasonModal, setReasonModal] = useState(false);
  const [downloadDocsModalConfig, setDownloadDocsModalConfig] = useState({
    showModal: false,
    id: null,
    srID: null
  });
  const toggleDownloadDocsModal = (id = null, srID = null) => setDownloadDocsModalConfig({
    showModal: !downloadDocsModalConfig.showModal,
    id,
    srID,
  })
  const [message, setMessage] = useState('')

  const toggleReasonModal = (msg) => {
    setReasonModal(!reasonModal);
    setMessage(msg);
  };

  const downloadInvoice = (data) => {
    //console.log("data", data);
    window.open(data, '_blank');  
  }

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3 items-center">
        {(activeMode === SR_MODES[1] || activeMode === SR_MODES[2] || activeMode === SR_MODES[3]) && data[9] !== null && (
          <ActionBtn tooltip='Download Invoice' onClick={() => downloadInvoice(data[9])} >
            <FaFilePdf size={15} className=" text-white" />
          </ActionBtn>
        )}
        {(activeMode === SR_MODES[4]) && data[10] !== null && (
          <ActionBtn tooltip='Download Invoice' onClick={() => downloadInvoice(data[10])} >
            <FaFilePdf size={15} className=" text-white" />
          </ActionBtn>
        )}

        {data[8] === 1 && activeMode === SR_MODES[5] && (
          <ActionBtn tooltip='Upload Document' onClick={() => navigation(`/customer/service-request/edit-doc/${data[0]}/${data[5]}`)}>
            <TiDocument size={15} className=" text-white" />
          </ActionBtn>
        )}

        {data[7] !== null && (
          <ActionBtn tooltip="Payment" onClick={() => navigation(`/customer/service-request/${activeMode}/payment/${data[0]}`)} >
            <BiRupee size={15} className=" text-white" />
          </ActionBtn>
        )}

        {activeMode === SR_MODES[4] && (
          <ActionBtn tooltip='Download Docs' onClick={() => toggleDownloadDocsModal(data[0], data[4])} >
            <AiOutlineDownload
              size={15}
              className="text-white"
            />
          </ActionBtn>
        )}

        {(activeMode === SR_MODES[5] || activeMode === SR_MODES[6]) && data[9] !== null && (
          <ActionBtn tooltip='Pending Reason'>
            <BiQuestionMark
              onClick={() => toggleReasonModal(`${data[11]}`)}
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
          onClick={() => navigation('/customer/service-request/generate')}
        >
          Generate SR
        </CustomBtn>
      </div>
    )
  }

  return (
    <div>
      <SRComponent HeaderRightContainer={HeaderRightContainer} ActionBtnsElement={ActionBtnsElement} TABLE_HEADINGS={TABLE_HEADINGS} />

      {reasonModal && (
        <StatusReason toggleMoneyModal={toggleReasonModal} message={message} />
      )}

      {downloadDocsModalConfig.showModal && (
        <DownloadDocsModal config={downloadDocsModalConfig} toggleModal={toggleDownloadDocsModal} />
      )}
    </div>
  );
};

export default CustomerServiceRequest;
