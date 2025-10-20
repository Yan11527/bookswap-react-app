import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookList from '../components/books/BookList';
import BookDetail from '../components/books/BookDetail';
import ExchangeForm from '../components/exchanges/ExchangeForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { bookService } from '../services/bookService';
import { genreService } from '../services/genreService';
import './BooksPage.css';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  // ДВА отдельных состояния для модальных окон
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [currentPage]);

  const loadGenres = async () => {
    try {
      const data = await genreService.getGenres();
      setGenres(data);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks(currentPage, 20);
      setBooks(Array.isArray(data) ? data : data.content || []);
      setTotalPages(data.totalPages || Math.ceil((data.length || 0) / 20));
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFilter = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? null : genreId);
    setCurrentPage(0);
  };

  // Клик на книгу - открываем детали
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  // Кнопка "Обменяться" в деталях книги
  const handleExchangeClick = () => {
    if (!isAuthenticated) {
      showToast('Пожалуйста, войдите в систему для создания заявки на обмен', 'warning');
      return;
    }

    // Закрываем модалку деталей
    setShowDetailModal(false);

    // Небольшая задержка для плавного перехода
    setTimeout(() => {
      setShowExchangeModal(true);
    }, 300);
  };

  // Успешное создание заявки на обмен
  const handleExchangeSubmit = () => {
    setShowExchangeModal(false);
    setSelectedBook(null);
  };

  // Закрытие модалки обмена
  const handleCloseExchangeModal = () => {
    setShowExchangeModal(false);
    // Не очищаем selectedBook, чтобы можно было вернуться к деталям
  };

  // Закрытие модалки деталей
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedBook(null);
  };

  const filteredBooks = selectedGenre
      ? books.filter(book => book.genres?.some(g => g.id === selectedGenre))
      : books;

  return (
      <div className="books-page">
        <div className="page-header">
          <h1>Каталог книг</h1>
          <p>Найдите интересные книги для обмена. Нажмите на книгу, чтобы узнать больше.</p>
        </div>

        {genres.length > 0 && (
            <div className="filters">
              <h3>Фильтр по жанрам:</h3>
              <div className="genre-filters">
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        className={`genre-filter-btn ${selectedGenre === genre.id ? 'active' : ''}`}
                        onClick={() => handleGenreFilter(genre.id)}
                    >
                      {genre.name}
                    </button>
                ))}
              </div>
            </div>
        )}

        <BookList
            books={filteredBooks}
            loading={loading}
            onBookClick={handleBookClick}
        />

        {totalPages > 1 && (
            <div className="pagination">
              <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
              >
                ← Назад
              </Button>
              <span className="page-info">
            Страница {currentPage + 1} из {totalPages}
          </span>
              <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
              >
                Вперед →
              </Button>
            </div>
        )}

        {/* Модальное окно с деталями книги */}
        <Modal
            isOpen={showDetailModal}
            onClose={handleCloseDetailModal}
            title="Информация о книге"
        >
          {selectedBook && (
              <BookDetail
                  book={selectedBook}
                  onClose={handleCloseDetailModal}
                  onExchange={handleExchangeClick}
              />
          )}
        </Modal>

        {/* Модальное окно создания заявки на обмен */}
        <Modal
            isOpen={showExchangeModal}
            onClose={handleCloseExchangeModal}
            title="Создать заявку на обмен"
        >
          {selectedBook && (
              <ExchangeForm
                  book={selectedBook}
                  onSubmit={handleExchangeSubmit}
                  onCancel={handleCloseExchangeModal}
              />
          )}
        </Modal>

        {/* Toast уведомления */}
        <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={hideToast}
        />
      </div>
  );
};

export default BooksPage;
