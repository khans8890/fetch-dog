import React, { useState } from 'react';

function LoginPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email})
            });

            if (response.ok) {
                window.location.href = '/search';
            } else {
                alert('Login failed. Try again.');
            }
        };

        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name:</label><br />
                    <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    /><br /><br />

                    <label htmlFor='email'>Email:</label><br />
                    <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/><br/><br />

                    <button type='submit'>Login</button>
                </form>
            </div>
        )

    }

export default LoginPage;