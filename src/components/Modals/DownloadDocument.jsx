import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiDownload, FiX } from 'react-icons/fi';
import loadable from '@loadable/component';
import CustomTables from '../shared/CustomTables';
import useAwsS3 from '../../hooks/useAwsS3';
import { errorToast } from '../../utils';

const ActionBtn = loadable(() => import('../shared/ActionBtn'));

const TABLE_HEADINGS = ['sl.no', 'Document Name', 'Actions']

const DownloadDocument = ({ config, toggleModal }) => {
    const [clientdoc, setClientDoc] = useState([]);
    const [loading, setLoading] = useState(false);
    const { downloadFromS3, isFileDownloading } = useAwsS3();

    const visible = config.showModal;

    const getClientDocuments = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`api/get-client-documents/${config.id}`)
            if (res.data.status === 200) {
                setClientDoc(res.data.clientdoc || []);
            }
        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false);
        }
    }

    const getRowData = (item, index) => {
        if (!item) {
            return []
        }

        const fileExtension = item.document.split('.').pop();

        return [index + 1, `${config?.srID}_finalDoc_${index + 1}.${fileExtension}`]
    }

    const ActionBtnsElement = ({ data, rowIndex }) => {
        return (
            <ActionBtn loading={isFileDownloading(`${data.document}${rowIndex}`)} tooltip='Download' >
                <FiDownload size={15} className='text-white' onClick={() => downloadFromS3(data.document, rowIndex, `${config?.srID}_finalDoc_${rowIndex + 1}`)} />
            </ActionBtn>
        )
    }

    useEffect(() => {
        if (visible && config.id !== null) {
            window.document.body.style.overflow = 'hidden';
            getClientDocuments();
        }

        return () => {
            window.document.body.style.overflow = 'auto';
        }
    }, []);

    return (
        <div className="overflow-hidden fixed z-30 left-0 right-0 top-0 bottom-0  bg-gray-800 bg-opacity-80 flex justify-center items-center ">
            <div
                className="bg-gray-100 min-w-[50%] w-fit p-5 flex flex-col gap-4  rounded-lg overflow-auto"
                style={{ maxHeight: '90vh' }}
            >
                <div className='flex items-center justify-between'>
                    <p className='font-semibold text-base' >Download Documents </p>
                    <FiX size={20} onClick={toggleModal} className='cursor-pointer' />
                </div>
                <section>
                    <CustomTables.Table
                        loading={loading}
                        TABLE_HEADINGS={TABLE_HEADINGS}
                        DATA={clientdoc}
                        ROW_DATA={getRowData}
                        noDataMessage={`No Document's Found`}
                        loadingMessage='Documents'
                        ActionBtnsElement={ActionBtnsElement}
                    />
                </section>
            </div>
        </div>
    )
}

export default DownloadDocument