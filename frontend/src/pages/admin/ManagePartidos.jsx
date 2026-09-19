import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManagePartidos() {
    const [partidos, setPartidos] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'edit'
    const [currentPartido, setCurrentPartido] = useState(null);
    const [formData, setFormData] = useState({ 
        equipo_local_id: '', 
        equipo_visitante_id: '', 
        fecha_kickoff: '', 
        resultado_local: 0, 
        resultado_visitante: 0, 
        goles: [],
        jugadores: [] // Array of selected jugador IDs for the lineup
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [resPartidos, resJugadores, resEquipos] = await Promise.all([
            api.get('/admin/partidos'),
            api.get('/jugadores'),
            api.get('/equipos')
        ]);
        setPartidos(resPartidos.data);
        setJugadores(resJugadores.data);
        setEquipos(resEquipos.data);
    };

    const handleEdit = (partido) => {
        setCurrentPartido(partido);
        setFormData({
            equipo_local_id: partido.equipo_local_id,
            equipo_visitante_id: partido.equipo_visitante_id,
            fecha_kickoff: partido.fecha_kickoff,
            resultado_local: partido.resultado_local || 0,
            resultado_visitante: partido.resultado_visitante || 0,
            goles: [], // We start fresh with goals for simplicity in this demo
            jugadores: partido.jugadores ? partido.jugadores.map(j => j.id) : []
        });
        setViewMode('edit');
    };

    const handleCreateNew = () => {
        setCurrentPartido(null);
        setFormData({
            equipo_local_id: '', 
            equipo_visitante_id: '', 
            fecha_kickoff: '', 
            resultado_local: 0, 
            resultado_visitante: 0, 
            goles: [],
            jugadores: []
        });
        setViewMode('create');
    };

    const addGol = () => {
        setFormData({ ...formData, goles: [...formData.goles, { jugador_id: '', cantidad: 1 }] });
    };

    const handleGolChange = (index, field, value) => {
        const newGoles = [...formData.goles];
        newGoles[index][field] = value;
        setFormData({ ...formData, goles: newGoles });
    };

    const toggleJugador = (jugadorId) => {
        const selected = formData.jugadores.includes(jugadorId);
        if (selected) {
            setFormData({ ...formData, jugadores: formData.jugadores.filter(id => id !== jugadorId) });
        } else {
            setFormData({ ...formData, jugadores: [...formData.jugadores, jugadorId] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (viewMode === 'create') {
                await api.post('/admin/partidos', formData);
                alert('Partido creado exitosamente');
            } else {
                await api.put(`/admin/partidos/${currentPartido.id}`, formData);
                alert('Partido actualizado correctamente');
            }
            setViewMode('list');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el partido');
        }
    };

    // Filter players that belong to local or visitor team
    const eqLocalId = parseInt(formData.equipo_local_id);
    const eqVisitanteId = parseInt(formData.equipo_visitante_id);
    const availablePlayers = jugadores.filter(j => j.equipo_id === eqLocalId || j.equipo_id === eqVisitanteId);

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1>Gestionar Partidos y Planillas</h1>
            
            {viewMode === 'list' && (
                <>
                    <button onClick={handleCreateNew} className="btn btn-primary" style={{ marginTop: '1rem' }}>+ Alta de Nuevo Partido</button>
                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {partidos.map(p => (
                            <div key={p.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{p.equipo_local?.nombre} vs {p.equipo_visitante?.nombre}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(p.fecha_kickoff).toLocaleString()} - Estado: {p.estado}</div>
                                </div>
                                <button onClick={() => handleEdit(p)} className="btn btn-secondary">Cargar Planilla / Resultado</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {viewMode !== 'list' && (
                <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <h3>{viewMode === 'create' ? 'Crear Nuevo Partido' : `Cargar Resultado: ${currentPartido.equipo_local?.nombre} vs ${currentPartido.equipo_visitante?.nombre}`}</h3>
                    
                    {viewMode === 'create' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Equipo Local</label>
                                <select className="input-field" value={formData.equipo_local_id} onChange={e => setFormData({...formData, equipo_local_id: e.target.value})} required>
                                    <option value="">Seleccionar...</option>
                                    {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>Equipo Visitante</label>
                                <select className="input-field" value={formData.equipo_visitante_id} onChange={e => setFormData({...formData, equipo_visitante_id: e.target.value})} required>
                                    <option value="">Seleccionar...</option>
                                    {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                                </select>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>Fecha y Hora</label>
                                <input type="datetime-local" className="input-field" value={formData.fecha_kickoff ? new Date(new Date(formData.fecha_kickoff).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setFormData({...formData, fecha_kickoff: e.target.value})} required />
                            </div>
                        </div>
                    )}

                    {/* Solo mostrar planilla si hay equipos seleccionados */}
                    {(eqLocalId || eqVisitanteId) ? (
                        <>
                            <h4 style={{ marginTop: '1rem' }}>Planilla (Jugadores Convocados)</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tilda los jugadores que participan de este partido para que puedan anotar goles.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--background-alt)', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <h5>Local</h5>
                                    {jugadores.filter(j => j.equipo_id === eqLocalId).map(j => (
                                        <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" id={`jug-${j.id}`} checked={formData.jugadores.includes(j.id)} onChange={() => toggleJugador(j.id)} />
                                            <label htmlFor={`jug-${j.id}`}>{j.nombre} {j.apellido}</label>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h5>Visitante</h5>
                                    {jugadores.filter(j => j.equipo_id === eqVisitanteId).map(j => (
                                        <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <input type="checkbox" id={`jug-${j.id}`} checked={formData.jugadores.includes(j.id)} onChange={() => toggleJugador(j.id)} />
                                            <label htmlFor={`jug-${j.id}`}>{j.nombre} {j.apellido}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : null}

                    {viewMode === 'edit' && (
                        <>
                            <h4 style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>Resultado Final</h4>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <label>Goles Local:</label>
                                <input type="number" min="0" className="input-field" value={formData.resultado_local} onChange={e => setFormData({...formData, resultado_local: parseInt(e.target.value)})} required />
                                
                                <label>Goles Visitante:</label>
                                <input type="number" min="0" className="input-field" value={formData.resultado_visitante} onChange={e => setFormData({...formData, resultado_visitante: parseInt(e.target.value)})} required />
                            </div>

                            <h4>Goleadores del partido</h4>
                            {formData.goles.map((g, index) => (
                                <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                    <select className="input-field" value={g.jugador_id} onChange={e => handleGolChange(index, 'jugador_id', e.target.value)} required>
                                        <option value="">Seleccionar Jugador de la planilla...</option>
                                        {availablePlayers.filter(j => formData.jugadores.includes(j.id)).map(j => (
                                            <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
                                        ))}
                                    </select>
                                    <input type="number" min="1" className="input-field" placeholder="Cantidad" value={g.cantidad} onChange={e => handleGolChange(index, 'cantidad', parseInt(e.target.value))} required />
                                </div>
                            ))}
                            <button type="button" onClick={addGol} className="btn btn-secondary" style={{ width: 'fit-content' }}>+ Agregar Goleador</button>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">{viewMode === 'create' ? 'Crear Partido' : 'Guardar Cambios'}</button>
                        <button type="button" onClick={() => setViewMode('list')} className="btn btn-secondary">Cancelar</button>
                    </div>
                </form>
            )}
        </div>
    );
}
