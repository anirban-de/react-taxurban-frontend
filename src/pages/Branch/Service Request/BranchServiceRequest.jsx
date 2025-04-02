import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BiQuestionMark } from 'react-icons/bi';
import { CustomBtn } from '../../../components';
import { BiRupee } from 'react-icons/bi';
import StatusReason from '../../../components/Modals/StatusReason';
import { TiDocument } from 'react-icons/ti';
import loadable from '@loadable/component';
import SRComponent from '../../../components/shared/SRComponent';
import { SR_MODES } from '../../../utils/config';
import { AiOutlineDownload } from 'react-icons/ai';
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


const BranchServiceRequest = () => {
  const navigation = useNavigate();
  const { mode } = useParams();
  const activeMode = mode ? mode : SR_MODES[0];
  const [downloadDocsModalConfig, setDownloadDocsModalConfig] = useState({
    showModal: false,
    id: null,
    srID: null
  });
  const [reasonModal, setReasonModal] = useState(false);
  const [message, setMessage] = useState('');

  const toggleDownloadDocsModal = (id = null, srID = null) => setDownloadDocsModalConfig({
    showModal: !downloadDocsModalConfig.showModal,
    id,
    srID,
  })

  const toggleReasonModal = (msg) => {
    setReasonModal(!reasonModal);
    setMessage(msg);
  };

  const ActionBtnsElement = ({ data }) => {
    return (
      <div className="flex gap-3">
        {data[8] === 1 && activeMode === SR_MODES[5] && (
          <ActionBtn tooltip='Upload Document' onClick={() => navigation(`/branch/service-request/edit-doc/${data[0]}/${data[5]}`)}>
            <TiDocument size={15} className=" text-white" />
          </ActionBtn>
        )}

        {/*&& activeMode !== 'Pending' && activeMode !== 'Rejected'*/}
        {/*added above code to below condition @ 02-Apr-25*/}

        {data[7] !== null && activeMode !== 'Pending' && activeMode !== 'Rejected' && (
          <ActionBtn tooltip="Payment" onClick={() => navigation(`/branch/service-request/${activeMode}/payment/${data[0]}`)} >
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

        {/*{(activeMode === SR_MODES[5] || activeMode === SR_MODES[6]) && data[9] !== null && (
          <ActionBtn tooltip='Pending Reason'>
            <BiQuestionMark
              onClick={() => toggleReasonModal(`${data[9]}`)}
              size={15}
              className="text-white"
            />
          </ActionBtn>
        )}*/}

        {(activeMode === 'Pending' || activeMode === 'Rejected') && data[11] !== null && (
          <ActionBtn tooltip='Reason' onClick={() => toggleReasonModal(`${data[11]}`)} >
            <BiQuestionMark size={15} className="text-white" />
          </ActionBtn>
        )}
      </div>
    )
  }

  const HeaderRightContainer = () => {
    return (
      <div className="flex gap-3">
        <CustomBtn onClick={() => navigation('/branch/search-sr')} >
          Search SR
        </CustomBtn>
        <CustomBtn onClick={() => navigation('/branch/service-request/generate')} >
          Generate SR
        </CustomBtn>
      </div>
    )
  }

  return (
    <div>
      <SRComponent HeaderRightContainer={HeaderRightContainer} ActionBtnsElement={ActionBtnsElement} TABLE_HEADINGS={TABLE_HEADINGS} />

      {downloadDocsModalConfig.showModal && (
        <DownloadDocsModal config={downloadDocsModalConfig} toggleModal={toggleDownloadDocsModal} />
      )}

      {reasonModal && (
        <StatusReason toggleMoneyModal={toggleReasonModal} message={message} />
      )}
    </div>
  );
};

export default BranchServiceRequest;
