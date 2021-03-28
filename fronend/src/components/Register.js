import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

function Register({handleRegister}) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        handleRegister(email, password);
        setPassword('');
        setEmail('');
    }

    function handleChangeEmail(evt) {
        setEmail(evt.target.value)
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value)
    }

    return (
        <div className='register'>
            <h2 className='register__title'>Регистрация</h2>
            <form className='register__form' onSubmit={handleSubmit}>
                <input className='register__input' placeholder='email' type='email' required minLength='2' maxLength='40' value={email} onChange={handleChangeEmail}/>
                <input className='register__input' placeholder='Пароль' type='password' required minLength='2' maxLength='40' value={password} onChange={handleChangePassword} />
                <button type='submit' className='register__button-save' onSubmit={handleSubmit}>Зарегистрироваться</button>
            </form>
            <div className='register__signin'>
                <p>Уже зарегистрированы?</p>
                <Link to='sign-in' className='register__register-link'> Войти</Link>
            </div>
        </div>
    )
}

export default withRouter(Register);