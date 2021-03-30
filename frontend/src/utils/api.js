class Api {
    constructor(config) {
        this._url = config.url;
        this._contentType = config.headers["Content-type"];
    }

    editProfileAvatar(avatar) {
        return fetch(`${this._url}${'users/me/avatar'}`, {
            method: "PATCH",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            },  
            body: JSON.stringify({
                // avatar: avatar
                avatar
            })       
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    getUserInfoFromServer() {
        return fetch(`${this._url}${'users/me'}`, {
            method: "GET",
            headers: this._headers        
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    getAvatarFromServer() {
        return fetch(`${this._url}${'users/me/avatar'}`, {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            },    
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    setUserInfoOnServer(name, about) {
        return fetch(`${this._url}${'users/me'}`, {
            method: "PATCH",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            },  
            body: JSON.stringify({
                name: name,
                about: about
            })       
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    getCardsInformation() {
        return fetch(`${this._url}${'cards'}`, {
            method: "GET",
            headers: {
                // authorization: `Bearer ${localStorage.getItem("jwt")}`,
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            },       
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    addCards(name, link) {
        return fetch(`${this._url}${'cards'}`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            }, 
            body: JSON.stringify({
                name: name,
                link: link
            })       
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    deleteCard(cardId) {
        return fetch(`${this._url}${'cards/'}${cardId}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            }, 
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }


    changeLikeCardStatus(cardId, like) {
        return fetch(`${this._url}cards/${cardId}/likes`, {
            method: like ? "PUT" : "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem("jwt")}`,
                "Content-type": this._contentType,
            },         
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

}



const api = new Api({
    // url: "https://mesto.nomoreparties.co/v1/cohort-18/",
    // url: "http://localhost:3000/",
    url: "http://api.vatc.nomoredomains.club/",
    headers: {
        "Content-type": "application/json",
    },
});

export default api;