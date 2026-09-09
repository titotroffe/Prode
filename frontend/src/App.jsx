import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MisTorneos from './pages/MisTorneos';
import TorneoView from './pages/TorneoView';
import Perfil from './pages/Perfil';
import JoinTorneo from './pages/JoinTorneo';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Cargando...</div>;
    return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a href="/" className="header-brand">ProdeLibre</a>
                </div>
                
                {user && (
                    <>
                        <button 
                            className="burger-menu" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Menu"
                        >
                            ☰
                        </button>
                        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                            <a href="/" onClick={() => setIsMenuOpen(false)}>Home</a>
                            <a href="/torneos" onClick={() => setIsMenuOpen(false)}>Mis Torneos</a>
                            <a href="/perfil" onClick={() => setIsMenuOpen(false)}>Mi Perfil</a>
                            <button 
                                onClick={() => { toggleTheme(); setIsMenuOpen(false); }} 
                                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
                            >
                                {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                            </button>
                            <button 
                                onClick={() => { logout(); setIsMenuOpen(false); }} 
                                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
                            >
                                Salir
                            </button>
                        </nav>
                    </>
                )}
            </header>
            <main className="container">
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/torneos" element={<PrivateRoute><MisTorneos /></PrivateRoute>} />
                    <Route path="/torneos/:codigo" element={<PrivateRoute><TorneoView /></PrivateRoute>} />
                    <Route path="/join/:codigo" element={<PrivateRoute><JoinTorneo /></PrivateRoute>} />
                    <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
