import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TorneoView() {
    const { codigo: id } = useParams();
    const { user } = useAuth();
    const [torneo, setTorneo] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.get(`/torneos/${id}`),
            api.get('/partidos')
        ]).then(([resTorneo, resPartidos]) => {
            setTorneo(resTorneo.data.torneo);
            setRanking(resTorneo.data.ranking);
            
            // Solo nos interesan los finalizados para mostrar predicciones de los demás
            const finalizados = resPartidos.data.filter(p => p.estado === 'finalizado');
            setPartidos(finalizados);
            
            setLoading(false);
        }).catch(err => {
            console.error(err);
            alert('Error al cargar torneo');
            setLoading(false);
        });
    }, [id]);

    const handleLeave = () => {
        if (window.confirm('¿Estás seguro de que querés abandonar este torneo?')) {
            api.post(`/torneos/${torneo.id}/leave`)
                .then(() => {
                    alert('Has abandonado el torneo.');
                    window.location.href = '/torneos';
                })
                .catch(err => alert(err.response?.data?.error || 'Error al abandonar'));
        }
    };

    if (loading) return <div>Cargando detalle del torneo...</div>;
    if (!torneo) return <div>Torneo no encontrado.</div>;

    // Obtener array de IDs de los participantes de este torneo
    const participantesIds = ranking.map(r => r.user_id);

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Link to="/torneos" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 20, width: 'auto' }}>
                    <span style={{ marginRight: 8 }}>&lt;</span>
                </Link>
                <div style={{ display: 'flex', gap: 8 }}>
                    {torneo.tipo === 'privado' && torneo.creador_id !== user?.id && (
                        <button 
                            className="btn btn-secondary" 
                            style={{ width: 'auto', borderRadius: 20, padding: '8px 12px' }}
                            onClick={handleLeave}
                            title="Abandonar torneo"
                        >
                            ⋮
                        </button>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, textTransform: 'uppercase', marginBottom: 12 }}>
                    {torneo.nombre}
                </h2>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
                <button 
                    className="btn btn-secondary" 
                    style={{ border: 'none', padding: 0, color: 'var(--primary-color)', fontSize: 16, fontWeight: 600 }}
                    onClick={() => {
                        const link = `${window.location.origin}/join/${torneo.codigo_invitacion}`;
                        navigator.clipboard.writeText(link);
                        alert('¡Link de invitación copiado al portapapeles! Ya podés compartirlo.');
                    }}
                >
                    Compartí el ranking 🔗
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px', marginBottom: 16, fontWeight: 700, fontSize: 16 }}>
                <span>Integrantes</span>
                <span>Puntos</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ranking.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                        Sin participantes
                    </div>
                ) : (
                    ranking.map((u) => (
                        <div key={u.user_id} style={{ 
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                            padding: '16px', borderBottom: '1px solid var(--border-color)',
                            backgroundColor: u.user_id === user?.id ? 'var(--surface-hover)' : 'transparent'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontWeight: 700, fontSize: 16 }}>{u.posicion}º</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 16 }}>{u.name}</span>
                                        {u.user_id === user?.id && <span className="pill-badge-vos">VOS</span>}
                                    </div>
                                    {u.user_id === torneo.creador_id && (
                                        <span style={{ fontSize: 12, color: 'var(--primary-color)' }}>Organizador</span>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 18, fontWeight: 700 }}>{u.puntos}</span>
                                <span style={{ color: 'var(--text-muted)' }}>&gt;</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="fab-container">
                <Link to="/" className="btn fab-button" style={{ borderRadius: 12, padding: '16px' }}>
                    Seguí completando resultados
                </Link>
            </div>

                <div style={{ flex: '1 1 500px' }}>
                    <h3 style={{ marginBottom: 15 }}>Resultados y Predicciones (Partidos Finalizados)</h3>
                    {partidos.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            No hay partidos finalizados aún.
                        </div>
                    ) : (
                        partidos.map(p => (
                            <div key={p.id} className="card">
                                <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
                                    {p.equipo_local.nombre} {p.resultado_local} - {p.resultado_visitante} {p.equipo_visitante.nombre}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 5 }}>Predicciones de los participantes:</div>
                                <div style={{ maxHeight: 150, overflowY: 'auto', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 4 }}>
                                    {p.predicciones && p.predicciones.filter(pred => participantesIds.includes(pred.user_id)).map(pred => (
                                        <div key={pred.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '4px 0' }}>
                                            <span>{pred.user?.name}</span>
                                            <span>
                                                <strong>{pred.resultado_local_predicho} - {pred.resultado_visitante_predicho}</strong> 
                                                <span style={{ color: 'var(--success-color)', marginLeft: 10 }}>+{pred.puntos_obtenidos} pts</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
        </div>
    );
}
