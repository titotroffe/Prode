import { useState } from 'react';
import api from '../services/api';

export default function PartidoCard({ partido }) {
    // Estado inicial de la predicción
    const [predLocal, setPredLocal] = useState(partido.mi_prediccion?.resultado_local_predicho ?? '');
    const [predVisitante, setPredVisitante] = useState(partido.mi_prediccion?.resultado_visitante_predicho ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const isFinalizado = partido.estado === 'finalizado';
    // Si la fecha de kickoff ya pasó, no se puede editar (simulado simple, real en backend)
    const isLocked = isFinalizado || new Date(partido.fecha_kickoff) <= new Date();

    const handleSave = async () => {
        if (predLocal === '' || predVisitante === '') return;
        setSaving(true);
        setSaved(false);
        try {
            await api.post('/predicciones', {
                partido_id: partido.id,
                resultado_local_predicho: parseInt(predLocal),
                resultado_visitante_predicho: parseInt(predVisitante)
            });
            setSaved(true);
        } catch (error) {
            alert(error.response?.data?.error || 'Error al guardar predicción');
        } finally {
            setSaving(false);
        }
    };

    const badgeText = isFinalizado ? 'Finalizado' : (isLocked ? 'En vivo' : 'Próximamente');
    const badgeClass = isFinalizado ? 'badge' : (isLocked ? 'badge badge-green' : 'badge badge-blue');
    const tiempoCentral = isFinalizado ? 'Finalizado' : (isLocked ? 'Primer tiempo' : new Date(partido.fecha_kickoff).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }));

    return (
        <div className="card" style={{ padding: '16px 20px', borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Fase de Grupos</span>
                <span className={badgeClass}>{badgeText}</span>
            </div>
            
            <div className="partido-row">
                <div className="equipo">
                    <img src={`/escudos/${partido.equipo_local.escudo}`} alt={partido.equipo_local.nombre} className="equipo-escudo" />
                    <span className="equipo-nombre">{partido.equipo_local.nombre}</span>
                </div>

                <div className="marcador-container" style={{ flexDirection: 'column', width: 'auto', gap: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tiempoCentral}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {isFinalizado ? (
                            <div style={{ fontSize: '28px', fontWeight: 700 }}>
                                {partido.resultado_local} <span style={{ fontSize: '16px', color: 'var(--text-muted)', margin: '0 8px' }}>vs</span> {partido.resultado_visitante}
                            </div>
                        ) : (
                        // Inputs para predecir si no ha finalizado
                        <>
                            <input 
                                type="number" min="0" className="marcador-input" style={{ width: 40, height: 40, padding: 0 }}
                                value={predLocal} onChange={e => setPredLocal(e.target.value)}
                                disabled={isLocked}
                            />
                            <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>vs</span>
                            <input 
                                type="number" min="0" className="marcador-input" style={{ width: 40, height: 40, padding: 0 }}
                                value={predVisitante} onChange={e => setPredVisitante(e.target.value)}
                                disabled={isLocked}
                            />
                        </>
                    )}
                </div>
            </div>

                <div className="equipo">
                    <img src={`/escudos/${partido.equipo_visitante.escudo}`} alt={partido.equipo_visitante.nombre} className="equipo-escudo" />
                    <span className="equipo-nombre">{partido.equipo_visitante.nombre}</span>
                </div>
            </div>

            {!isLocked && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <button className="btn" onClick={handleSave} disabled={saving} style={{ padding: '8px 16px' }}>
                        {saving ? 'Guardando...' : ((partido.mi_prediccion || saved) ? 'Editar Predicción' : 'Guardar Predicción')}
                    </button>
                    {saved && <div style={{ color: 'var(--success-color)', marginTop: 8, fontSize: 14 }}>¡Guardado!</div>}
                </div>
            )}
            
            {(partido.mi_prediccion || isFinalizado) && (
                <div className="partido-resultado-footer">
                    <span>Tu resultado</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {partido.mi_prediccion ? (
                            <span style={{ fontWeight: 600 }}>{partido.mi_prediccion.resultado_local_predicho} - {partido.mi_prediccion.resultado_visitante_predicho}</span>
                        ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Sin predecir</span>
                        )}
                        
                        {isFinalizado && partido.mi_prediccion && (
                            <span style={{ 
                                backgroundColor: partido.mi_prediccion.puntos_obtenidos > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: partido.mi_prediccion.puntos_obtenidos > 0 ? 'var(--success-color)' : 'var(--error-color)',
                                padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700
                            }}>
                                +{partido.mi_prediccion.puntos_obtenidos} pts
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
