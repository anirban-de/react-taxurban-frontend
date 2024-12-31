import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaFilePdf } from "react-icons/fa";
import { TbEdit } from 'react-icons/tb';
import { AiOutlineDelete, AiOutlineDownload, AiOutlineExport } from 'react-icons/ai';
import { BiQuestionMark } from 'react-icons/bi';
import { CustomBtn } from '../../../components';
import StatusReason from '../../../components/Modals/StatusReason';
import SRComponent from '../../../components/shared/SRComponent';
import loadable from '@loadable/component';
import { SR_MODES } from '../../../utils/config';
import { useQueryClient } from '@tanstack/react-query';
import ActionBtn from '../../../components/shared/ActionBtn';
import { errorToast } from '../../../utils';
const DownloadDocsModal = loadable(() => import('../../../components/Modals/DownloadDocument'));

const TABLE_HEADINGS = [
  'SN',
  'SR ID',
  'Client ID',
  'Category',
  'Service Head 1',
  'Service Head 2',
  'Created',
  'Closed',
  'Status',
  'Actions',
];

const AdminServiceRequest = () => {
  const navigation = useNavigate();
  const queryClient = useQueryClient()

  const { mode } = useParams();
  const activeMode = mode ? mode : SR_MODES[0];
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
  const [message, setMessage] = useState('');

  const toggleReasonModal = (msg) => {
    setReasonModal(!reasonModal);
    setMessage(msg);
  };

  const deleteSR = async (id) => {
    const con = window.confirm('Are you sure?');
    if (!con) return;

    try {
      const res = await axios.get(`api/delete-sr/${id}`);
      if (res.status === 200) {
        queryClient.removeQueries(['SR']);
      }
    } catch (error) {
      errorToast(error)
    }
  };

  const downloadInvoice = (data) => {
    //console.log("data", data);
    window.open(data, '_blank');  
  }

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
    return (
      <div className="flex gap-3">
         {(activeMode === SR_MODES[1] || activeMode === SR_MODES[3]) && data[9] !== null && (
          <ActionBtn tooltip='Download Invoice' onClick={() => downloadInvoice(data[9])} >
            <FaFilePdf size={15} className=" text-white" />
          </ActionBtn>
        )}
        {(activeMode === SR_MODES[2]) && data[9] !== null && (
          <ActionBtn tooltip='Advance Receipt Voucher' onClick={() => downloadInvoice(data[9])} >
            <FaFilePdf size={15} className=" text-white" />
          </ActionBtn>
        )}
        {(activeMode === SR_MODES[4]) && data[10] !== null && (
          <ActionBtn tooltip='Download Invoice' onClick={() => downloadInvoice(data[10])} >
            <FaFilePdf size={15} className=" text-white" />
          </ActionBtn>
        )}
        <ActionBtn tooltip='Edit SR' onClick={() => navigation(`/admin/service-request/edit/${data[0]}`)} >
          <TbEdit size={15} className=" text-white" />
        </ActionBtn>
        <ActionBtn tooltip='Delete SR' onClick={() => deleteSR(data[0])}>
          <AiOutlineDelete size={15} className=" text-white" />
        </ActionBtn>

        {activeMode === SR_MODES[4] && (
          <ActionBtn tooltip='Download Docs' onClick={() => toggleDownloadDocsModal(data[0], data[4])} >
            <AiOutlineDownload
              size={15}
              className="text-white"
            />
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

        {(activeMode === SR_MODES[5] || activeMode === SR_MODES[6]) && data[9] !== null && (
          <ActionBtn tooltip='Reason' onClick={() => toggleReasonModal(`${data[11]}`)} >
            <BiQuestionMark size={15} className="text-white" />
          </ActionBtn>
        )}
      </div>
    )
  }

  const HeaderRightContainer = () => {
    return (
      <div>
        <CustomBtn
          onClick={() => navigation('/admin/service-request/generate')}
        >
          Generate SR
        </CustomBtn>
      </div>
    )
  }


  return (
    <div>
      <SRComponent TABLE_HEADINGS={TABLE_HEADINGS} ActionBtnsElement={ActionBtnsElement} HeaderRightContainer={HeaderRightContainer} />

      {downloadDocsModalConfig.showModal && (
        <DownloadDocsModal config={downloadDocsModalConfig} toggleModal={toggleDownloadDocsModal} />
      )}

      {reasonModal && (
        <StatusReason toggleMoneyModal={toggleReasonModal} message={message} />
      )}
    </div>
  );
};

export default AdminServiceRequest;
