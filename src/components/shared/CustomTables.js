import React from 'react'
import { Table } from 'flowbite-react';
import InlineLoader from './InlineLoader';

const CustomTables = ({ TABLE_HEADINGS = [], noDataMessage = "No Data Found ⚠️", loadingMessage = "loading data", loading = false, DATA = [], ROW_DATA, ActionBtnsElement }) => {

    console.log(DATA);

    if (loading) {
        return (
            <InlineLoader loadingText={loadingMessage} />
        )
    }

    if (DATA?.length === 0 && !loading) {
        return (
            <p className="mt-4  text-xs md:text-sm ">{noDataMessage}</p>
        )
    }

    return (
        <div className='my-4'>
            <Table className='w-fit md:w-full'>
                <Table.Head>
                    {TABLE_HEADINGS.map((tableHeading, index) => (
                        <Table.HeadCell scope="col" className="whitespace-nowrap  text-xs font-medium py-2 md:py-3 px-6 bg-green-400 text-white" key={index}>
                            {tableHeading}
                        </Table.HeadCell>
                    ))}
                </Table.Head>
                <Table.Body className="divide-y">
                    {DATA.map((data, index) => (
                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            {ROW_DATA(data, index).map((item, index) => (
                                <Table.Cell key={index} className="whitespace-nowrap  text-xs text-gray-500 dark:text-white">
                                    {item}
                                </Table.Cell>
                            ))}
                            {typeof ActionBtnsElement === "function" &&
                                <Table.Cell>
                                    <ActionBtnsElement data={data} rowIndex={index} />
                                </Table.Cell>
                            }
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}

const CustomModes = ({ MODES, activeMode, setActiveMode, setActivePage }) => {
    return (
        <div className="flex gap-3 overflow-scroll scroll-smooth no-scrollbar ">
            {
                MODES.map((mode, index) => (
                    <span
                        className={`cursor-pointer px-2 py-1 md:px-3  text-xs md:text-sm md:py-1 rounded-md ${activeMode === mode
                            ? 'bg-green-400 text-white'
                            : 'text-gray-500 bg-white '
                            } `}
                        key={index}
                        onClick={() => {
                            setActiveMode(mode);
                            if (setActivePage) {
                                setActivePage(0)
                            }
                        }}
                    >
                        {mode}
                    </span>
                ))
            }
        </div>
    )


}

export default { Table: CustomTables, Modes: CustomModes }