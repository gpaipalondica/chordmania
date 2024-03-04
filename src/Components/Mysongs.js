import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../Helper/Loader'
import './Mysongs.css'

function Mysongs() {

  const [loading, setLoading] = useState(false)

  const [myList, setMyList] = useState()
  const [user, setUser] = useState()

  const url = 'https://firstnodejstest.azurewebsites.net'
  // const url = 'http://localhost:8080'

  useEffect(() => {
    setLoading(true)
    if(sessionStorage){
      if(sessionStorage.getItem('user')!==null){
        let x = JSON.parse(sessionStorage.getItem('user')).username
        setUser(x)
        // console.log(x);
        fetchData(x)
      }
    }
  },[])

  function fetchData(x){
    let x2 = x
    fetch(url+'/list/'+x2, 
      {method:'GET'
      })
        .then(response => response.json())
        .then(data => {
          //console.log(data);
            setMyList(data)
            setLoading(false)
        })
        .catch(error => {
          console.log('Error in GET function', error);
          return error
        });
  }

  let nav = useNavigate()
  function addSongPage(){
    nav('/addSong')
  }


  function showMyOptions(e, x){
    e.stopPropagation();
    let tar = e.currentTarget
    // console.log(x);

    let isact = tar.parentNode.querySelector('.showOptions')
    if(isact.className === 'showOptions'){
      isact.classList.add('active')
      isact.style.display = 'flex'
      tar.parentNode.querySelector('.changesvg').innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`
    }
    else if(isact.className === 'showOptions active'){
      isact.classList.remove('active')
      isact.style.display = 'none'
      tar.parentNode.querySelector('.changesvg').innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>`
    }

  }


  function viewSong(e){
    e.stopPropagation()
    let songName = e.currentTarget.querySelector('.mysong-title').innerText

    nav(`/songs/${songName}`)
  }


  function deleteSong(x){
    // console.log(x);

    let conf = window.confirm( "Are you sure to delete this song?")
    
    if (conf === true) {
      setLoading(true)
      document.querySelectorAll('.showOptions').forEach(y => {
        y.classList.remove('active')
        y.style.display='none'
      })

      fetch(url+'/song/'+x, 
      {method:'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
            // setMyList(data)
            fetchData(user)
            document.querySelectorAll('.changesvg').forEach(z=>{
              z.innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>`
            })
        })
        .catch(error => {
          console.log('Error in DELETE function', error);
          return error
        });
    }
  }


  // function editSong(x){
  //   let songId = x
  //   console.log(songId);
  //   editDetails(songId)
  // }

  return (
    <div className='mysongs'>
      {loading && <Loader/>}

        <button onClick={addSongPage} className='addSong'><span>+</span><p>Add Song</p></button>
    
        <h3>My songs</h3>

        <div className="mysongs-list">
        {myList ? myList.slice().sort((a, b) => a.songname.localeCompare(b.songname)).map((sl,i) =>{
          return( 
          <div key={i} id={sl._id} className="mysong-tab" >
            <div className='mysong-details' onClick={viewSong}>
              <h4 className="mysong-title">{sl.songname.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h4>
              <p className="myartist-name">{sl.artistname.toUpperCase()}</p>
            </div>
            
            <div className='mysong-options'>

              <div className="changesvg" onClick={(e) => showMyOptions(e,i)}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>
              </div>

                
              <div className='showOptions'>
                {/* <button className='editSong' onClick={() => editSong(sl._id)}>Edit Song</button> */}
                <button className='deleteSong' onClick={() => deleteSong(sl._id)}>Delete Song</button>
              </div>
            </div>
          </div>
        )})
        : <Loader />
        }
        </div>
    </div>
  )
}

export default Mysongs