import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import ButtonForm from '../components/ui/ButtonForm';
import Cardata from '../components/ui/Cardata';
import srcImg from '../assets/img/cover.jpeg';
import { FiEdit2 } from 'react-icons/fi';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
    const navigate = useNavigate();
    //const { id } = useParams();
    const [showForm, setShowForm] = useState(false);

    const handelEdit = () => {
        setShowForm(!showForm);
    };

  useEffect(() => {
    const fetchProfile = async () => {
         const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status !== 200) {
          throw new Error('Erreur lors de la récupération du profil');
        }
        console.log(res.data);
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error(err);
        setUser(null);
        toast.error("Erreur d'accès au profil. Veuillez vous reconnecter.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (file) formData.append('avatar', file);

     const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

    try {
      await axios.put('/auth/profile', formData,
         {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'

          }
        }
      );
      toast.success('Profil mis à jour');
    } catch (err) {
        console.error(err);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement du profil...</div>;
  if (!user) return <div className="p-6 text-center">Utilisateur non connecté</div>;

  return (
    <div className="p-6 flex items-center justify-center mt-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className='relative flex flex-col items-center rounded-[20px] w-full p-4 bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none'>
            <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover" >
                    <img src={srcImg} class="absolute flex h-32 w-full justify-center rounded-xl bg-cover"/> 
                    <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-blue-900 dark:!border-navy-700">
                       <img
                src={user.avatar ? `http://localhost:5000/${user.avatar}` : '/default-avatar.png'}
                alt="Avatar"
                className="w-10 h-10 rounded-full mb-2 object-cover"
              />
             </div>
            </div> 
            <div class="mt-16 flex flex-col items-center">
                    <h4 class="text-xl font-bold text-navy-700 dark:text-white">
                        {user.name}
                    </h4>
                    <p class="text-base font-normal text-gray-600">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </p>
               
                <div className="mt-6 mb-3 flex gap-14 md:!gap-14">
                    <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">Email:</p>
                    <p className="text-sm font-normal text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                    créer le: 
                    </p>
                    <p className="text-sm font-normal text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                    </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                    Statut
                    </p>
                    <p className="text-sm font-normal text-gray-600">
                        {user.isActive ? 'Actif' : 'Inactif'}
                    </p>
                    </div>
                </div>
                <ButtonForm variant="success" onClick={handelEdit}  icon={<FiEdit2 className="w-4 h-4" />}/>
            </div>
            </div>
        </motion.div>
            { showForm && (
            <div className="fixed inset-0 z-[9000]  bg-gray-900 transition-opacity duration-300 ease-in-out opacity-90 flex items-center justify-center">
            <Cardata title="Modifier le profil" subtitle="Mettez à jour vos informations personnelles"
            headerAction={
               <span class="relative flex size-3 cursor-pointer"  onClick={() => setShowForm(false)}>
  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
</span>
              }>
                <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6 p-4">
             <div className="grid grid-cols-1 md:grid-cols-1 gap-3 p-4">
            <Input
              name="name"
              label="Nom"
              defaultValue={user.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
                IconComponent={<FiEdit2 className="h-5 w-5" />}
                className="px-4 py-2"
            />
            <Input
              name="email"
              label="Email"
              type="email"
                defaultValue={user.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                IconComponent={<FiEdit2 className="h-5 w-5" />}
                className="px-4 py-2"
            />
            <Input
              name="avatar"
              label="Avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="px-4 py-2" 
                IconComponent={<FiEdit2 className="h-5 w-5" />}
            />

            <ButtonForm type="submit" variant="success">
              Sauvegarder
            </ButtonForm>
            </div>
          </form>
           </Cardata>
            </div>
                )}
    </div>
  );
}
