import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onDeleteCard }) {

    const currentUser = React.useContext(CurrentUserContext);

    console.log(card.likes)

    // Определяем, являемся ли мы владельцем текущей карточки
    const isOwn = card.owner === currentUser._id;


    // Создаём переменную, которую после зададим в `className` для кнопки удаления
    const cardDeleteButtonClassName = (
    `photo-grid__delete-btn ${isOwn ? 'photo-grid__delete-btn_visible' : 'photo-grid__delete-btn_hidden'}`
    );

    // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
    const isLiked = card.likes.some((like) => like === currentUser._id);

    // Создаём переменную, которую после зададим в `className` для кнопки лайка
    const cardLikeButtonClassName = (`photo-grid__like-btn ${isLiked ? 'photo-grid__like-btn_active' : ''}`);

    function handleCardClick() {
        onCardClick(card);
    } 

    function handleLikeClick() {
		onCardLike(card);
    }

    function handleDeleteClick() {
		onDeleteCard(card);
    }

    return (
        <div className="photo-grid__item">
        <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
        <img className="photo-grid__image" src={card.link} alt={card.name} onClick={handleCardClick} />
            <div className="photo-grid__rectangle">
                <h2 className="photo-grid__title">{card.name}</h2>
                <div className="photo-grid__like-place">
                    <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <span className="photo-grid__like-count">{card.likes.length}</span>
                </div>
            </div> 
        </div>    
    );
}

export default Card;