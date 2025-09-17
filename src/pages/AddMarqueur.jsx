/* eslint-disable no-unused-vars */
import { useState, useMemo } from 'react';
import axios from 'axios';
import Input from './../components/ui/Input';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdAttachFile } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function AddMarqueur() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
   const token = localStorage.getItem('token');
    const header = useMemo(() => ({
                Authorization: `Bearer ${token}`
             }), [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name) return toast.error('Tous les champs sont obligatoires');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
   

    try {
      await axios.post('http://10.188.44.88:5000/api/marqueurs', formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...header },
      });
      toast.success('Marqueur ajouté avec succès');
      navigate('/dashboard/list-marqueurs');
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
          className="p-6 bg-white w-[600px] h-auto dark:bg-gray-800 shadow-md items-center"
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
              <div className="col-span-full">
                        <div className="mt-2 flex justify-center rounded-lg  border-dashed
                         border-gray-900/25 px-6 py-10 dark:border-darkborder border-2 hover:border-brandgreen hover:scale-105 hover:text-brandgreen duration-300 transition ease-in w-full">
                              <div className="text-center">
                                <MdAttachFile aria-hidden="true" className="mx-auto size-12 text-gray-300"/>
                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md  font-semibold text-brandblue focus-within:ring-2 focus-within:ring-brandblue focus-within:ring-offset-2 focus-within:outline-hidden hover:text-brandgreen dark:text-darktext-primary"
                                  >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file"  accept=".svg" onChange={(e) => setFile(e.target.files[0])} type="file" className="sr-only" />
                                  </label>
                                </div>
                                <p className="text-xs/5 text-gray-600 dark:text-darktext-secondary">svg, up to 10MB</p>
                              </div>
                            </div>
                          </div>
    
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Fichier sélectionné : {file.name}
                </p>
              )}
              <ButtonContainer className="flex mt-6 w-full">
                <ButtonForm
                  type="button"
                  onClick={() => {
                    navigate(
                      '/dashboard/marqueurs'
                    )
                    setFile(null);
                    setName('');
                  }}
                  className="bg-gray-400 text-brandblue  font-semibold w-full py-2 rounded hover:bg-gray-600  hover:text-gray-100 transition duration-300 ease-in saturate-150"
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
            </motion.form>
          </div>
        </Cardata>
      </div>
    </div>
  );
}
