import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function MisTorneos() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [codigoJoin, setCodigoJoin] = useState('');
    const [showForms, setShowForms] = useState(false);

    const fetchTorneos = () => {
        setLoading(true);
        api.get('/torneos')
           .then(res => setTorneos(res.data))
           .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTorneos();
    }, []);

    const crearTorneo = async (e) => {
        e.preventDefault();
        if(!nuevoNombre) return;
        try {
            await api.post('/torneos', { nombre: nuevoNombre });
            setNuevoNombre('');
            fetchTorneos();
        } catch(e) {
            alert('Error al crear torneo');
        }
    }

    const unirseTorneo = async (e) => {
        e.preventDefault();
        if(!codigoJoin) return;
        try {
            await api.post('/torneos/join', { codigo_invitacion: codigoJoin });
            setCodigoJoin('');
            fetchTorneos();
        } catch(e) {
            alert(e.response?.data?.message || 'Código inválido o ya estás unido');
        }
    }

    if (loading) return <div>Cargando torneos...</div>;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 20, width: 'auto' }}>
                    <span style={{ marginRight: 8 }}>&lt;</span>
                </Link>
                <button 
                    className="btn" 
                    style={{ width: 'auto', borderRadius: 20, padding: '8px 16px', fontSize: 14 }}
                    onClick={() => setShowForms(!showForms)}
                >
                    {showForms ? 'Cancelar' : 'Crear nuevo torneo'}
                </button>
            </div>

            <h2 style={{ fontSize: 24, marginBottom: 20 }}>Tus torneos</h2>

            {showForms && (
                <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
                    <div className="card" style={{ flex: '1 1 300px' }}>
                        <h3>Crear Torneo Privado</h3>
                        <form onSubmit={crearTorneo} style={{ marginTop: 15 }}>
                            <input 
                                type="text" className="input-field" placeholder="Nombre del torneo" 
                                value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required
                            />
                            <button type="submit" className="btn">Crear</button>
                        </form>
                    </div>

                    <div className="card" style={{ flex: '1 1 300px' }}>
                        <h3>Unirse a un Torneo</h3>
                        <form onSubmit={unirseTorneo} style={{ marginTop: 15 }}>
                            <input 
                                type="text" className="input-field" placeholder="Código de invitación" 
                                value={codigoJoin} onChange={e => setCodigoJoin(e.target.value)} required
                            />
                            <button type="submit" className="btn btn-secondary" style={{border: '1px solid var(--blue-link)'}}>Unirse</button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {torneos.map(t => (
                    <Link to={`/torneos/${t.id}`} key={t.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card" style={{ padding: 20, borderRadius: 20, margin: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                                <div>
                                    <span className="pill-badge">{t.tipo === 'general' ? 'GENERAL' : '16vos'}</span>
                                    <h3 style={{ fontSize: 18, margin: '4px 0', textTransform: 'uppercase' }}>{t.nombre}</h3>
                                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Amistoso</span>
                                </div>
                                <span style={{ fontSize: 36 }}>🏆</span>
                            </div>
                            
                            <div>
                                {t.top1 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 8, color: 'var(--text-muted)' }}>
                                        <span><strong style={{ color: 'var(--text-main)' }}>#1</strong> {t.top1.name}</span>
                                        <span>{t.top1.puntos} pts</span>
                                    </div>
                                )}
                                {t.mi_posicion && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--primary-color)', fontWeight: 500 }}>
                                        <span><strong>#{t.mi_posicion.posicion}</strong> Vos {t.mi_posicion.posicion > 1 ? '+ otras' : ''}</span>
                                        <span>{t.mi_posicion.puntos} pts</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
