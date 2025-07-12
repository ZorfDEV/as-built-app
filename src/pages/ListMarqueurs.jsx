import React, { useEffect, useState } from 'react';

const ListMarqueurs = () => {
    const [marqueurs, setMarqueurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Remplacez l'URL par celle de votre API ou source de données
        fetch('/api/marqueurs')
            .then((res) => res.json())
            .then((data) => {
                setMarqueurs(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div>Chargement...</div>;

    return (
        <div className='p-6'>
            <h1>Liste des Marqueurs</h1>
            <ul>
                {marqueurs.map((marqueur) => (
                    <li key={marqueur._id}>
                       <div className='flex p-1 m-2'><p className='p-1.5'>{marqueur._id}</p> <p>{marqueur.name}</p></div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListMarqueurs;