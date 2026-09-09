import { useState, useEffect } from 'react';
import api from '../services/api';
import PartidoCard from '../components/PartidoCard';
import { Link } from 'react-router-dom';

export default function Home() {
    const [generalData, setGeneralData] = useState({ top3: [], mi_posicion: null });
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabActivo, setTabActivo] = useState('Hoy');

    useEffect(() => {
        Promise.all([
            api.get('/torneos/general'),
            api.get('/partidos')
        ]).then(([resTop, resPartidos]) => {
            setGeneralData(resTop.data);
            setPartidos(resPartidos.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Cargando...</div>;

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Link to="/torneos" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 20 }}>
                    <span style={{ marginRight: 8 }}>&lt;</span>
                </Link>
                <Link to="/torneos" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 20 }}>
                    Ir a tus torneos
                </Link>
            </div>

            <div className="stat-card">
                <div className="stat-card-title">Ranking del día</div>
                <div className="stat-card-content">
                    <div className="stat-box">
                        <span className="stat-value">#0</span>
                        <span className="stat-label">Puesto</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-value">0</span>
                        <span className="stat-label">Puntos</span>
                    </div>
                    <div className="stat-text">¡Seguí jugando y escalando posiciones para divertirte!</div>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-card-title">Ranking general</div>
                <div className="stat-card-content">
                    <div className="stat-box">
                        <span className="stat-value">#{generalData.mi_posicion?.posicion || '-'}</span>
                        <span className="stat-label">Puesto</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-box">
                        <span className="stat-value">{generalData.mi_posicion?.puntos || 0}</span>
                        <span className="stat-label">Puntos</span>
                    </div>
                    <div className="stat-text">El orgullo de ser el mejor de la tabla está en juego.</div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 16 }}>
                <h2 style={{ fontSize: 24 }}>Partidos</h2>
            </div>

            <div className="pills-container">
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

            <div className="info-alert">
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <span>Podés editar tus resultados hasta el inicio de cada partido</span>
            </div>

            {Object.keys(agrupadosPorFecha).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                    No hay partidos para mostrar en esta fecha.
                </div>
            ) : (
                Object.keys(agrupadosPorFecha).map(fecha => (
                    <div key={fecha} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 16, marginBottom: 12 }}>{fecha}</h3>
                        {agrupadosPorFecha[fecha].map(p => (
                            <PartidoCard key={p.id} partido={p} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
