import { useState, useEffect } from "react";
import Button from "./Button/Button";

export default function FeedbackSection({onAuthorizationSuccess, login_user, userRole }) {
    const [form, setForm] = useState({
        name: "",
        password: "",
        nameHasError: true,
        passwordHasError: true
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleNameChange = (event) => {
        const value = event.target.value;
        setForm(prev => ({
            ...prev,
            name: value,
            nameHasError: value.trim().length === 0
        }));
    };

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setForm(prev => ({
            ...prev,
            password: value,
            passwordHasError: value.trim().length === 0 || value.length < 6
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isFormInvalid = form.nameHasError || form.passwordHasError;

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() >= exp;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    };

    const handleLoginClick = async () => {
        if (isFormInvalid) {
            alert("Пожалуйста, заполните все поля корректно");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: form.name,
                    password: form.password
                }),
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('user_role', data.role);

                onAuthorizationSuccess("authorized");
                login_user({
                    username: data.username,
                    role: data.role,
                    token: data.access_token
                });

                alert(`Успешный вход! Добро пожаловать, ${data.username} (${data.role})`);
            } else {
                const error = await response.json();
                alert(`Ошибка входа: ${error.detail || "Неверный логин или пароль"}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при подключении к серверу');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_role');

        setForm({
            name: "",
            password: "",
            nameHasError: true,
            passwordHasError: true
        });

 
        onAuthorizationSuccess("unauthorized");
        login_user(null);

        alert("Вы вышли из системы");
    };

    // Проверяем, есть ли сохраненный токен при загрузке компонента
    const checkExistingAuth = () => {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('user_role');

        if (token && username) {
            if (isTokenExpired(token)) {
                console.log('Token expired, logging out...');
                handleLogout();
                return;
            }

            onAuthorizationSuccess("authorized");
            login_user({
                username: username,
                role: role,
                token: token
            });
        }
    };

    useEffect(() => {
        checkExistingAuth();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Авторизация</h2>

            {userRole && (
                <div style={{ 
                    marginBottom: '15px', 
                    padding: '10px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    textAlign: 'center'
                }}>
                    <strong>Текущая роль:</strong> {userRole}
                </div>
            )}

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
                    Логин:
                </label>
                <input
                    id="username"
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: form.nameHasError ? '1px solid red' : '1px solid #ccc',
                        borderRadius: '4px'
                    }}
                    placeholder="Введите логин"
                    disabled={isLoading}
                />
                {form.nameHasError && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                        Поле обязательно для заполнения
                    </span>
                )}
            </div>

            <div style={{ marginBottom: '15px', position: 'relative' }}>
                <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                    Пароль:
                </label>
                <div style={{ position: 'relative' }}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handlePasswordChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            paddingRight: '40px',
                            border: form.passwordHasError ? '1px solid red' : '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                        placeholder="Введите пароль"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px'
                        }}
                        title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <span style={{ fontSize: '18px' }}>👁️</span>
                        ) : (
                            <span style={{ fontSize: '18px' }}>🔒</span>
                        )}
                    </button>
                </div>
                {form.passwordHasError && (
                    <span style={{ color: 'red', fontSize: '12px' }}>
                        Пароль должен быть не менее 6 символов
                    </span>
                )}
            </div>

            <Button
                onClick={handleLoginClick}
                disabled={isFormInvalid || isLoading}
                style={{
                    width: '100%',
                    marginBottom: '10px'
                }}
            >
                {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            <Button
                onClick={handleLogout}
                style={{
                    width: '100%',
                    backgroundColor: '#dc3545'
                }}
            >
                Выйти
            </Button>

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                <p>Тестовые учетные записи:</p>
                <ul>
                    <li>admin / admintestpassword (администратор)</li>
                    <li>manager / managertestpassword (руководитель)</li>
                    <li>executor_1 / executortestpassword (пользователь)</li>
                </ul>
                
            </div>
        </div>
    );
}