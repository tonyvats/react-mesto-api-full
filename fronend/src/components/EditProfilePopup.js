import React from 'react';
import PopupWithForm from '../components/PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  
    const currentUser = React.useContext(CurrentUserContext);
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');


    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser]);

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({ 
            name: name, 
            about: description });
    }

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }


    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            title="Редактировать профиль"
            popupName="edit"
            formName="form_edit"
            onSubmit={handleSubmit}
        >
            <div className="popup__field">
                <input 
                    type="text" 
                    id="empty-name-input"
                    name="nameInput" 
                    className="popup__input popup__input_name" 
                    required 
                    minLength="2" 
                    maxLength="40"
                    value={name ? name : ""}
                    onChange={handleChangeName}
                />
                <span id="empty-name-input-error"></span> 
            </div>
            <div className="popup__field">
                <input 
                    type="text" 
                    id="empty-job-input" 
                    name="jobInput" 
                    className="popup__input popup__input_job" 
                    required minLength="2" 
                    maxLength="200"
                    value={description ? description : ""}
                    onChange={handleChangeDescription} 
                />
                <span id="empty-job-input-error"></span>  
            </div>
        </PopupWithForm>
  );
}

export default EditProfilePopup;