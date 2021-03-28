import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditAvatarPopup({ isOpen, onClose,  onUpdateAvatar}) {
  
    const inputAvatarRef = React.useRef("");

    function handleSubmit(e) {
        e.preventDefault();
        onUpdateAvatar({ 
            avatar: inputAvatarRef.current.value  
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            title="Обновить аватар"
            popupName="avatar"
            formName="form_update"
            onSubmit={handleSubmit}
        >
            <input 
                className="popup__input popup__input_link-avatar popup__input_link" 
                type="url" 
                name="avatar" 
                ref={inputAvatarRef}
                required 
            />   
        </PopupWithForm>
  );
}

export default EditAvatarPopup;