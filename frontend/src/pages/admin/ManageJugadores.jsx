import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageJugadores() {
    const [jugadores, setJugadores] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [formData, setFormData] = useState({ equipo_id: '', nombre: '', apellido: '', dni: '', posicion: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [resJugadores, resEquipos] = await Promise.all([
                api.get('/jugadores'),
                api.get('/equipos')
            ]);
            setJugadores(resJugadores.data);
            setEquipos(resEquipos.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/jugadores', formData);
            setFormData({ equipo_id: '', nombre: '', apellido: '', dni: '', posicion: '' });
            loadData();
            alert('Jugador guardado exitosamente');
        } catch (error) {
            console.error(error);
            alert('Error al guardar el jugador');
        }
    };

    const handleDelete = async (id) => {
        if(confirm('¿Eliminar jugador de forma permanente?')) {
            await api.delete(`/admin/jugadores/${id}`);
            loadData();
        }
    };

    // Agrupar jugadores por equipo para mostrar más ordenado
    const agrupadosPorEquipo = jugadores.reduce((acc, j) => {
        const eqId = j.equipo_id;
        if (!acc[eqId]) {
            acc[eqId] = [];
        }
        acc[eqId].push(j);
        return acc;
    }, {});

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1>Gestionar Jugadores</h1>
            
            <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Alta de Jugador</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input className="input-field" placeholder="Nombre" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                    <input className="input-field" placeholder="Apellido" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} required />
                    <input className="input-field" placeholder="DNI (Opcional)" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} />
                    <input className="input-field" placeholder="Posición (Ej: Arquero, Delantero)" value={formData.posicion} onChange={e => setFormData({...formData, posicion: e.target.value})} />
                </div>
                <select className="input-field" value={formData.equipo_id} onChange={e => setFormData({...formData, equipo_id: e.target.value})} required>
                    <option value="">Seleccionar Equipo...</option>
                    {equipos.map(e => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Cargar Jugador</button>
            </form>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Planteles</h3>
                {equipos.map(equipo => {
                    const plantel = agrupadosPorEquipo[equipo.id];
                    if (!plantel) return null;
                    return (
                        <div key={equipo.id} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '4px' }}>
                                {equipo.escudo && <img src={`/escudos/${equipo.escudo}`} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
                                {equipo.nombre} ({plantel.length})
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                {plantel.map(j => (
                                    <div key={j.id} style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{j.nombre} {j.apellido}</div>
                                            {j.posicion && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.posicion}</div>}
                                        </div>
                                        <button onClick={() => handleDelete(j.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: '4px' }} title="Eliminar">🗑️</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
