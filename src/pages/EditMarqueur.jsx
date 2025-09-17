/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Input from './../components/ui/Input';
import Cardata from './../components/ui/Cardata';
import ButtonForm from './../components/ui/ButtonForm';
import ButtonContainer from './../components/ui/ButtonContainer';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function EditMarqueur() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [marqueur, setMarqueur] = useState(null);

     const token = localStorage.getItem('token');
        const headers = useMemo(() => ({
                Authorization: `Bearer ${token}`
             }), [token]);
    

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/marqueurs/${id}`,{headers})
            .then(response => {
                setMarqueur(response.data);
                console.log('Marqueur:', response.data);
                // Si vous avez besoin de définir des états pour le nom et le fichier, vous pouvez le faire ici
                // par exemple :
                 setName(response.data.name);
                setFile(response.data.file);
                //setName(response.data.name);
                setLoading(false);
            })
            .catch(error => {
                toast.error('Erreur lors du chargement du marqueur');
                console.error(error);
                setLoading(false);
            });
    }, [id,headers]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const updateData = {
      name: formData.get('name').trim() || name,
        file: formData.get('file') || file,
    };
   

    try {
      await axios.put(`/api/marqueurs/${id}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${token}`
         },
      });
      toast.success('Marqueur ajouté avec succès');
        console.log('Marqueur mis à jour:', updateData);
        navigate('/dashboard/list-marqueurs');
    } catch(error){
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour modifier un marqueur');
            } else {
            toast.error("Erreur lors de la modification du marqueur");
            }
            setLoading(false);
        };
  };

  return (
    <div className="m-4 p-4">
      <div className="flex justify-center items-center">
        <Cardata
          title="Ajouter un Marqueur (SVG)"
          subtitle="Formulaire d’ajout de marqueur SVG"
          className="p-6 bg-white w-[600px] h-[400px]  shadow-md items-center"
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
                label="Nom du marqueur"
                defaultValue= {name}
                className=" py-2 px-2"
                required
              />
              <Input
                type="file"
                accept=".svg"
                name="file"
                defaultValue={file}
                className="p-2 px-2"
                required
              />
              
              <ButtonContainer className="flex mt-6 w-full">
                <ButtonForm
                  type="button"
                  onClick={() => {
                    navigate('/dashboard/list-marqueurs');
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
            </motion.form>
          </div>
        </Cardata>
      </div>
    </div>
  );
}
