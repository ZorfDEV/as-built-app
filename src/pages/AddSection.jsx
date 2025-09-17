/* eslint-disable no-unused-vars */
import { useState, useMemo } from 'react';
import axios from 'axios';
import Input from './../components/ui/Input';
import Textarea from './../components/ui/Textarea';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AddSection() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
    const headers = useMemo(() => ({
                Authorization: `Bearer ${token}`
             }), [token]);
 
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) return toast.error('Vous devez être connecté pour ajouter une section');
  if (!name.trim() || !description.trim()) return toast.error('Tous les champs sont obligatoires');

  const data = { name, description, user_id: user.id };
  console.log('Données envoyées:', data);

  try {
    await axios.post('/api/sections', data, {headers});
    toast.success('Section ajoutée avec succès');
    navigate('/dashboard/list-sections');
  } catch (error) {
    console.error('Erreur lors de l’ajout de la section:', error);
    console.error('Données envoyées en erreur:', data);
    toast.error('Erreur lors de l’ajout de la section');
  }
};


  return (
    <div className="m-4 p-4">
      <div className="flex justify-center items-center">
        <motion.div initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Cardata
          title="Ajouter une section"
          subtitle="Formulaire d’ajout de section"
          className="p-6 bg-white w-[400px] h-[400px]  shadow-md items-center"
          noPadding
        >
          <div className="flex justify-center items-center p-4">
            <form onSubmit={handleSubmit} className="grid gap-3 w-full max-w-md" >
              <Input
                name="name"
                label="Nom de la section"
                type="text"
                className='p-2 px-2'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                name="description"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                type="text"
                className='p-2 px-2'
              />
              <ButtonContainer className="flex mt-6 w-full">
                <ButtonForm
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-400 flex justify-center text-white w-full py-2 rounded hover:bg-gray-600 hover:scale-105 duration-300 transition ease-in "
                >
                  Annuler
                </ButtonForm>
                <ButtonForm
                  type="submit"
                  className="bg-brandgreen text-white py-2 w-full transition ease-in rounded hover:bg-brandblue hover:scale-105 duration-300  hover:text-brandgreen justify-center"
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
