import axios from 'axios'
import TableData from './../../components/ui/TableData'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'; 

const ListUsers = () => {

const [users, setUsers] = useState([])
const token = localStorage.getItem('token');
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
 const navigate = useNavigate();
const headers = useMemo(() => ({
            Authorization: `Bearer ${token}`
         }), [token]);

const [actionData, setActionData] = useState(null);
    
    const columns = [
        { title: 'ID', key: '_id' },
        { title: 'Nom d\'utilisateur', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Rôle', key: 'role' },
        { title: 'Actions', key: 'actions' },
    ]
  useEffect(() => {
  axios.get('/api/auth/users',{headers })
            .then(response => {
                setUsers(response.data);
                console.log('list users',response.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Erreur lors du chargement des utilisateurs');
                setError('Erreur lors du chargement');
                setLoading(false);
            });
  }, [headers])

    const formatDataForExport = () => {
        return users.map(user => ({
            ID: user._id,
            'Nom d\'utilisateur': user.username,
            Email: user.email,
            Rôle: user.role,
        }))
    }
 const handleView = useCallback((id) => {
         setActionData({ type: 'view', id });
     }, []);
     const handleEdit = useCallback((id) => {
         setActionData({ type: 'edit', id });
     }, []);
      const handleDelete = useCallback((id) => {

 const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer la section ${id} ?`);
  if (!confirm) return;
     setLoading(true);

        axios.delete(`/api/users/${id}`,{headers })
            .then(() => {
                setUsers(users.filter(user => user._id !== id));
                toast.success('user supprimé avec succès');
            })
            .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un user');
            } else {
            toast.error("Erreur lors de la suppression du user");
            }
            console.error("Erreur lors de la suppression :", error);
            setLoading(false);
        });
    }, [users,headers]);

    

    useEffect(() => {
        if (actionData) {
            switch (actionData.type) {
                case 'view':
                    navigate(`/dashboard/user/view/${actionData.id}`);
                    break;
                case 'edit':
                    navigate(`/dashboard/user/edit/${actionData.id}`);
                    break;
                default:
                    break;
            }
            setActionData(null);
        }
    }, [actionData, navigate]);

    if (users.length === 0 && !loading) {
        return <div>Aucun user trouvé.</div>;
    }

if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;


  return (
   <div className='translate-all p-4 flex-1'>
        <TableData data={users} columns={columns} goto='/dashboard/register'
                    handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
                     formatDataForExport={formatDataForExport()}  />
           </div>
  )
}

export default ListUsers