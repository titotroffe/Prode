import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Home() {
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/noticias')
            .then(res => {
                setNoticias(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">Cargando noticias...</div>;

    return (
        <div className="home-portal" style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Últimas Novedades</h1>
            
            {noticias.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No hay noticias publicadas todavía.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {noticias.map(noticia => (
                        <div key={noticia.id} className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {noticia.imagen_url && (
                                <img 
                                    src={noticia.imagen_url} 
                                    alt={noticia.titulo} 
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                />
                            )}
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ 
                                        background: noticia.tipo === 'efemeride' ? 'var(--accent-color, #e74c3c)' : 'var(--primary-color, #3498db)', 
                                        color: 'white', 
                                        padding: '0.2rem 0.5rem', 
                                        borderRadius: '4px', 
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {noticia.tipo}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{noticia.titulo}</h2>
                                <div 
                                    style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}
                                    dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
