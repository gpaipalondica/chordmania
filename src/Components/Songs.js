import React from 'react'
import { useNavigate} from 'react-router-dom';
import './Songs.css'
import Loader from '../Helper/Loader';
import { useEffect } from 'react';
import { useState } from 'react';

function Songs({list}) {

  // const [loading, setLoading] =useState(false)

  // console.log('LIST',list);
  let [listingSongs,setListingSongs] = useState(null)

  useEffect(() => {
    setListingSongs(list)
  },[list])

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])


  function searchInput(e){

    let target = e.target.value.toLowerCase();

    if(target === ''){
      document.querySelector('.songSearchResult').style.display = 'none'
      document.querySelector('.songSearchResult').innerHTML = '';
    }else{
      document.querySelector('.songSearchResult').style.display = 'flex'
      document.querySelector('.songSearchResult').innerHTML = `Search result for `+e.target.value;
    }

    let allSongsList = document.querySelectorAll('.song-tab')

    allSongsList.forEach(sn => {
        let snName = sn.querySelector('.song-title')
        let arName = sn.querySelector('.artist-name')
        const isVis = snName.textContent.toLowerCase().includes(target) || arName.textContent.toLowerCase().includes(target)
        snName.parentNode.classList.toggle('hide',!isVis)
        
        if(snName.innerHTML === 'NA'){
          sn.style.display = 'none'
        }
      })
  }

  function clearInput(){
    document.querySelector('.searchSong').value = ''

    document.querySelectorAll('.song-tab').forEach(x => {
      x.classList.remove('hide')
    })

    document.querySelector('.songSearchResult').style.display = 'none'
      document.querySelector('.songSearchResult').innerHTML = '';
  }

  let nav = useNavigate()
  
  function viewSong(e){
    let songName = e.currentTarget.querySelector('.song-title').innerText
    // console.log(songName);

    nav(`/songs/${songName}`)
  }

  function addSongPage(){
    nav('/addSong')
  }

  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    if(sessionStorage){
      if(sessionStorage.getItem('user')!==null){
        setIsSignedIn(true)
      }
    }
  },[])

  return (
    <div className="songs">
        {/* {loading && <Loader/>} */}

        {isSignedIn && 
        <button onClick={addSongPage} className='addSong'><span>+</span><p>Add Song</p></button>
        }


      {/* <h3>All songs</h3> */}
      <h2 className="title">Songs</h2>

      <div className="songs-search-bar">
          <input className='searchSong' type="text" placeholder='Search by Song or Artist' onChange={searchInput}/>
          <button onClick={clearInput}>Clear</button>
      </div>

      <p className="songSearchResult"></p>

      <div className="songs-list">
        {listingSongs ? listingSongs.slice().sort((a, b) => a.songname.localeCompare(b.songname)).map((sl,i) =>{
          return( 
          <div key={i} className="song-tab" onClick={viewSong}>
            <h4 className="song-title">{sl.songname.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h4>
            <p className="artist-name">{sl.artistname.toUpperCase()}</p>
          </div>
        )})
        :
        <Loader/>
        }
      </div>

    </div>

  )
}

export default Songs