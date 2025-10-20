import React from 'react';
import Button from '../common/Button';
import { BOOK_CONDITIONS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import './BookDetail.css';

const BookDetail = ({ book, onClose, onExchange }) => {
    return (
        <div className="book-detail">
            <div className="book-detail-cover">
                <div className="detail-book-icon">📖</div>
            </div>

            <div className="book-detail-content">
                <div className="detail-section">
                    <h3 className="detail-section-title">Основная информация</h3>
                    <div className="detail-info-grid">
                        <div className="detail-info-item">
                            <span className="detail-label">Название:</span>
                            <span className="detail-value">{book.title}</span>
                        </div>
                        <div className="detail-info-item">
                        <span className="detail-label">Автор:</span>
                            <span className="detail-value">{book.author}</span>
                        </div>
                        {book.isbn && (
                            <div className="detail-info-item">
                                <span className="detail-label">ISBN:</span>
                                <span className="detail-value">{book.isbn}</span>
                            </div>
                        )}
                        {book.publishedYear && (
                            <div className="detail-info-item">
                                <span className="detail-label">Год издания:</span>
                                <span className="detail-value">{book.publishedYear}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="detail-section">
                    <h3 className="detail-section-title">Состояние и статус</h3>
                    <div className="detail-info-grid">
                        <div className="detail-info-item">
                            <span className="detail-label">Состояние:</span>
                            <span className="detail-value">
                <span className="condition-badge">
                  {BOOK_CONDITIONS[book.condition] || book.condition}
                </span>
              </span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-label">Статус:</span>
                            <span className="detail-value">
                <span className={`status-badge status-${book.status?.toLowerCase()}`}>
                  {book.status}
                </span>
              </span>
                        </div>
                    </div>
                </div>

                {book.genres && book.genres.length > 0 && (
                    <div className="detail-section">
                        <h3 className="detail-section-title">Жанры</h3>
                        <div className="detail-genres">
                            {book.genres.map(genre => (
                                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
                            ))}
                        </div>
                    </div>
                )}


                <div className="detail-section">
                    <h3 className="detail-section-title">Дополнительно</h3>
                    <div className="detail-info-grid">
                        <div className="detail-info-item">
                            <span className="detail-label">Владелец (ID):</span>
                            <span className="detail-value">{book.owner_id}</span>
                        </div>
                        <div className="detail-info-item">
                            <span className="detail-label">Дата добавления:</span>
                            <span className="detail-value">{formatDate(book.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="book-detail-actions">
                <Button variant="outline" onClick={onClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={onExchange}>
                    📚 Обменяться
                </Button>
            </div>
        </div>
    );
};

export default BookDetail;
