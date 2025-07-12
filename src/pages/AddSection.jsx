/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import Input from './../components/ui/Input';
import Textarea from './../components/ui/Textarea';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function AddSection() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
 
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) return toast.error('Vous devez être connecté pour ajouter une section');
  if (!name.trim() || !description.trim()) return toast.error('Tous les champs sont obligatoires');

  const data = { name, description, user_id: user.id };
  console.log('Données envoyées:', data);

  try {
    await axios.post('http://localhost:5000/api/sections', data, {
      headers: {
  Authorization: `Bearer ${user.token}`
}
    });
    toast.success('Section ajoutée avec succès');
    setName('');
    setDescription('');
  } catch (error) {
    console.error('Erreur lors de l’ajout de la section:', error);
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
          className="p-6 bg-white w-[400px] h-[400px] dark:bg-gray-800 shadow-md items-center"
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
                  onClick={() => {
                    setName('');
                    setDescription('');
                  }}
                  className="bg-gray-400 text-white w-full py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </ButtonForm>
                <ButtonForm
                  type="submit"
                  className="bg-green-700 text-white py-2 w-full transition duration-150 ease-in rounded hover:bg-green-600"
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
