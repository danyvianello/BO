import React, { useState } from 'react';

const LoginTest: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(`Usuario: ${username}, Contraseña: ${password}`);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        console.log('Username changed:', e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        console.log('Password changed:', e.target.value);
    };

    const handleButtonClick = () => {
        console.log('Button clicked!');
        setMessage('¡Botón clickeado!');
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '400px',
            margin: '50px auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: 'white'
        }}>
            <h1>Test de Login Simple</h1>

            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="username">Usuario:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        placeholder="Escribe 'admin'"
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '4px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        placeholder="Escribe 'admin123'"
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Iniciar Sesión
                </button>
            </form>

            <button
                onClick={handleButtonClick}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#dc004e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '10px'
                }}
            >
                Test de Click
            </button>

            {message && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    color: '#2e7d32'
                }}>
                    {message}
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <p>Información de debug:</p>
                <p>Username: "{username}"</p>
                <p>Password: "{password}"</p>
                <p>Touch support: {('ontouchstart' in window) ? 'Sí' : 'No'}</p>
                <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
            </div>
        </div>
    );
};

export default LoginTest; 