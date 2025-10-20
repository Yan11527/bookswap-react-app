import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { genreService } from '../services/genreService';
import './GenresPage.css';

const GenresPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      setLoading(true);
      const data = await genreService.getGenres();
      setGenres(data);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGenre = async () => {
    if (!newGenreName.trim() || newGenreName.length < 2) {
      alert('Название жанра должно быть не менее 2 символов');
      return;
    }

    try {
      await genreService.createGenre({ name: newGenreName });
      setNewGenreName('');
      setShowModal(false);
      loadGenres();
    } catch (error) {
      console.error('Failed to create genre:', error);
      alert('Ошибка при создании жанра');
    }
  };

  const handleDeleteGenre = async (id) => {
    if (!window.confirm('Удалить этот жанр?')) return;

    try {
      await genreService.deleteGenre(id);
      loadGenres();
    } catch (error) {
      console.error('Failed to delete genre:', error);
      alert('Ошибка при удалении жанра');
    }
  };

  return (
    <div className="genres-page">
      <div className="page-header">
        <div>
          <h1>Жанры</h1>
          <p>Управление жанрами книг</p>
        </div>
        {isAuthenticated && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Добавить жанр
          </Button>
        )}
      </div>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="genres-grid">
          {genres.map(genre => (
            <Card key={genre.id} className="genre-card">
              <div className="genre-info">
                <h3>{genre.name}</h3>
                {isAuthenticated && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteGenre(genre.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Добавить жанр"
      >
        <Input
          label="Название жанра"
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
          placeholder="Например, Фантастика"
        />
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button onClick={handleAddGenre}>
            Добавить
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GenresPage;
