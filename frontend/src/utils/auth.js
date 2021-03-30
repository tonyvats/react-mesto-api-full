// export const BASE_URL = 'https://auth.nomoreparties.co';
export const BASE_URL = 'http://localhost:3000';


const checkResponse = (response) => response.ok
  ? response.json()
  : Promise.reject(`Ошибка: ${response.status}`)



export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then((res) => {
      if (res.status === 400) {
        console.log('Некорректно заполнено одно из полей')
      }
      if (!res.ok) {
          return Promise.reject(`Ошибка ${res.status}`)
      }
      return res.json()
  })
    .then((res) => {
      return res
    })
}


export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then((res) => {
      if (res.status === 400) {
          console.log('Не передано одно из полей')
        }
        if (res.status === 401) {
          console.log('Пользователь с email не найден ')
        }
      if (!res.ok) {
          return Promise.reject(`Ошибка ${res.status}`);
      }
      return res.json()
  })
}

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(checkResponse)
}

