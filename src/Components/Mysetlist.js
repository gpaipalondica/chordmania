import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../Helper/Loader'
import './Mysongs.css'
import { url } from './variables'

function Mysetlist({}) {

  const [loading, setLoading] = useState(false)

  const [myList, setMyList] = useState(null)
  
  const [user, setUser] = useState(null)  

  useEffect(()=>{
    let user2 = JSON.parse(sessionStorage.getItem('user')).userId
    if(user2){
      // console.log(user2);
      setUser(user2)
      getSetlists(user2)
    }

    if(sessionStorage.getItem('setlistObj2')){
      sessionStorage.removeItem('setlistObj2')
    }
  },[])


  function getSetlists(x){
    // console.log(x);
    setLoading(true)
    if(x !== undefined){
      try {
        fetch(`${url}/allSetlistByUser/${x}`,{
          method:'GET'
        })
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          setMyList(data)
          setLoading(false)
        })
        .catch(err => {
          console.log(err);
        })
        
      } catch (error) {
        console.log(error);
      }
    }
  }



  let nav = useNavigate()

  function addSetlistPage(){
    nav('/editsetlist')

  }


  function showMyOptions(e){
    e.stopPropagation();
    let tar = e.currentTarget

    // let isact = tar.parentNode.querySelector('.showOptions')
    
    if(tar.innerHTML === `<svg stroke="currentColor" fill="currentColor" strokewidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`){
        tar.innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>`
        tar.parentNode.querySelector('.showOptions').style.display='none'
        tar.parentNode.querySelector('.showOptions').classList.remove('active')
    }


    else {
      
    document.querySelectorAll('.showOptions').forEach(x => {
      x.classList.remove('active')
      x.style.display = 'none'
    })

    document.querySelectorAll('.changesvg').forEach(y => {
      y.innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>`
    })
    
    tar.innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`
    tar.parentNode.querySelector('.showOptions').classList.add('active')
    tar.parentNode.querySelector('.showOptions').style.display='flex'
    }
    
  }


  function viewSetlistSongs(x2){
    // console.log(x2);
    sessionStorage.setItem('passSetlist', JSON.stringify(x2))
    nav(`/mysetlist/${x2.setlistId}`)
  }


  function deleteSetlist(x){
    // console.log(x);

    let conf = window.confirm( "Are you sure to delete this setlist? id="+x)
    
    if (conf === true) {
      setLoading(true)
      document.querySelectorAll('.showOptions').forEach(y => {
        y.classList.remove('active')
        y.style.display='none'
      })

      fetch(url+'/deleteSetlist/'+x, 
          {method:'DELETE'
          })
            .then(response => response.json())
            .then(data => {
              // console.log(data);
              getSetlists(user);
            })
            .catch(error => {
              console.log('Error in DELETE function', error);
            });
    }
  }


  function editMySetlist(x){
    let setlistObj = x
    // console.log(songObj);
    sessionStorage.setItem('setlistObj', JSON.stringify(setlistObj))
    // editSet(setlistObj)
    nav('/editsetlist')
  }

  return (
    <div className='mysongs'>
      {loading && <Loader/>}

        <button onClick={addSetlistPage} className='addSong'><span>+</span><p>Add Setlist</p></button>
    
        <h2>My Setlists</h2>

        <div className="mysongs-list">
        {myList && myList.length > 0 ? 
        myList.map((sl,i) =>{
          return( 
          <div key={i} id={sl._id} className="mysong-tab" >
            <div className='mysong-details' onClick={() => viewSetlistSongs(sl)}>
              <h4 className="mysong-title">{sl.setlistName}</h4>
            </div>
            
            <div className='mysong-options'>
              <div className="changesvg" onClick={(e) => showMyOptions(e)}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd"></path></svg>
              </div>
              
              <div className='showOptions'>
                <button className='editSong' 
                onClick={() => editMySetlist(sl)}
                >Edit Setlist</button>
                <button className='deleteSong' 
                onClick={() => deleteSetlist(sl.setlistId)}
                >Delete Setlist</button>
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

export default Mysetlist