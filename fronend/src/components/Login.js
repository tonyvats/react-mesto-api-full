import React from 'react';
import { withRouter } from 'react-router-dom';

function Login(props) {
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')

    function handleSubmit(event) {
        event.preventDefault()
        if (!email || !password){
            return
        }
        props.handleLogin(email, password)
    }
    
    function handleChangeEmail(evt) {
        setEmail(evt.target.value)
    }

    function handleChangePassword(evt) {
        setPassword(evt.target.value)
    }


    return (
            <div className='register'>
                <h2 className='register__title'>Вход</h2>
                <form className='register__form' onSubmit={handleSubmit} >
                    <input className='register__input' placeholder='email' type='email' required minLength='2' value={email} maxLength='40' onChange={handleChangeEmail} />
                    <input className='register__input' placeholder='Пароль' type='password' required minLength='2' value={password} maxLength='40' onChange={handleChangePassword} />
                    <button type='submit' className='register__button-save' onSubmit={handleSubmit}>Войти</button>
                </form>
            </div>
    )
}

export default withRouter(Login);