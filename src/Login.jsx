import { useState } from 'react';
import { supabase } from './supabaseClient';


//////login functionality first iteration
function Login() 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    async function handleLogin(event) {
        event.preventDefault();

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert('Login failed: ' + error.message);
            return;
        }

        alert('Logged in!! Welcome' + data.user.email);
    }
    return(
        <div className="auth-card">
            <h2>Login</h2>
            <form className="auth-form" onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default Login;