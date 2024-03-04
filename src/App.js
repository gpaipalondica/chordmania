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
import Login from './Components/Login';
import Mysongs from './Components/Mysongs';

function App() {

  let [songListing, setSongListing] = useState(null)


  useEffect(() => {  
    if(!sessionStorage.getItem('currentPage')){
      sessionStorage.setItem('currentPage','home')
    }

    refreshDb()
  },[])
  
  let data2
  function refreshDb(){
    try{
      fetch('https://firstnodejstest.azurewebsites.net/getList', 
      {method:'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // This method reads the body and automatically closes the stream
    })
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
    catch (err){
      console.log("DB Error");
    }
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
    console.log("UPDATING");
    refreshDb()
  }

  const [authToken, setAuthToken] = useState('')
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    setAuthToken(token)
    
    const data = sessionStorage.getItem('data')
    if (data){
      setUserData({...JSON.parse(data)})
      }
    } , [])


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
      <Navbar userData={userData} authToken={authToken} setAuthToken={setAuthToken} setUserData={setUserData} />
      <Routes>
        <Route path='/' element={<Home goPage={goPage} />} ></Route>
        <Route path='/songs' element={<Songs />} ></Route>
        <Route path='/addSong' element={<AddSong allSongs={songListing} newList={updateList}/>}></Route>
        <Route path='/songs/:songtitle' element={<SongItem list={songListing}/>}></Route>
        <Route path='/chords' Component={Chords}></Route>
        <Route path='/mysongs' element={<Mysongs/>}></Route>
        <Route path='/login' element={<Login setAuthToken={setAuthToken} setUserData={setUserData} />}></Route>
      </Routes>
     </Router>
    </div>
    </>
  );
}

export default App;
