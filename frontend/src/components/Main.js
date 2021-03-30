import React from 'react';
import Card from '../components/Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardList, onCardLike, onDeleteCard }) {
    
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                 <div className="profile__avatar-container" onClick={onEditAvatar}>                    
                    <img className="profile__avatar-icon" src={currentUser.avatar} alt="фото аватара" />
                </div>
                <div className="profile__info">
                    <h1 className="profile__title">{currentUser.name}</h1>
                    <p className="profile__subtitle">{currentUser.about}</p>
                    <button type="button" className="profile__edit-btn" onClick={onEditProfile}></button>
                </div>
                <button type="button" className="profile__add-btn" onClick={onAddPlace} />
            </section>
            <section className="photo-grid">
                { 
                    onCardList.map((card) => (
                        <Card 
                            key={card._id}
                            card={card}
                            onCardClick={onCardClick}
                            onCardLike={onCardLike}
                            onDeleteCard={onDeleteCard}
                        />))           
                }
            </section>
        </main>       
    );

}

export default Main;