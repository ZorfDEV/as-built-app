import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListPoints = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/points')
            .then(response => {
                setPoints(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Erreur lors du chargement des points');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Liste des Points</h2>
            <ul>
                {points.map(point => (
                    <li key={point.id}>
                        {point.name} {/* Adaptez selon la structure de vos données */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListPoints;