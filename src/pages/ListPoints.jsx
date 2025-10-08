import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import TableData from './../components/ui/TableData'
import toast from 'react-hot-toast'; 

const ListPoints = () => {

    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const columns = [
        { key: 'name', title: 'Nom' },
        { key:'nature', title: 'Type' },
        { key: 'status', title: 'Statut' },
        { key: 'section_name', title: 'Section' },
       { key: 'createdAt', title: 'Créé le:' },
    ];

    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({
            Authorization: `Bearer ${token}`
         }), [token]);

    useEffect(() => {
        axios.get('/api/points',{headers })
            .then(response => {
                setPoints(response.data);
                console.log('list pt',response.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error('Erreur lors du chargement des points');
                setError('Erreur lors du chargement des points');
                setLoading(false);
            });
    }, [headers]);

    const formatDataForExport = () => {
        return points.map(point => ({
            'ID': point._id,
            'Nom de point': point.name,
            'Longitude': point.longitude,
            'Latitude': point.latitude,
            'Description': point.description,
            'Date de création': new Date(point.createdAt).toLocaleDateString('fr-FR'),
            'Section': point.section_id ? point.section_id.name : 'Aucune section'
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

    const handleDelete = useCallback((id) => {

 const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer la section ${id} ?`);
  if (!confirm) return;
     setLoading(true);

        axios.delete(`/api/points/${id}`,{headers })
            .then(() => {
                setPoints(points.filter(point => point._id !== id));
                toast.success('Point supprimé avec succès');
            })
            .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un point');
            } else {
            toast.error("Erreur lors de la suppression du point");
            }
            console.error("Erreur lors de la suppression :", error);
            setLoading(false);
        });
    }, [points,headers]);

    

    useEffect(() => {
        if (actionData) {
            switch (actionData.type) {
                case 'view':
                    navigate(`/dashboard/point/view/${actionData.id}`);
                    break;
                case 'edit':
                    navigate(`/dashboard/point/edit/${actionData.id}`);
                    break;
                default:
                    break;
            }
            setActionData(null);
        }
    }, [actionData, navigate]);

    if (points.length === 0 && !loading) {
        return <div>Aucun point trouvé.</div>;
    }


    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
       <div className='translate-all p-4 flex-1'>
     <TableData data={points} columns={columns} goto='/dashboard/add-point'
                 handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
                  formatDataForExport={formatDataForExport()}  fileNames='Mapref'/>
        </div>
    );
};

export default ListPoints;