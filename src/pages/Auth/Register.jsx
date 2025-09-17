import React, { useMemo} from 'react';
import axios from 'axios';
//import { useFormik } from 'formik';
//import * as Yup from 'yup'; 
import toast from 'react-hot-toast';
import Cardata from '../../components/ui/Cardata';
import Input from '../../components/ui/Input';
import InputFile from '../../components/ui/InputFile';
import ButtonForm from '../../components/ui/ButtonForm';
import ButtonContainer from '../../components/ui/ButtonContainer';
import { HiUser } from "react-icons/hi";
import { BiSolidLock } from "react-icons/bi";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import InputSelect from '../../components/ui/InputSelect';
import { useNavigate } from 'react-router-dom';

export const Register = () => {

  /*const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [preview, setPreview] = useState(null);*/
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({
              Authorization: `Bearer ${token}`
           }), [token]);

  const roles = [
    { _id: 'admin', name: 'Administrateur', id: 1 },
    { _id: 'user', name: 'Utilisateur', id: 2 },
  ];

const handleSubmit = async (e) => {
    e.preventDefault();
     const formData = new FormData(e.target);
  // if (!name || !email || !password || !role) return toast.error('Tous les champs sont obligatoires');
   const newUser = {
     name: formData.get('name'),
     email: formData.get('email'),
     password: formData.get('password'),
     role: formData.get('role'),
     avatar: "default.png"
   };
   console.log("NOUVEL UTILISATEUR :", newUser);
    try {
       await axios.post('/api/auth/register', newUser, {headers});
        toast.success('Inscription réussie !');
        navigate('/dashboard/list-users');
      } catch (error) {
  console.error("Erreur inscription :", newUser, error);
  toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
}
  };


  
  //  Gestion fichier + preview
/*  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  useEffect(() => {
  return () => {
    if (preview) URL.revokeObjectURL(preview);
  };
}, [preview]);*/


  return (
    <div className="p-6">
      <Cardata 
        title="Inscription" 
        subtitle="Créer un nouvel utilisateur"
        className="p-6 bg-white w-[500px] h-auto shadow-md mx-auto"
        noPadding
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
            <Input
              label="Nom d'utilisateur"
              name="name"
              IconComponent={<HiUser />}
            type="text"
              required
              className="px-4 py-2"
            />
            <Input
              label="Email"
              name="email"
              IconComponent={<MdEmail />}
              type="email"
              required 
              className="px-4 py-2"
            />
            <Input
              label="Mot de passe"
              name="password"
              IconComponent={<BiSolidLock />}
              type="password"
              required
              className="px-4 py-2"
            />
            <InputSelect
              label="Rôle"
              name="role"
              datas={roles}
              required
              className="p-2"
            />
          </div>
          <ButtonContainer className="flex mt-6 w-full">
            <ButtonForm type="submit" variant="success"  className="w-full">
              S'inscrire
              <IoArrowForwardCircleOutline />
            </ButtonForm>
          </ButtonContainer>
        </form>
      </Cardata>
    </div>
  );
};

export default Register;
