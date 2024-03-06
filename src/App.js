import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Songs from './Components/Songs';
import Chords from './Components/Chords';
import SongItem from './Components/SongItem';
import AddSong from './Components/AddSong';
import { useCallback, useEffect } from 'react';
import M from './Assets/M.png'
// import { Songlist } from './Helper/Songlist';
import { useState } from 'react';
import Login from './Components/Login';
import Mysongs from './Components/Mysongs';
import EditSong from './Components/EditSong';
import Songby from './Components/Songby';

function App() {

  let [songListing, setSongListing] = useState(null)

  
  const url = 'https://firstnodejstest.azurewebsites.net'
  
  const refreshDb = useCallback(async () => {
    try {
      const response = await fetch(url + '/getList', { method: 'GET' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // console.log(data);
      setSongListing(data);
    } catch (error) {
      console.log('Error in GET function', error);
    }
  }, [setSongListing]);

  useEffect(() => {
    if (!sessionStorage.getItem('currentPage')) {
      sessionStorage.setItem('currentPage', 'home');
    }
    refreshDb();
  }, [refreshDb]);



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

  let [editSong,setEditSong] = useState(null)

  useEffect(()=>{
      if(sessionStorage.getItem('editsong')){
        setEditSong(JSON.parse(sessionStorage.getItem('editsong')))
      }
  },[])

    function goToEdit(x){
      // console.log("editSong",x);
      setEditSong(x)
      sessionStorage.setItem('editsong', JSON.stringify(x))
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
      <Navbar userData={userData} authToken={authToken} setAuthToken={setAuthToken} setUserData={setUserData} />
      <Routes>
        <Route path='/' element={<Home goPage={goPage} />} ></Route>
        <Route path='/songs' element={<Songs list={songListing}/>}></Route>
        <Route path='/addSong' element={<AddSong allSongs={songListing} newList={updateList}/>}></Route>
        <Route path='/editSong' element={<EditSong allSongs={songListing} chosenSong={editSong} newList={updateList}/>}></Route>
        <Route path='/songs/:songtitle' element={<SongItem list={songListing}/>}></Route>
        <Route path='/chords' Component={Chords}></Route>
        <Route path='/mysongs' element={<Mysongs list={songListing} newList={updateList} editDetails={goToEdit}/>}></Route>
        <Route path='/login' element={<Login setAuthToken={setAuthToken} setUserData={setUserData} />}></Route>
        <Route path='/songslist/:user' element={<Songby allSongs={songListing} />}></Route>
      </Routes>
     </Router>
    </div>
    </>
  );
}

export default App;
