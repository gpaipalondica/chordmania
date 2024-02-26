import React from 'react'
import { useNavigate} from 'react-router-dom';
import './Songs.css'
import Loader from '../Helper/Loader';
import { useEffect } from 'react';

function Songs({list}) {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  let listingSongs = list

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
        const isVis = snName.textContent.toLowerCase().includes(target)
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
    console.log(songName);

    nav(`/songs/${songName}`)
  }

  function addSongPage(){
    nav('/addSong')
  }

  return (
    <div className="songs">
     

        <button onClick={addSongPage} className='addSong'><span>+</span><p>Add Song</p></button>


      <h3>All songs</h3>

      <div className="songs-search-bar">
          <input className='searchSong' type="text" placeholder='Search...' onChange={searchInput}/>
          <button onClick={clearInput}>Clear</button>
      </div>

      <p className="songSearchResult"></p>

      <div className="songs-list">
        {listingSongs ? listingSongs.slice().sort((a, b) => a.songname.localeCompare(b.songname)).map((sl,i) =>{
          return( 
          <div key={i} className="song-tab" onClick={viewSong}>
            <h4 className="song-title">{sl.songname}</h4>
            <p className="artist-name">{sl.artistname}</p>
          </div>
        )})
        : <Loader />
        }
      </div>

    </div>

  )
}

export default Songs