import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Estadisticas() {
    const [posiciones, setPosiciones] = useState([]);
    const [goleadores, setGoleadores] = useState([]);
    const [sancionados, setSancionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabActivo, setTabActivo] = useState('Posiciones');

    useEffect(() => {
        Promise.all([
            api.get('/estadisticas/posiciones'),
            api.get('/estadisticas/goleadores'),
            api.get('/estadisticas/sancionados')
        ]).then(([resPos, resGol, resSan]) => {
            setPosiciones(resPos.data);
            setGoleadores(resGol.data);
            setSancionados(resSan.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loading-state">Cargando estadísticas...</div>;

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Estadísticas LNF</h1>

            <div className="pills-container" style={{ marginBottom: '2rem' }}>
                {['Posiciones', 'Goleadores', 'Tribunal de Disciplina'].map(tab => (
                    <button 
                        key={tab}
                        className={`pill ${tabActivo === tab ? 'active' : ''}`}
                        onClick={() => setTabActivo(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {tabActivo === 'Posiciones' && (
                <div className="stat-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '12px 8px' }}>Pos</th>
                                <th style={{ padding: '12px 8px' }}>Equipo</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Pts</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>PJ</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>PG</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>PE</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>PP</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>GF</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>GC</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>DIF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posiciones.map((equipo, idx) => (
                                <tr key={equipo.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{idx + 1}</td>
                                    <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {equipo.escudo && <img src={`/escudos/${equipo.escudo}`} alt={equipo.nombre} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                                        {equipo.nombre}
                                    </td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>{equipo.puntos}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.jugados}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.ganados}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.empatados}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.perdidos}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.goles_favor}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.goles_contra}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{equipo.goles_favor - equipo.goles_contra}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tabActivo === 'Goleadores' && (
                <div className="stat-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '12px 8px' }}>Pos</th>
                                <th style={{ padding: '12px 8px' }}>Jugador</th>
                                <th style={{ padding: '12px 8px' }}>Equipo</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center' }}>Goles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goleadores.map((g, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{idx + 1}</td>
                                    <td style={{ padding: '12px 8px' }}>{g.jugador.nombre} {g.jugador.apellido}</td>
                                    <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {g.jugador.equipo?.escudo && <img src={`/escudos/${g.jugador.equipo.escudo}`} alt={g.jugador.equipo.nombre} style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                                        {g.jugador.equipo?.nombre}
                                    </td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>{g.total_goles}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tabActivo === 'Tribunal de Disciplina' && (
                <div className="stat-card">
                    {sancionados.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No hay jugadores sancionados actualmente.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {sancionados.map(s => (
                                <div key={s.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                                            {s.jugador.nombre} {s.jugador.apellido}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {s.jugador.equipo?.escudo && <img src={`/escudos/${s.jugador.equipo.escudo}`} alt="" style={{ width: 16, height: 16 }} />}
                                            {s.jugador.equipo?.nombre}
                                        </div>
                                        <div style={{ color: 'var(--accent-color, #e74c3c)' }}>
                                            Motivo: {s.motivo}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', background: 'var(--background-alt)', padding: '1rem', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s.fechas_suspension}</div>
                                        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Fechas</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
