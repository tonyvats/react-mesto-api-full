import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import '../index.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Main from '../components/Main';
import AddPlacePopup from '../components/AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from '../components/ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
// import api from '../utils/api';
import api from '../utils/api';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {

    const history = useHistory();

    const [isEditAvatarPopupOpen, setIsOpenPopupAvatar] = React.useState(false);
    const [isEditProfilePopupOpen, setIsOpenPopupProfile] = React.useState(false);
    const [isAddPlacePopupOpen, setIsOpenPopupPlace] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(false);
    const [imageData, setImageData] = React.useState(null)
    
    const [cards, setCards] = React.useState([])
    const [currentUser,  setCurrentUser] = React.useState({}); 
    // console.log(currentUser);

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [isRequestSuccessful, setisRequestSuccessful] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function handleCheckToken() {
        const jwt = localStorage.getItem('jwt')
        if (jwt) {
          auth.getContent(jwt)
            .then((res) => {
                if (res) {
                    setLoggedIn(true)
                    setEmail(res.email)
                    setCurrentUser(res);
                    history.push('/')
                }
            })
            .catch((err) => {
              console.log(err)
            })
        }
    }
    
    React.useEffect(() => {
        console.log(currentUser)
      }, [currentUser])

      
    React.useEffect(() => {
        handleCheckToken()
    }, [loggedIn])

    React.useEffect(() => {
        api.getCardsInformation()
            .then((res) => {
                setCards(res);
            })
            .catch((err) => console.error(err));
    }, []);

    React.useEffect(() => {
        api.getUserInfoFromServer()
            .then((res) => {
                setCurrentUser(res);
            })
            .catch((err) => console.error(err));
    }, []);

    function handleEditAvatarClick() {
        setIsOpenPopupAvatar(true);
    }
    
    function handleAddPlaceClick() {
        setIsOpenPopupPlace(true);
    }

    function handleEditProfileClick() {
        setIsOpenPopupProfile(true);
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(like => like === currentUser._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                const newCards = cards.map((item) => (item._id === card._id ? newCard : item));
                console.log(newCard.data)
                setCards(newCards);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleCardDelete(card) {
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.deleteCard(card._id)
            .then(() => {
                setCards(cards.filter(c => c._id !== card._id));
        })
        .catch((err) => console.error(err));
    }
    
    function handleUpdateUser(userData) {
        // console.log(userData);
        api.setUserInfoOnServer(userData.name, userData.about)
            .then(res => {
                setCurrentUser(res);
                closeAllPopups();
        })
        .catch((err) => console.error(err))
    }

    function handleUpdateAvatar(userData) {
        api.editProfileAvatar(userData.avatar)
            .then(res => {
                // console.log(res)
                setCurrentUser(res);
                closeAllPopups()
        })
        .catch((err) => console.error(err))

    }

    function handleAddPlaceSubmit(cardData) {
        // console.log(cards);
        api.addCards(cardData.name, cardData.link)
            .then(card => {
                setCards([card, ...cards]);
                closeAllPopups()
        })
        .catch((err) => console.error(err))
    }

    function handleCardClick(card) {        
        setSelectedCard(true);
        setImageData(card);
    }

    function closeAllPopups() {
        setIsOpenPopupAvatar(false);
        setIsOpenPopupProfile(false);
        setIsOpenPopupPlace(false);
        setSelectedCard(null);
        setIsInfoTooltipOpen(false)
    }

    function handleRegister(email, password) {
        auth.register(email, password)
        .then((res) => {
            if (res.data) {
                setisRequestSuccessful(true);
                setIsInfoTooltipOpen(true);
                history.push('/sign-in');
            }
        })
        .catch((err) => {
            console.log(`Ошибка: ${err}`);
            setisRequestSuccessful(false);
            setIsInfoTooltipOpen(true);
        })
    }

    const handleLogin = (email, password) => {
        auth.authorize(email, password)
            .then((res) => {
                if (res.token) {
                    setLoggedIn(true);
                    localStorage.setItem('jwt', res.token);
                    setLoggedIn(true);
                    history.push('/')
                }
            })
            .catch((err) => {
                console.log(`Ошибка: ${err}`);
                setIsInfoTooltipOpen(true);
                setisRequestSuccessful(false);
            })
    }
    
    function handleLogout() {
        setLoggedIn(false)
        setEmail(email)
        localStorage.removeItem('jwt')
        history.push('/sign-in')
    }

    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>
                <Header 
                    email={email} 
                    loggedOut={handleLogout} 
                    loggedIn={loggedIn}
                />
                    <Switch>
                        
                        <ProtectedRoute
                            exact path='/'
                            loggedIn={loggedIn}
                            component={Main}
                            onEditAvatar={handleEditAvatarClick}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onCardClick={handleCardClick}
                            onCardList={cards}
                            onCardLike={handleCardLike}
                            onDeleteCard={handleCardDelete}
                        >
                        </ProtectedRoute>

                        <Route path='/sign-in'>
                            <Login handleLogin={handleLogin} setEmail={setEmail} />
                        </Route>

                        <Route path='/sign-up'>
                            <Register handleRegister={handleRegister} />
                        </Route>

                        <Route>
                            {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
                        </Route>
                    </Switch>
                    


                <EditProfilePopup 
                    isOpen={isEditProfilePopupOpen} 
                    onClose={closeAllPopups} 
                    onUpdateUser={handleUpdateUser}
                /> 

                <EditAvatarPopup 
                    isOpen={isEditAvatarPopupOpen} 
                    onClose={closeAllPopups} 
                    onUpdateAvatar={handleUpdateAvatar}
                /> 

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddCard={handleAddPlaceSubmit}
                />

                <ImagePopup
                    card={imageData}
                    isOpen={selectedCard}
                    onClose={closeAllPopups}
                />

                <InfoTooltip 
                    isRequestSuccessful={isRequestSuccessful} 
                    isOpen={isInfoTooltipOpen} 
                    onClose={closeAllPopups} 
                />


            </CurrentUserContext.Provider>

            <Footer />
        </div>
    );
}

export default App;
 