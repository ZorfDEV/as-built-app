/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import Input from './../components/ui/Input';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AddMarqueur() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name) return toast.error('Tous les champs sont obligatoires');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
   

    try {
      await axios.post('http://localhost:5000/api/marqueurs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Marqueur ajouté avec succès');
      setFile(null);
      setName('');
    } catch (error) {
      console.log(error);
       console.log(Object.fromEntries(formData));
      toast.error('Erreur lors de l’ajout du marqueur');
    }
  };

  return (
    <div className="m-4 p-4">
      <div className="flex justify-center items-center">
        <Cardata
          title="Ajouter un Marqueur (SVG)"
          subtitle="Formulaire d’ajout de marqueur SVG"
          className="p-6 bg-white w-[400px] h-[400px] dark:bg-gray-800 shadow-md items-center"
          noPadding
        >
          <div className="flex justify-center items-center p-4">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="grid gap-3 w-full max-w-md"
            >
              <Input
                name="name"
                label="Nom du Marqueur"
                value={name}
                className=" py-2"
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="file"
                accept=".svg"
                onChange={(e) => setFile(e.target.files[0])}
                className="py-2"
                required
              />
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné : {file.name}
                </p>
              )}
              <ButtonContainer className="flex mt-6 w-full">
                <ButtonForm
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setName('');
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
            </motion.form>
          </div>
        </Cardata>
      </div>
    </div>
  );
}
