import React, { useEffect } from 'react'
import { useNavigate} from 'react-router-dom';
import './Songs.css'
import { Songlist } from '../Helper/Songlist';

function Songs() {
  
  useEffect(()=>{
    window.scrollTo(0,0)
  })

  function searchInput(){
    
  }

  let nav = useNavigate()
  
  function viewSong(e){
    let songName = e.currentTarget.querySelector('.song-title').innerText
    console.log(songName);

    nav(`/songs/${songName}`)
  }

  return (
    <div className="songs">
      <div className="songs-search-bar">
          <input type="text" placeholder='Search...'/>
          <button onClick={searchInput}>Search</button>
      </div>

      <h3>Popular songs</h3>

      <div className="songs-list">
        {Songlist.map((sl,i) =>{
          return( 
          <div key={i} className="song-tab" onClick={viewSong}>
            <h4 className="song-title">{sl.name}</h4>
            <p className="artist-name">{sl.artist}</p>
        </div>
        )})}
      </div>

    </div>

  )
}

export default Songs