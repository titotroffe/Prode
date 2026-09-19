import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ManageSanciones() {
    const [sanciones, setSanciones] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [formData, setFormData] = useState({ jugador_id: '', motivo: '', fechas_suspension: 1 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [resSanciones, resJugadores] = await Promise.all([
                api.get('/estadisticas/sancionados'), // We can reuse the public endpoint or create an admin one
                api.get('/jugadores')
            ]);
            setSanciones(resSanciones.data);
            setJugadores(resJugadores.data);
        } catch(error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/sanciones', formData);
            setFormData({ jugador_id: '', motivo: '', fechas_suspension: 1 });
            loadData();
            alert('Sanción guardada');
        } catch (error) {
            console.error(error);
            alert('Error al guardar');
        }
    };

    const handleLiftSancion = async (id) => {
        if(confirm('¿Marcar sanción como cumplida?')) {
            await api.put(`/admin/sanciones/${id}`, { estado: 'cumplida' });
            loadData();
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1>Tribunal de Disciplina</h1>
            <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <select className="input-field" value={formData.jugador_id} onChange={e => setFormData({...formData, jugador_id: e.target.value})} required>
                    <option value="">Seleccionar Jugador...</option>
                    {jugadores.map(j => (
                        <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
                    ))}
                </select>
                <input className="input-field" placeholder="Motivo de la sanción" value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})} required />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label>Fechas:</label>
                    <input type="number" min="1" className="input-field" style={{ width: '100px' }} value={formData.fechas_suspension} onChange={e => setFormData({...formData, fechas_suspension: parseInt(e.target.value)})} required />
                </div>
                <button type="submit" className="btn btn-primary">Sancionar Jugador</button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Sanciones Vigentes</h3>
                {sanciones.map(s => (
                    <div key={s.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{s.jugador.nombre} {s.jugador.apellido}</strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Motivo: {s.motivo} ({s.fechas_suspension} fechas)</div>
                        </div>
                        <button onClick={() => handleLiftSancion(s.id)} className="btn btn-secondary">Levantar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
