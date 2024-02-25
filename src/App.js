import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Songs from './Components/Songs';
import Chords from './Components/Chords';
import SongItem from './Components/SongItem';
import AddSong from './Components/AddSong';
import { useEffect } from 'react';
import M from './Assets/M.png'
// import { Songlist } from './Helper/Songlist';
import { useState } from 'react';

function App() {

  let [songListing, setSongListing] = useState(null)


  useEffect(() => {  
    refreshDb()
  },[])


  function refreshDb(){
    let data2 
    fetch('https://firstnodejstest.azurewebsites.net/getList', 
      {method:'GET'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
            data2 = data
            setSongListing(data2)
        })
        .catch(error => {
          console.log('Error in GET function', error);
          return error
        });
  }

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

  function goPage(x){
    console.log("GP", x);
    document.querySelectorAll('.nav-group').forEach((x)=>{
      x.classList.remove('active')
    })
    document.getElementById(x).classList.add('active');
  }

  function updateList(){
    refreshDb()
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
        <Route path='/' element={<Home goPage={goPage} />} ></Route>
        <Route path='/songs' element={<Songs list={songListing} />} ></Route>
        <Route path='/addSong' element={<AddSong newList={updateList}/>}></Route>
        <Route path='/songs/:songtitle' element={<SongItem list={songListing}/>}></Route>
        <Route path='/chords' Component={Chords}></Route>
      </Routes>
     </Router>
    </div>
    </>
  );
}

export default App;
