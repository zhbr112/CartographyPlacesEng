import './App.css'
import { EmojiProvider } from 'react-apple-emojis';
import emojiData from './assets/data.json'
import AuthProvider from './provider/authProvider.jsx';
import Routes from './routes/index.jsx';
import AppNavbar from './Components/AppNavbar.jsx';
import { YMapComponentsProvider } from 'ymap3-components';


function App() {
  return (
    <AuthProvider><EmojiProvider data={emojiData}><AppNavbar /><Routes /></EmojiProvider></AuthProvider>
  );
}

export default App
