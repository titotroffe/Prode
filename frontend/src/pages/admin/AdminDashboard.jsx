import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Panel de Administración</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Link to="/admin/noticias" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📰</div>
                    <h2>Gestionar Noticias</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Crear, editar o borrar artículos.</p>
                </Link>
                <Link to="/admin/partidos" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚽</div>
                    <h2>Cargar Resultados</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Anotar goles y cerrar partidos.</p>
                </Link>
                <Link to="/admin/jugadores" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👕</div>
                    <h2>Jugadores</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Cargar jugadores y planteles.</p>
                </Link>
                <Link to="/admin/sanciones" className="stat-card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🟥</div>
                    <h2>Tribunal Disciplina</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Cargar jugadores sancionados.</p>
                </Link>
            </div>
        </div>
    );
}
