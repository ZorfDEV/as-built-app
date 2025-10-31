import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import TableData from './../components/ui/TableData'
import toast from 'react-hot-toast'; 
import Spinner from './../components/ui/Spinner'

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
     const [selectedPoints, setSelectedPoints] = useState([]);

    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({
            Authorization: `Bearer ${token}`
         }), [token]);

//logique pour selectionner plusieurs points
const handleSelectRow = (id) => {
    setSelectedPoints((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPoints.length === points.length) {
      setSelectedPoints([]);
    } else {
      setSelectedPoints(points.map((p) => p._id));
    }
  };

  //logique pour supprimer plusieurs points
   const handleDeleteSelected = async () => {
    if (selectedPoints.length === 0) {
      toast.error("Aucun point sélectionné.");
      return;
    }

    if (!window.confirm(`Supprimer ${selectedPoints.length} point(s) ?`)) return;

    try {
      const res = await axios.delete("/api/points/deletemultiple", { headers, data: { ids: selectedPoints } });
      toast.success(res.data.message);
      setPoints((prev) => prev.filter((p) => !selectedPoints.includes(p._id)));
      setSelectedPoints([]);
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de la suppression.";
      toast.error(msg);
      console.log('Erreur lors de la suppression multiple :', selectedPoints);
      console.error(err);
    }
  };

  //logique pour charger les points
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
//logique pour supprimer un point avec son id
const handleDelete = useCallback((id) => {
 const confirm = window.confirm(`Êtes-vous sûr de vouloir supprimer la section ${id} ?`);
  if (!confirm) return;
     //setLoading(true);

        axios.delete(`/api/points/${id}`,{headers })
            .then(() => {
                //setPoints(points.filter(point => point._id !== id));
                setPoints((prev) => prev.filter((p) => p._id !== id));
                //setLoading(false);
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
    }, [headers]);

    

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


    if (loading) return <Spinner />;
    if (error) return <div>{error}</div>;

    return (
       <div className='translate-all p-4 flex-1'>
     <TableData data={points} columns={columns} goto='/dashboard/add-point'
                 selectedRows={selectedPoints}
                 onSelectRow={handleSelectRow}
                 onSelectAll={handleSelectAll}
                onDeleteSelected={handleDeleteSelected}
                 handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
                formatDataForExport={formatDataForExport()}  fileNames='Mapref'/>
        </div>
    );
};

export default ListPoints;