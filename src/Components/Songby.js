import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Helper/Loader';
import './Songby.css'

function Songby({allSongs}) {

    let {user} = useParams()

    const [myList, setMyList] = useState(null)


    useEffect(() => {
        let filterSongs = allSongs.filter(song => song.ownername === user)
        setMyList(filterSongs)
    },[allSongs])

    let nav = useNavigate()

    function viewSong(e){
        e.stopPropagation()
        let songName = e.currentTarget.querySelector('.usersong-title').innerText
    
        nav(`/songs/${songName}`)
      }

  return (
    <div className='mysongs'>
      {/* {loading && <Loader/>} */}

      <h3>{user}'s list</h3>

      <div className="mysongs-list">
        {myList ? myList.slice().sort((a, b) => a.songname.localeCompare(b.songname)).map((sl,i) =>{
          return( 
          <div key={i} id={sl._id} className="usersong-tab" >
            <div className='usersong-details' onClick={viewSong}>
              <h4 className="usersong-title">{sl.songname.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h4>
              <p className="userartist-name">{sl.artistname.toUpperCase()}</p>
            </div>
            
          </div>
        )})
        : <Loader />
        }
        </div>
    </div>
  )
}

export default Songby