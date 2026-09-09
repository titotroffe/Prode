import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(loginId, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response) {
                setError(`Error ${err.response.status}: ${err.response.data?.message || 'Credenciales incorrectas'}`);
            } else {
                setError(`Error de red: ${err.message}`);
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto' }} className="card">
            <h2 style={{ marginBottom: 20 }}>Iniciar Sesión</h2>
            {error && <div style={{ color: 'var(--error-color)', marginBottom: 15 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className="input-field"
                    placeholder="Usuario o Email" 
                    value={loginId} 
                    onChange={e => setLoginId(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    className="input-field"
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn" style={{ width: '100%' }}>Ingresar</button>
            </form>
            <p style={{ marginTop: 20, textAlign: 'center' }}>
                ¿No tenés cuenta? <a href="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>Registrate</a>
            </p>
        </div>
    );
}
