import { useState, useEffect } from 'react';
import api from '../services/api';
import PartidoCard from '../components/PartidoCard';

export default function Fixture() {
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabActivo, setTabActivo] = useState('Hoy');

    useEffect(() => {
        api.get('/partidos')
            .then(res => {
                setPartidos(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">Cargando fixture...</div>;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const partidosFiltrados = partidos.filter(p => {
        const fechaPartidoNormal = new Date(p.fecha_kickoff);
        fechaPartidoNormal.setHours(0, 0, 0, 0);

        if (tabActivo === 'Hoy') {
            return fechaPartidoNormal.getTime() === hoy.getTime();
        } else if (tabActivo === 'Anteriores') {
            return fechaPartidoNormal.getTime() < hoy.getTime();
        } else {
            return fechaPartidoNormal.getTime() > hoy.getTime();
        }
    });

    const agrupadosPorFecha = partidosFiltrados.reduce((acc, p) => {
        const d = new Date(p.fecha_kickoff);
        const dateStr = d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(p);
        return acc;
    }, {});

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Fixture LNF</h1>

            <div className="pills-container" style={{ marginBottom: '2rem' }}>
                {['Anteriores', 'Hoy', 'Próximos'].map(tab => (
                    <button 
                        key={tab}
                        className={`pill ${tabActivo === tab ? 'active' : ''}`}
                        onClick={() => setTabActivo(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {Object.keys(agrupadosPorFecha).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                    No hay partidos para mostrar en esta sección.
                </div>
            ) : (
                Object.keys(agrupadosPorFecha).map(fecha => (
                    <div key={fecha} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 16, marginBottom: 12 }}>{fecha}</h3>
                        {agrupadosPorFecha[fecha].map(p => (
                            <PartidoCard key={p.id} partido={p} readonly={true} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
