import { useState } from "react";
import { supabase } from './supabaseClient';

function Register() 
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [email, setEmail] = useState('');

async function handleRegister(event) {
  event.preventDefault();

  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
    data: {
      username: username
    }
  }
});

if (error) {
  alert('Registration failed: ' + error.message);
  return;
}

alert('Registered!!');
}

    return (
        <div className="auth-card">
            <h1>Register</h1>
            <form className="auth-form" onSubmit={handleRegister}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="username">Username:</label>
                <input 
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={20}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input 
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required

                />
                <label htmlFor="passwordConfirm">Confirm Password:</label>
                <input 
                    type="password"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
export default Register;