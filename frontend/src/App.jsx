import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Estadisticas from './pages/Estadisticas';
import Fixture from './pages/Fixture';
import MisTorneos from './pages/MisTorneos';
import TorneoView from './pages/TorneoView';
import Perfil from './pages/Perfil';
import JoinTorneo from './pages/JoinTorneo';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageNoticias from './pages/admin/ManageNoticias';
import ManagePartidos from './pages/admin/ManagePartidos';
import ManageSanciones from './pages/admin/ManageSanciones';
import ManageJugadores from './pages/admin/ManageJugadores';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="loading-state">Cargando...</div>;
    return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="loading-state">Cargando...</div>;
    return (user && user.is_admin) ? children : <Navigate to="/" />;
}

function Layout({ children }) {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link to="/" className="header-brand" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Archivero LNF</Link>
                </div>
                
                <button 
                    className="burger-menu" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                    style={{ display: 'none' }} // Assuming desktop first for simplicity, handled in CSS
                >
                    ☰
                </button>
                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>Noticias</Link>
                    <Link to="/estadisticas" onClick={() => setIsMenuOpen(false)}>Estadísticas</Link>
                    <Link to="/fixture" onClick={() => setIsMenuOpen(false)}>Fixture</Link>
                    <Link to="/prode" onClick={() => setIsMenuOpen(false)}>Prode</Link>
                    
                    {user ? (
                        <>
                            {user.is_admin && (
                                <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary-color)' }}>🛠️ Admin</Link>
                            )}
                            <Link to="/perfil" onClick={() => setIsMenuOpen(false)}>Mi Perfil</Link>
                            <button 
                                onClick={() => { logout(); setIsMenuOpen(false); }} 
                                style={{ background: 'var(--accent-color, #e74c3c)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ background: 'var(--primary-color, #3498db)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none' }}>Iniciar Sesión</Link>
                    )}

                    <button 
                        onClick={() => { toggleTheme(); setIsMenuOpen(false); }} 
                        style={{ background: 'none', border: '1px solid currentColor', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: '0.4rem 0.8rem', borderRadius: '4px' }}
                    >
                        {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
                    </button>
                </nav>
            </header>
            <main className="container" style={{ padding: '2rem' }}>
                {children}
            </main>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/fixture" element={<Fixture />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Private Routes (Prode & Perfil) */}
                    <Route path="/prode" element={<PrivateRoute><MisTorneos /></PrivateRoute>} />
                    <Route path="/torneos/:codigo" element={<PrivateRoute><TorneoView /></PrivateRoute>} />
                    <Route path="/join/:codigo" element={<PrivateRoute><JoinTorneo /></PrivateRoute>} />
                    <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/noticias" element={<AdminRoute><ManageNoticias /></AdminRoute>} />
                    <Route path="/admin/jugadores" element={<AdminRoute><ManageJugadores /></AdminRoute>} />
                    <Route path="/admin/partidos" element={<AdminRoute><ManagePartidos /></AdminRoute>} />
                    <Route path="/admin/sanciones" element={<AdminRoute><ManageSanciones /></AdminRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
