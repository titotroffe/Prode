import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', apellido: '', username: '', email: '', password: '', password_confirmation: '', equipo_hincha_id: '' });
    const [equipos, setEquipos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/equipos').then(res => setEquipos(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError('Error al registrarse. Verificá los datos.');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }} className="card">
            <h2 style={{ marginBottom: 20 }}>Crear Cuenta</h2>
            {error && <div style={{ color: 'var(--error-color)', marginBottom: 15 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" className="input-field" placeholder="Nombre" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
                <input 
                    type="text" className="input-field" placeholder="Apellido" required
                    value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})}
                />
                <input 
                    type="text" className="input-field" placeholder="Nombre de Usuario (ej: messi10)" required
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    type="email" className="input-field" placeholder="Email" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" className="input-field" placeholder="Contraseña" required minLength="8"
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <input 
                    type="password" className="input-field" placeholder="Confirmar Contraseña" required minLength="8"
                    value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                />
                <select 
                    className="input-field" required
                    value={formData.equipo_hincha_id} onChange={e => setFormData({...formData, equipo_hincha_id: e.target.value})}
                >
                    <option value="">¿De qué equipo sos hincha?</option>
                    {equipos.map(eq => (
                        <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                    ))}
                </select>
                <button type="submit" className="btn" style={{ width: '100%' }}>Registrarme</button>
            </form>
            <p style={{ marginTop: 20, textAlign: 'center' }}>
                ¿Ya tenés cuenta? <a href="/login" style={{ color: 'var(--blue-link)' }}>Ingresar</a>
            </p>
        </div>
    );
}
