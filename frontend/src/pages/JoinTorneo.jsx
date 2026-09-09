import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function JoinTorneo() {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        api.post('/torneos/join', { codigo_invitacion: codigo })
            .then(res => {
                navigate(`/torneos/${res.data.torneo.id}`);
            })
            .catch(err => {
                setError(err.response?.data?.message || err.response?.data?.error || 'Error al unirse al torneo');
                setTimeout(() => navigate('/torneos'), 2000);
            });
    }, [codigo, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
            {error ? (
                <div style={{ color: 'var(--error-color)' }}>{error}</div>
            ) : (
                <div style={{ fontSize: 18 }}>Validando invitación y uniéndote al torneo... 🏆</div>
            )}
        </div>
    );
}
