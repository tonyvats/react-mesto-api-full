export const validationParams = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__save-btn',
    inactiveButtonClass: 'popup__save-btn_inactive',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__unput-error_active'
  };


export const avatar = document.querySelector('.profile__avatar-icon');
export const avatarLinkInput= document.querySelector('.popup__input_link-avatar');
export const editButton = document.querySelector('.profile__edit-btn');
export const avatarButton = document.querySelector('.profile__avatar-container');
export const addButton = document.querySelector('.profile__add-btn');
export const imageButton = document.querySelector('.photo-grid__image'); 
export const safeUpdateButton = document.querySelector('.popup__save-btn_update');
export const editPopupContainer = '.popup__edit';
export const updatePopupContainer = '.popup__update';
export const popupPhotoContainer = '.popup__photo';
export const popupSubmitContainer = '.popup__submit';
export const popupEditAvatarContainer = '.popup__avatar';
export const popupPhotoTitle = document.querySelector('.popup__photo-title');
export const popup = document.querySelector('.popup_opened');
export const popupFormEdit = document.forms.edit;
export const popupFormUpdate = document.forms.update;
export const nameInput= popupFormEdit.elements.nameInput;
export const jobInput= popupFormEdit.elements.jobInput;
export const profileTitle = document.querySelector('.profile__title');
export const profileSubtitle = document.querySelector('.profile__subtitle');
export const photoGrid = '.photo-grid';
export const escButtonCode = 'Escape';