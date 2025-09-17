import { useEffect, useState,useCallback } from "react";
import axios from 'axios';
import TableData from './../components/ui/TableData'
import toast from 'react-hot-toast'; 
import { useNavigate } from "react-router-dom";
const ListSections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const columns = [
    { key: '_id', title: 'ID' },
    { key: 'name', title: 'Nom' },
    { key: 'description', title: 'Détail' },
    { key: 'createdAt', title: 'Créé le:' },
  ];
    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
        axios.get('/api/sections', {
            headers: {  
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setSections(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(err => {
              toast.error('Erreur lors du chargement des sections');
                setError(err.message || 'Erreur lors du chargement');
                setLoading(false);
            });
    }, []);

     const formatDataForExport = () => {
    return sections.map(section => ({
      'ID': section._id,
      'Nom de zone': section.name,
      'Description': section.description,
      'Date de création': new Date(section.createdAt).toLocaleDateString('fr-FR')
      
    }));
  };
 const navigate = useNavigate();

 const [actionData, setActionData] = useState(null);
 
 const handleView = useCallback((id) => {
   setActionData({ type: 'view', id });
 }, []);

 const handleEdit = useCallback((id) => {
   setActionData({ type: 'edit', id });
 }, []);

  useEffect(() => {
    if (actionData) {
      switch (actionData.type) {
        case 'view':
          navigate(`/dashboard/section/view/${actionData.id}`);
          break;
        case 'edit':
          navigate(`/dashboard/section/edit/${actionData.id}`);
          break;
        default:
          break;
      }
      setActionData(null);
    }
  }, [actionData, navigate]);

  /*const handleDelete = useCallback((id) => {
    axios.delete(`/api/section/${id}`)
      .then(() => {
        toast.success("Section supprimée avec succès");
        setSections(sections.filter(section => section._id !== id));
      })
      .catch(error => {
        toast.error("Erreur lors de la suppression de la section");
        console.error("Erreur lors de la suppression :", error);
      });
  }, [sections]);*/
  const handleDelete = async (id) => {
  const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer la section ${id} ?`);
  if (!confirm) return;

  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`
    };
    const res = await axios.delete(`/api/sections/${id}`, { headers });
    
    if (res.status === 200) {
      setSections(prev => prev.filter(s => s._id !== id));
      toast.success('Section supprimée avec succès');
    } else {
      toast.error(`Section non trouvée ou déjà supprimée (${res.status})`);
    }

  } catch (error) {
    if (error.response?.status === 403) {
      toast.error('vous devez être administrateur pour supprimer une section');
    } else {
      toast.error('Erreur lors de la suppression');
    }
    console.error('Suppression échouée:', error);
  } finally {
    setLoading(false);
  }
};


    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className='p-6'>
       <TableData data={sections} columns={columns} goto='/dashboard/add-section'
             handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
              formatDataForExport={formatDataForExport()}  fileNames='Sections'/>
        </div>
    );
};

export default ListSections;