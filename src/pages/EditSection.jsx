import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Input from './../components/ui/Input';
import ButtonForm from './../components/ui/ButtonForm';
import Cardata from './../components/ui/Cardata'
import toast from 'react-hot-toast';
import ButtonContainer from '../components/ui/ButtonContainer';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
//import { useAuth } from '../contexts/AuthContext';


export default function EditSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  // const { user } = useAuth();
    const token = localStorage.getItem('token');
     const headers = {
      Authorization: `Bearer ${token}`
    };
 

  useEffect(() => {
    if (!token) {
      toast.error('Vous devez être connecté ');
      navigate('/dashboard/list-sections');
      return;
    }
    axios.get(`/api/sections/${id}`, { headers })
      .then(response => {
        setSection(response.data); 
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        toast.error('Erreur lors du chargement');
        console.log(error);
        navigate('/dashboard/list-sections');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setSection({ ...section, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const token = localStorage.getItem('token');
     if (!token) {
        navigate('/login');
        return;
      }
      
    try {
      await axios.put(`/api/sections/${id}`, section, { headers});
      toast.success('Section modifiée');
      navigate('/dashboard/list-sections');
    } catch(error) {
      if (error?.response?.status === 403) {
          console.error(error);
          toast.error('Vous devez être administrateur pour modifier une section');
          navigate('/dashboard/list-sections');
        }
      else {
        console.error(error);
      toast.error('Erreur lors de la modification');
      navigate('/dashboard/list-sections');
      setLoading(false);
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-4 m-4">
     <div className="flex justify-center items-center">
        <motion.div initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Cardata
          title="Modifier la section"
          subtitle="Formulaire de modification de section"
          className="p-6 bg-white w-[400px] h-[400px] dark:bg-gray-800 shadow-md items-center"
          noPadding
        >
          <div className="flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="grid gap-3 w-full max-w-md" >
        <Input
          name="name"
          label={section.name}
          value={section.name}
          onChange={handleChange}
          required
          className='p-2 px-2'
        />
        <Input
          name="description"
          label="Description"
          type="text"
          value={section.description}
          onChange={handleChange}
          required
          className='p-2 px-2'
        />
        <ButtonContainer className="flex mt-6 w-full">
                       <ButtonForm
                         type="button"
                         onClick={() => {
                           setSection('');
                            navigate('/dashboard/list-sections');
                         }}
                          variant='secondary'
                       >
                         Annuler
                       </ButtonForm>
                       <ButtonForm
                         type="submit"
                         variant='success'
                       >
                         Ajouter
                       </ButtonForm>
                     </ButtonContainer>
      </form>
       </div>
        </Cardata>
        </motion.div>
      </div>
    </div>
  );
}