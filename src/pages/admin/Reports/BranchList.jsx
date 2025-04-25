import React, { useState, useEffect } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ServiceCategoriesModal from '../Modals/ServiceCategoriesModal';
import { useDispatch, useSelector } from 'react-redux';
import { setSrReports } from '../../../redux/SrReportSlice';
import { CustomBtn, CustomInput } from '../../../components';
import { FiEdit, FiRefreshCcw } from 'react-icons/fi';
import ActionBtn from '../../../components/shared/ActionBtn';
import CustomTables from '../../../components/shared/CustomTables';
import { errorToast } from '../../../utils';
import TableToExcelApi from '../../../components/shared/TableToExcelApi';

const TABLE_HEADINGS = [
  'SN',
  'Branch ID',
  'Branch Name',
  'Business Name',
  'Status',
  'Registration Date',
];

