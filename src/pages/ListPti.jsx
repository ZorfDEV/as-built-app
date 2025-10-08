import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import TableData from './../components/ui/TableData'
import WidgetContainer from '../components/ui/WidgetContainer';
import CustomBarChart from '../components/ui/CustomBarChart';
import CustomPieChart from '../components/ui/CustomPieChart';
import toast from 'react-hot-toast'; 
// eslint-disable-next-line no-unused-vars
import {  motion, scale} from "motion/react"

const ListPoints = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const[endpoint,setEndpoint]=useState();
    const columns = [
        { key: '_id', title: 'ID' },
        { key: 'name', title: 'Nom' },
        { key: 'status', title: 'Statut' },
        { key: 'section_name', title: 'Section' },
        { key: 'createdAt', title: 'Créé le:' },
    ];

     const token = localStorage.getItem('token');
            const headers = useMemo(() => ({
                    Authorization: `Bearer ${token}`
                 }), [token]);

                  const containerVariants ={
    hidden:{opacity: 0, scale:0.9},
    visible: {
      opacity:1,
      scale:1,
      transition:{
        type:"spring",
        stiffness:80,
        damping:20,

        staggerChildren:0.4,
      },
    }
  }
 const itemVariants ={
 hidden:{opacity: 0, y:20},
    visible: {
      opacity:1,
      y:0,
      transition:{
        duration:0.5,
        ease:"easeOut",
      },
    }
  }

    useEffect(() => {
        axios.get('/api/points/pointsofcup',{headers})
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

        axios.delete(`/api/points/${id}`,{headers})
            .then(() => {
                setPoints(points.filter(point => point._id !== id));
                toast.success('Point supprimé avec succès');
            })
            .catch(error => {
            if (error?.response?.status === 403) {
                toast.error('Vous devez être administrateur pour supprimer un PI');
            } else {
            toast.error("Erreur lors de la suppression du marqueur");
            }
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
    <div className='p-6 '>
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    <WidgetContainer endpoint="/api/points/incidents/total" headers={headers} refreshInterval={60000} />
    <WidgetContainer endpoint="/api/points/incidents/active" headers={headers} refreshInterval={60000} />
    <WidgetContainer endpoint="/api/points/incidents/pending" headers={headers} refreshInterval={60000} />
    <WidgetContainer endpoint="/api/points/incidents/resolved" headers={headers} refreshInterval={60000} />
    </div>
     <motion.div className='translate-all flex flex-col gap-4 duration-300  mt-4  xl:flex-row' variants={containerVariants} initial="hidden" animate="visible">
         <CustomBarChart incidents={points} variants={itemVariants} />
         <CustomPieChart incidents={points} variants={itemVariants} />
       </motion.div>

    <motion.div className='flex flex-row mt-4 translate-all  duration-300 ' variants={containerVariants} initial="hidden" animate="visible">
     <TableData data={points} columns={columns} goto='/dashboard/add-point'
                 handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}
                  formatDataForExport={formatDataForExport()}  fileNames='Mapref'/>
    </motion.div>
        </div>
    );
};

export default ListPoints;
