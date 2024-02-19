import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Songs from './Components/Songs';
import Chords from './Components/Chords';
import SongItem from './Components/SongItem';
import { useEffect } from 'react';
import M from './Assets/M.png'

function App() {

  useEffect(() => {
    const runAnimation = () => {
      let i = 300;
      document.querySelectorAll('.loader-text > p').forEach((x) => {
        setAnim(x, i);
        i = i + 100;
      });
    };

    runAnimation();

    const intervalId = setInterval(runAnimation, 2000);

    setTimeout(() => {
      document.querySelector('.loader').style.display = 'none'
      document.querySelectorAll('.loader-text > p').forEach((x) => {
        x.style.animation = 'none'
        clearInterval(intervalId);
      })
    },3000)

    return () => clearInterval(intervalId);
  }, []);

  function setAnim(a, b) {
    setTimeout(() => {
      a.style.animation = 'moveUp 1s ease';
    }, b);
    setTimeout(() => {
      a.style.animation = 'none';
    }, b + 500);
  }

  return (
    <>
    <div className="loader">
      <div className="loader-text">
      <p>C</p>
      <p>h</p>
      <p>o</p>
      <p>r</p>
      <p>d</p>
      <p><img className='letterM' src={M} alt="" /></p>
      <p>a</p>
      <p>n</p>
      <p>i</p>
      <p>a</p>
      <p>.</p>
      <p>.</p>
      </div>
    </div>
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
    </>
  );
}

export default App;
