
import { useEffect, useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import { supabase } from './supabaseClient';

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

  ///Test games database
  async function testGamesConnection()
  {
    const {data, error } = await supabase
    .from('games')
    .select('*');

    if (error)
    {
      console.log('error communicating with supabase', error.message);
    }
    else
    {
      console.log('success retreiving games with supabase', data);
    }
  }

  async function testAddGame()
  {
    const { data: { user}, error: userError } = await supabase.auth.getUser();

    if(userError || !user)
    {
      console.log('error getting user, logged in?', userError?.message);
      return;
    }
  

  const { error } = await supabase
  .from('games')
  .insert({
    user_id: user.id,
    rawg_id: 5887,
    title: 'Fallout 4',
    status: 'To Play',
  });

  if (error)
  {
    if (error.code === '23505') // Unique violation error code
    {
      console.log('game already exists in the database');
    }
    else
    {
      console.log('error adding game to the database', error.message);
    }
  }
  else
  {
    console.log('success adding game');
  }
}
///test updating a games progress
async function testUpdateGameProgress()
{
  const { data: { user}, error: userError } = await supabase.auth.getUser();

  if(userError || !user)
  {
    console.log('error getting user, logged in?', userError?.message);
    return;
  }

  const { data, error } = await supabase
  .from('games')
  .update({ status: 'Playing' })
  .eq('user_id', user.id)
  .eq('rawg_id', 5887)
  .select();

  if (error)
  {
    console.log('error updating game progress', error.message);
  }
  else if (data.length === 0)
  {
    console.log('no game found to update');
  }
  else
  {
    console.log('success updating game progress', data);
  }
}

async function testDeleteGame()
{
  const { data: { user}, error: userError } = await supabase.auth.getUser();

  if(userError || !user)
  {
    console.log('error getting user, logged in?', userError?.message);
    return;
  }

  const { data, error } = await supabase
  .from('games')
  .delete()
  .eq('user_id', user.id)
  .eq('rawg_id', 5887)
  .select();

  if (error)
  {
    console.log('error deleting game', error.message);
  }
  else if (data.length === 0)
  {
    console.log('no game found to delete');
  }
  else
  {
    console.log('success deleting game', data);
  }
}
  if (authLoading)
  {
    return <div>Checking login status...</div>;
  }

  return (
    <div>
      <h1>Game Collection Manager</h1>
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
