import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Perfil() {
    const { user, updateProfile } = useAuth();
    const [equipos, setEquipos] = useState([]);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        apellido: user?.apellido || '',
        equipo_hincha_id: user?.equipo_hincha_id || '',
        current_password: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        api.get('/equipos').then(res => setEquipos(res.data));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await updateProfile(formData);
            setMessage({ type: 'success', text: response.message || 'Perfil actualizado exitosamente' });
            setFormData(prev => ({ ...prev, current_password: '', password: '', password_confirmation: '' }));
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'Error al actualizar el perfil' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 500, margin: '40px auto' }} className="card">
            <h2 style={{ marginBottom: 20 }}>Mi Perfil</h2>
            
            {message.text && (
                <div style={{ 
                    padding: 12, 
                    marginBottom: 20, 
                    borderRadius: 8,
                    backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
                    border: `1px solid ${message.type === 'success' ? 'var(--success-color)' : 'var(--error-color)'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Nombre</label>
                    <input 
                        type="text" 
                        name="name"
                        className="input-field" 
                        style={{ marginBottom: 0 }}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Apellido</label>
                    <input 
                        type="text" 
                        name="apellido"
                        className="input-field" 
                        style={{ marginBottom: 0 }}
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Usuario</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        style={{ marginBottom: 0, backgroundColor: 'var(--surface-hover)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                        value={user?.username || ''}
                        disabled
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Equipo del que sos hincha</label>
                    <select 
                        name="equipo_hincha_id"
                        className="input-field"
                        style={{ marginBottom: 0 }}
                        value={formData.equipo_hincha_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccioná un equipo</option>
                        {equipos.map(eq => (
                            <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                        ))}
                    </select>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />
                <h3 style={{ marginBottom: 16, fontSize: 16 }}>Cambiar Contraseña</h3>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Contraseña Actual</label>
                    <input 
                        type="password" 
                        name="current_password"
                        className="input-field" 
                        style={{ marginBottom: 0 }}
                        value={formData.current_password}
                        onChange={handleChange}
                        placeholder="Requerida para cambiar contraseña"
                        required={!!formData.password}
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Nueva Contraseña</label>
                    <input 
                        type="password" 
                        name="password"
                        className="input-field" 
                        style={{ marginBottom: 0 }}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Opcional"
                        minLength="8"
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Confirmar Nueva Contraseña</label>
                    <input 
                        type="password" 
                        name="password_confirmation"
                        className="input-field" 
                        style={{ marginBottom: 0 }}
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required={!!formData.password}
                        placeholder="Repetí la nueva contraseña"
                        minLength="8"
                    />
                </div>

                <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}
