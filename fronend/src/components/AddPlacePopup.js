import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose,  onAddCard}) {
      
    const [name, setName] = React.useState("");
    const [link, setLink] = React.useState("");

    function handleChangeName(e) {
        setName(e.target.value);
    }
    
      function handleChangeLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddCard({
          name: name,
          link: link
        });
    }

	React.useEffect(() => { 
        setLink("");
        setName("");
  	}, [isOpen]); 

    return (
        <PopupWithForm
            isOpen={isOpen}
            onClose={onClose}
            title="Новое место"
            popupName="update"
            formName="form_update"
            onSubmit={handleSubmit}
        >
            <div className="popup__field">
                <input 
                    type="text" 
                    id="empty-title-input" 
                    name="name" 
                    placeholder="Название" 
                    className="popup__input popup__input_title" 
                    required 
                    minLength="2" 
                    maxLength="30"
                    onChange={handleChangeName}  
                    value={name ? name : ""}  
                />
                <span id="empty-title-input-error"></span> 
            </div>
            <div className="popup__field">
                <input 
                    type="url" 
                    id="empty-link-input" 
                    name="link" 
                    placeholder="Ссылка на картинку" 
                    className="popup__input popup__input_link" 
                    required
                    onChange={handleChangeLink} 
                    value={link ? link : ""}
                />   
                <span id="empty-link-input-error"></span> 
            </div> 
        </PopupWithForm>
  );
}

export default AddPlacePopup;