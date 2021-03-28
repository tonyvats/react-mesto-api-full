import React from 'react';

function ImagePopup({ card, isOpen, onClose }) {
    return (
        <div className={`popup popup__photo ${isOpen && "popup_opened"}`}>
            <div className="popup__container">
                <button type="button" className="popup__close-btn" onClick={onClose}></button> 
                <img className="popup__photo-fullscreen" src={card?.link} alt={card?.name} />
                <h2 className="popup__photo-title">{card?.name}</h2>
            </div>
        </div>
    );
}

export default ImagePopup;