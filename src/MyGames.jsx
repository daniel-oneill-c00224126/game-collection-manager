import {useEffect, useState} from 'react';
import { supabase } from './supabaseClient';
import './MyGames.css';

function MyGames({ user })
{
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardColours = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA500', '#DDA0DD', '#FF9AA2', '#FFB7B2',
  '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280', '#C06C84', '#6C5B7B',
  '#A8E6CF', '#DCEDC1', '#FFD3B6', '#FFAAA5', '#FF8B94', '#D4A5A5', '#9DE0AD', '#45ADA8',
  '#E5FCC2', '#99B898', '#FECEAB', '#FF847C', '#E84A5F', '#F38181', '#FCE38A', '#EAFFD0',
  '#95E1D3', '#A8D8EA', '#AA96DA', '#FCBAD3', '#FFFFD2', '#F9ED69', '#F08A5D', '#B83B5E',
  '#6A2C70', '#00B8A9', '#F8F3D4', '#F6416C', '#FFDE7D', '#C6E2FF', '#B0E0E6', '#AFEEEE',
  '#E0FFFF', '#98FB98', '#F0E68C', '#FFE4B5', '#FFDAB9', '#FFE4E1', '#FFF0F5', '#E6E6FA',
  '#D8BFD8', '#EE82EE', '#DA70D6', '#FF69B4', '#DB7093', '#F08080', '#FA8072', '#E9967A',
  '#FFA07A', '#FF7F50', '#FF6347', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F', '#BDB76B',
  '#ADFF2F', '#7FFF00', '#7CFC00', '#00FA9A', '#00FF7F', '#66CDAA', '#40E0D0', '#48D1CC',
  '#00CED1', '#5F9EA0', '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#6495ED', '#7B68EE',
  '#9370DB', '#BA55D3', '#FF00FF', '#FF1493', '#C71585', '#CD5C5C', '#F5DEB3', '#FFEBCD',
  '#FFE4C4', '#FFDEAD', '#F5F5DC', '#FFFACD', '#FAFAD2', '#FFEFD5', '#FFF5EE', '#F0FFF0',
  '#F5FFFA', '#F0FFFF', '#F0F8FF', '#F8F8FF', '#FFF8DC', '#FAEBD7', '#FAF0E6', '#FDF5E6',
  '#FFFAF0', '#FFFFF0', '#F5F5F5', '#DCDCDC', '#D3D3D3', '#C0C0C0', '#A9A9A9', '#B0C4DE',
  '#778899', '#708090', '#8FBC8F', '#20B2AA', '#3CB371', '#2E8B57', '#6B8E23', '#9ACD32',
  '#32CD32', '#00FF00', '#00FFFF', '#7FFFD4', '#8A2BE2', '#9932CC', '#9400D3', '#FF4500',
  '#FF8C00', '#DAA520', '#B8860B', '#CD853F', '#D2691E', '#A0522D', '#8B4513', '#FFC0CB',
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8BAFF', '#FFBAF3', '#FFC8A2',
  '#FFCCB6', '#F3B0C3', '#C6DBDA', '#FEE1E8', '#FED7C3', '#F6EAC2', '#ECD5E3', '#FF968A',
  '#FFAEA5', '#FFC5BF', '#FFD8BE', '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF', '#CDB4DB',
  '#F4978E', '#F8AD9D', '#FBC4AB', '#FFDAB9', '#D8E2DC', '#FFE5D9', '#FFCAD4', '#F4ACB7',
  '#9D8189', '#B8E0D2', '#D6EADF', '#EAC4D5', '#95B8D1', '#809BCE', '#E8DFF5', '#FCE1E4',
  '#FCF4DD', '#DDEDEA', '#DAEAF6', '#FAD2E1', '#C5DEDD', '#DBE7E4', '#F0EFEB', '#D6E2E9',
  '#BCD4E6', '#99C1DE', '#EDDCD2', '#FFF1E6', '#FDE2E4', '#FAD2E1', '#E2ECE9', '#BEE1E6',
  '#F0EFEB', '#DFE7FD', '#CDDAFD', '#A0C4FF', '#BDB2FF', '#FFC6FF', '#FFFFFC', '#CAFFBF',
  '#9BF6FF', '#FDFFB6', '#FFD6A5', '#FFADAD', '#80FFDB', '#72EFDD', '#64DFDF', '#56CFE1',
  '#48BFE3', '#4EA8DE', '#5390D9', '#5E60CE', '#6930C3', '#7400B8', '#FF9F1C', '#FFBF69',
  '#CBF3F0', '#2EC4B6', '#E71D36', '#FF9F1C', '#011627', '#FDFFFC', '#F72585', '#B5179E',
  '#7209B7', '#560BAD', '#480CA8', '#3A0CA3', '#3F37C9', '#4361EE', '#4895EF', '#4CC9F0',
  '#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E',
  '#577590', '#277DA1', '#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5'
]; //256 colours picked randomly from https://www.w3schools.com/colors/colors_picker.asp

    
    useEffect(() =>
    {
        async function loadGames()
        {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('user_id', user.id);

            if (error)
            {
                console.error('Error fetching games:', error);
            }
            else
            {
                setGames(data);
            }
            setLoading(false);
        }
        
        loadGames();
    }, [user.id]);

    if (loading)
    {
        return <div>Loading games...</div>;
    }

    return (
        <div>
            <h2>My Games</h2>

    <div className="games-scroll">
      {games.map((game) => (
        <div className="game-card" key={game.id}
        style={{ backgroundColor: cardColours[Math.floor(Math.random() * cardColours.length)] }}>
          <div className="game-cover">
            {game.img_url ? (
              <img src={game.img_url} alt={game.title} />
            ) : (
              <p>No cover available</p>
            )}
          </div>

          <h3>{game.title}</h3>
          <p>Status: {game.status}</p>
        </div>
                ))}
        </div>
        </div>
    );
}
export default MyGames;