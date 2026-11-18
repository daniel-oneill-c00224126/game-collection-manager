
import { useEffect, useState } from 'react';
import './App.css';
import Login from './Login';
import Register from './Register';
import { supabase } from './supabaseClient';
import Dashboard from './Dashboard';

function App()
{
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Checking the current login session
  useEffect(() => 
    {
    const 
      { data: 
        { subscription } 
      } = supabase.auth.onAuthStateChange
      (
        (_event, session) => 
          {
            setUser(session?.user ?? null);
            setAuthLoading(false);
          }
      );

    return () => 
      {
        subscription.unsubscribe();
      };
  }, 
  []
);

  // Test Supabase connection
  async function testConnection()
  {
    const { data, error } = await supabase.auth.getUser();

    if (error)
    {
      if (error.message === 'Auth session missing!')
      {
        console.log('No user is currently logged in');
      }
      else
      {
        console.log('error communicating with supabase', error.message);
      }
    }
    else
    {
      console.log('success communicating with supabase', data.user?.id);
    }
  }

  if (authLoading)
  {
    return <div>Checking login status...</div>;
  }

  return (
    <div>
      <h1>Game Collection Manager</h1>

      <button type="button" onClick={testConnection}>
        Test Supabase Connection
      </button>

      {user ? (
        <Dashboard user={user} />
      ) : (
        <div>
          <Register />
          <Login />
        </div>
      )}
    </div>
  );
}

export default App;
