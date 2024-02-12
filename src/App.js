import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import Chords from './Components/Chords';
import SongItem from './Components/SongItem';

function App() {
  return (
    <div className="App">
     <Router>
      <Navbar/>
      <Routes>
        <Route path='/songs' Component={Songs} ></Route>
        <Route path='/songs/:songtitle' Component={SongItem}></Route>
        <Route path='/chords' Component={Chords}></Route>
        <Route
            path="/"
            element={<Navigate to="/songs"/>}
        />
      </Routes>
     </Router>
    </div>
  );
}

export default App;
