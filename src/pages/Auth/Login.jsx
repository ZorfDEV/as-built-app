import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiUser } from "react-icons/hi";
import { BiSolidLock } from "react-icons/bi";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import Input from './../../components/ui/Input';
//import { notifyError } from '../components/Notification';
import LayoutLogin from './../../components/Layout/LayoutLogin';

const validationSchema = yup.object({
  email: yup.string().email('Email invalide').required('Requis'),
  password: yup.string().min(6, 'Minimum 6 caractères').required('Requis')
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await axios.post('http://localhost:5000/auth/login', values);
        login(res.data.token);
        navigate('/dashboard');
      } catch (err) {
        if (err.response?.data?.message) {
            console.log(values);
          setErrors({ password: err.response.data.message });
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <LayoutLogin>
       <form onSubmit={formik.handleSubmit} className="mx-auto  max-w-xl sm:mt-20">
        <div className="flex flex-col space-y-4">
          
          <Input
          label="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
             className='px-4 py-2'
             required
            IconComponent= {<HiUser className="h-5 w-5 " />}
          />
          <div>{formik.errors.email}</div>
          {/* Champ de mot de passe */}
          <Input
          label="Mot de passe"
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className='px-4 py-2'
             required
            IconComponent={ <BiSolidLock className="h-5 w-5"/>}/>
          <div>{formik.errors.password}</div>
        </div>
        {/* Bouton de Soumission */}
        <div className="text-center mt-4">
          <button type="submit"  className="flex mb-2 items-center justify-center focus:outline-none text-blue-950 text-sm sm:text-base bg-green-primary hover:bg-teal-500 rounded-md py-2 w-full transition duration-150 ease-in">
            <span className="mr-6 uppercase font-bold">Se connecter</span>
            <IoArrowForwardCircleOutline className="h-6 w-6 text-blue-950" />
          </button>
        </div>
      </form>
    </LayoutLogin>
  );
}
