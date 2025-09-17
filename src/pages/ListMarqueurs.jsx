import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCallback } from 'react';
import TableData from './../components/ui/TableData'
import toast from 'react-hot-toast';

const ListMarqueurs = () => {
    const [marqueurs, setMarqueurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const columns = [
        { key: 'file', title: 'Fichier' },
        { key: 'name', title: 'Nom' },
         { key: 'createdAt', title: 'Créé le:' },
        { key: 'updatedAt', title: 'Mis à jour' },
       
    ];

     const token = localStorage.getItem('token');
        const headers = useMemo(() => ({
                Authorization: `Bearer ${token}`
             }), [token]);
    

    useEffect(() => {
        axios.get('/api/marqueurs',{headers})
            .then(response => {
                setMarqueurs(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Erreur lors du chargement des marqueurs');
                setLoading(false);
            });
    }, [headers]);

     const formatDataForExport = () => {
        return marqueurs.map(marqueur => ({
        
            'Nom du marqueurs': marqueur.name,
            'Fichier': marqueur.file,
            'Date de création': new Date(marqueur.createdAt).toLocaleDateString('fr-FR'),
            'Mise à jour': new Date(marqueur.updatedAt).toLocaleDateString('fr-FR'),
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

        axios.delete(`/api/marqueurs/${id}`,{headers})
            .then(() => {
                setMarqueurs(marqueurs.filter(marqueur => marqueur._id !== id));
                toast.success('marqueur supprimé avec succès');
            })
            .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un marqueur');
            } else {
            toast.error("Erreur lors de la suppression du marqueur");
            }
            console.error("Erreur lors de la suppression :", error);
            setLoading(false);
        });
    }, [marqueurs,headers]);

    

    useEffect(() => {
        if (actionData) {
            switch (actionData.type) {
                case 'view':
                    navigate(`/dashboard/marqueur/view/${actionData.id}`);
                    break;
                case 'edit':
                    navigate(`/dashboard/marqueur/edit/${actionData.id}`);
                    break;
                default:
                    break;
            }
            setActionData(null);
        }
    }, [actionData, navigate]);


    if (loading) return <div>Chargement...</div>;

    return (
        <div className='p-6'>
            <TableData
            goto='/dashboard/add-marqueur'
                data={marqueurs}
                columns={columns}
                loading={loading}
                 handleView={handleView}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                formatDataForExport={formatDataForExport}
            />
           
        </div>
    );
};

export default ListMarqueurs;