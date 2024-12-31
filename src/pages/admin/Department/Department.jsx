import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { errorToast } from '../../../utils';

const Department = () => {
  const { id } = useParams();

  const [dept, setDept] = useState({
    name: '',
    email: '',
    password: '',
  });

  const getDepartment = async () => {
    try {
      await axios.get(`api/get-department/${id}`).then((res) => {
        if (res.data.status === 200) {
          setDept({
            name: res.data.user.name,
            email: res.data.user.email,
            password: res.data.password,
          });
        }
      });
    } catch (error) {
      errorToast(error)
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <div className="bg-white p-6 rounded-md mb-5">
      <label>Name: {dept.name}</label>
      <br />
      <label>Email: {dept.email}</label>
      <br />
      <label>Password: {dept.password}</label>
    </div>
  );
};

export default Department;
