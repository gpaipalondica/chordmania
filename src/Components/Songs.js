import React from 'react'
import { useNavigate} from 'react-router-dom';
import './Songs.css'
import Loader from '../Helper/Loader';

function Songs({list}) {

  
  let listingSongs = list

  function searchInput(){
    
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
      <div className="songs-search-bar">
          <input type="text" placeholder='Search...'/>
          <button onClick={searchInput}>Search</button>
      </div>

        <button onClick={addSongPage} className='addSong'><span>+</span>Add Song</button>


      <h3>All songs</h3>

      <div className="songs-list">
        {listingSongs ? listingSongs.map((sl,i) =>{
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