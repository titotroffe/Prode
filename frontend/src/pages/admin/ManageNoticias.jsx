import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../services/api';

export default function ManageNoticias() {
    const [noticias, setNoticias] = useState([]);
    const [formData, setFormData] = useState({ titulo: '', contenido: '', tipo: 'noticia', imagen_url: '' });

    useEffect(() => {
        loadNoticias();
    }, []);

    const loadNoticias = () => api.get('/noticias').then(res => setNoticias(res.data));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/noticias', formData);
            setFormData({ titulo: '', contenido: '', tipo: 'noticia', imagen_url: '' });
            loadNoticias();
            alert('Noticia guardada');
        } catch (error) {
            console.error(error);
            alert('Error al guardar');
        }
    };

    const handleDelete = async (id) => {
        if(confirm('¿Borrar noticia?')) {
            await api.delete(`/admin/noticias/${id}`);
            loadNoticias();
        }
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            [{ 'align': [] }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1>Gestionar Noticias</h1>
            <form onSubmit={handleSubmit} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <input className="input-field" placeholder="Título" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
                
                <div style={{ background: 'white', color: 'black' }}>
                    <ReactQuill 
                        theme="snow" 
                        value={formData.contenido} 
                        onChange={(content) => setFormData({...formData, contenido: content})}
                        modules={modules}
                        style={{ height: '300px', marginBottom: '40px' }}
                    />
                </div>

                <select className="input-field" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="noticia">Noticia</option>
                    <option value="efemeride">Efeméride</option>
                </select>
                <input className="input-field" placeholder="URL de Imagen (opcional)" value={formData.imagen_url} onChange={e => setFormData({...formData, imagen_url: e.target.value})} />
                <button type="submit" className="btn btn-primary">Publicar</button>
            </form>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {noticias.map(n => (
                    <div key={n.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <div><strong>{n.titulo}</strong> ({n.tipo})</div>
                        <button onClick={() => handleDelete(n.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Borrar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
