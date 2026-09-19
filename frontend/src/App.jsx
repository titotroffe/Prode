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

const isAdmin = (user) => Number(user?.is_admin) === 1;

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-state">Cargando...</div>;
    return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-state">Cargando...</div>;
    return user && isAdmin(user) ? children : <Navigate to="/" replace />;
}

function Layout({ children }) {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <header className="site-header">
                <div className="header-inner">
                    <Link to="/" className="header-brand" onClick={closeMenu}>
                        <span className="brand-mark" aria-hidden="true">L</span>
                        <span><strong>Archivero</strong><small>LNF</small></span>
                    </Link>

                    <button
                        className={`burger-menu ${isMenuOpen ? 'is-open' : ''}`}
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-label="Abrir menú"
                        aria-expanded={isMenuOpen}
                    >
                        <span></span><span></span><span></span>
                    </button>

                    <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Navegación principal">
                        <Link to="/" onClick={closeMenu}>Noticias</Link>
                        <Link to="/estadisticas" onClick={closeMenu}>Estadísticas</Link>
                        <Link to="/fixture" onClick={closeMenu}>Fixture</Link>
                        <Link to="/prode" onClick={closeMenu}>Prode</Link>
                        {user ? (
                            <>
                                {isAdmin(user) ? <Link className="admin-link" to="/admin" onClick={closeMenu}>Administración</Link> : null}
                                <Link to="/perfil" onClick={closeMenu}>Mi perfil</Link>
                                <button className="nav-action nav-logout" onClick={() => { closeMenu(); logout(); }}>Salir</button>
                            </>
                        ) : (
                            <Link className="nav-action" to="/login" onClick={closeMenu}>Ingresar</Link>
                        )}
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
                            {isDarkMode ? '☀' : '◐'}
                        </button>
                    </nav>
                </div>
            </header>
            <main className="container app-main">{children}</main>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/fixture" element={<Fixture />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/prode" element={<PrivateRoute><MisTorneos /></PrivateRoute>} />
                    <Route path="/torneos/:codigo" element={<PrivateRoute><TorneoView /></PrivateRoute>} />
                    <Route path="/join/:codigo" element={<PrivateRoute><JoinTorneo /></PrivateRoute>} />
                    <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
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