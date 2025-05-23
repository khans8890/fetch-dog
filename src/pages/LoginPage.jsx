import React, { useState } from 'react';

function LoginPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email})
            });

        setIsLoading(false);

            if (response.ok) {
                window.location.href = '/search';
            } else {
                alert('Login failed. Try again.');
            }
        };

        return (
            <div className='min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center'>
                <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-8'>
                    <h1 className='text-3xl font-bold text-center text-indigo-600 mb-6'>Login</h1>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Name:</label><br/>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-1g shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'/><br/><br/>
                        </div>

                        <div>
                            <label htmlFor='email'
                                   className='block text-sm front-medium text-gray-700'>Email:</label><br/>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='mt-1 block w-full rounded border border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 '/><br/><br/>
                        </div>
                        <button
                            type='submit'
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${isLoading ?  'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            disabled={isLoading}
                        >{isLoading ? 'Logging in...' : 'Log in'}</button>
                    </form>
                </div>
            </div>
        )

}

export default LoginPage;