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
import toast from 'react-hot-toast';
import LayoutLogin from './../../components/Layout/LayoutLogin';
import CardAuth from '../../components/ui/CardAuth';
import iconeHumain from './../../assets/img/icone-humain.svg'; 


const validationSchema = yup.object({
  email: yup.string().required('Requis'),
  password: yup.string().required('Requis')
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await axios.post('/api/auth/login', values);
        login(res.data.token);
        navigate('/dashboard');
      } catch (err) {
        if (err.response?.data?.message) {
          toast.error(err.response.data.message);
          setErrors({ password: err.response.data.message });
        }
        else if (err.response.status === 401) {
          toast.error('Identifiants incorrects');
          setErrors({ password: 'Identifiants incorrects' });
        }
        else {
          toast.error('Une erreur est survenue, veuillez réessayer plus tard');
          setErrors({ password: 'Une erreur est survenue' });
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <CardAuth 
    title={"Connexion sécurisée"}
     logoItem={<div className="w-16 h-16 rounded-full bg-blue-950 flex justify-center items-center"><img alt="Axione" src={iconeHumain} className="h-9 w-auto" /></div>}
     footerContent={<span className="text-xs text-gray-500">© {new Date().getFullYear()} As‑Built — Tous droits réservés</span>}
     className={"bg-login dark:from-gray-900 dark:to-gray-800"}>
       <form onSubmit={formik.handleSubmit} className="mx-auto  max-w-xl">
        <div className="flex flex-col space-y-4 m-4">
          
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
        </div>
        {/* Bouton de Soumission */}
        <div className=" m-6 flex items-center justify-center">
          <button type="submit"  className="relative flex space-x-2 group items-center justify-center focus:outline-none text-brandblue text-sm font-bold cursor-pointer sm:text-base bg-brandgreen w-full hover:text-brandgreen rounded-full py-2 h-12
                     before:absolute 
                      before:rounded-full
                      before:inset-0 
                      before:bg-brandblue
                      before:scale-x-0 
                      before:origin-right
                      before:transition
                      before:duration-300
                      hover:before:scale-x-100
                      hover:before:origin-left">
            <span className="relative text-base">Se connecter</span>
            <div class="flex items-center -space-x-3 translate-x-3">
            <div class="w-2.5 h-[1.6px] rounded bg-brandgreen origin-left scale-x-0 transition duration-300 group-hover:scale-x-100"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 font-bold -translate-x-2 transition duration-300 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          </button>
        </div>
      </form>
    </CardAuth>
  );
}
