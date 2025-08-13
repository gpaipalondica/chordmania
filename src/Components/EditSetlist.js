import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Helper/Loader';
import './EditSong.css'
import { url } from './variables';

function EditSetlist({list}) {

  let [loading, setLoading] = useState(false)

  let [editMode, setEditMode] = useState(false)

  let [title, setTitle] = useState('')

  let [mySetlist, setMySetlist] = useState([])

  let nav = useNavigate()

  useEffect(() => {
    // console.log(list);
    if(list){

      let checkObj = sessionStorage.getItem('setlistObj')
      
      if(checkObj){
        let setlistObj2 = JSON.parse(checkObj)
        if(setlistObj2){
            setDuplicate(setlistObj2.songArray)
            setTitle(setlistObj2.setlistName)
            showSongs(setlistObj2.songArray)
            setEditMode(true)
            setMySetlist(setlistObj2)
          }else {
            setOtherSongs(list)
            setEditMode(false)
        }
        } else {
          setOtherSongs(list)
          setEditMode(false)
      }
    }
  }, [list])

  const [user, setUser] = useState(null)
  
  useEffect(()=>{
      let user2 = JSON.parse(sessionStorage.getItem('user'))
      console.log(user2);
      if(user2){
        setUser(user2)
      }
    },[])


  let [duplicate, setDuplicate] = useState([])

  let [selectedSongs, setSelectedSongs] = useState([])
  let [otherSongs, setOtherSongs] = useState([])


  function showSongs(y){

    setLoading(true)

    // console.log("arr", y);
    if(list){

      // let filter2 = list.filter(obj => y.includes(obj.songId));
      let filter2 = y
      .map(id => list.find(obj => obj.songId === id)) // match IDs in order of x
      .filter(Boolean);

      // console.log("f2", filter2);
      setSelectedSongs(filter2)

      let others = list.filter(obj => !y.includes(obj.songId));
      setOtherSongs(others)
      
      setLoading(false)

      // console.log(selectedSongs);

    }
  }

  function addSongToList(id) {
    console.log(id);
  
    // // Ensure it's always an array
    let newArr = Array.isArray(duplicate) 
      ? [...duplicate]   // copy so we don't mutate directly
      : [];
  
    console.log(newArr, Array.isArray(newArr) ? 'array' : typeof newArr);
  
    newArr.push(id);
  
    console.log(newArr);

    setDuplicate(newArr)

    showSongs(newArr);

    // setTimeout(() => {
    //   scrollViewRef.current?.scrollToEnd({ animated: true });
    // }, 0);
  }

  function removeSongFromList(id) {
    console.log(id);
  
    // Ensure it's always an array
    let newArr = Array.isArray(duplicate) 
      ? duplicate.filter(songId => songId !== id) // remove matches
      : [];
  
    console.log(newArr, Array.isArray(newArr) ? 'array' : typeof newArr);
  
    setDuplicate(newArr);
  
    showSongs(newArr);
  
    // Optional: scroll to bottom after removing (if you want)
    // setTimeout(() => {
    //   scrollViewRef.current?.scrollToEnd({ animated: true });
    // }, 0);
  }

  function changeOrder(id, direction) {
      
    // console.log(id);

  // Ensure it's always an array
    let currentOrder = Array.isArray(duplicate) 
      ? [...duplicate]   // copy so we don't mutate directly
      : [];
      
    const index = currentOrder.indexOf(id);

    // can't move past edges
    if (direction === 1 && index === 0) return currentOrder;
    if (direction === 2 && index === currentOrder.length - 1) return currentOrder;

    const updated = [...currentOrder];

    if (direction === 1) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    } else if (direction === 2) {
      [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    }

    setDuplicate(updated)

    showSongs(updated);

  }


  function createSetlist() {
    setLoading(true)
      let d2 = {
        setlistName: title,
        songArray: duplicate,
        userId: user.userId
      }

      // console.log('new setlist', d2);

      try {
        fetch(`${url}/createSetlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(d2)
        })
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          setLoading(false)
           nav('/mysetlist')
        })
        .catch(err => {
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    }


    function saveArray(){
      if(duplicate === mySetlist.songArray && title === mySetlist.setlistName){
        alert('No changes made');
      }
      else {
  
        setLoading(true)
        let d2 = {
          setlistName: title,
          songArray: duplicate
        }

        // console.log(d2);
        // console.log(mySetlist.setlistId);
    
        try {
          fetch(`${url}/updateSetlist/${mySetlist.setlistId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(d2)
          })
          .then(res => res.json())
          .then(data => {
            console.log(data);  
            if(data.modifiedCount === 1){
              // alert("Success")
              nav('/mysetlist')
            }
            else{
              alert("Error")
            }
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

  return (
    <div className='edit-song'>
      {loading && <Loader/>}

      <div style={{display:'flex', gap:10, justifyContent: 'space-between', alignItems:'center'}}>
        <input 
        style={{flex:1, padding:5}}
        placeholder='Enter Setlist Title'
        type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        {!editMode ? 
          <button
          onClick={() => createSetlist()} 
          className='crStBtn'
          style={{backgroundColor:'#11101D'}}
          >Submit</button>
        :
          <button
          onClick={() => saveArray()} 
          className='crStBtn'
          style={{backgroundColor:'green'}}
          >Update</button>
        }
      </div>

      <p style={{marginTop:30, marginBottom:10}}>Selected Songs</p>
      <div className='setListGrid'>
        {selectedSongs && selectedSongs.length > 0 && 
        selectedSongs.map((item, index) => (
          <div key={index} className='editSetlist'>
            <p style={{textTransform:'capitalize'}}>{item.songname}</p>
            
            <div style={{display:'flex', alignItems:'center', gap:10}}>
                <button className='setBtn' onClick={() => changeOrder(item.songId, 1)}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M868 545.5L536.1 163a31.96 31.96 0 0 0-48.3 0L156 545.5a7.97 7.97 0 0 0 6 13.2h81c4.6 0 9-2 12.1-5.5L474 300.9V864c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V300.9l218.9 252.3c3 3.5 7.4 5.5 12.1 5.5h81c6.8 0 10.5-8 6-13.2z"></path></svg></button>
                <button className='setBtn' onClick={() => changeOrder(item.songId, 2)} ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M862 465.3h-81c-4.6 0-9 2-12.1 5.5L550 723.1V160c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v563.1L255.1 470.8c-3-3.5-7.4-5.5-12.1-5.5h-81c-6.8 0-10.5 8.1-6 13.2L487.9 861a31.96 31.96 0 0 0 48.3 0L868 478.5c4.5-5.2.8-13.2-6-13.2z"></path></svg></button>
                <button className='setBtn' onClick={() => removeSongFromList(item.songId)} ><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1.3em" width="1.3em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg></button>
            </div>
          </div>
        ))
        
        }
      </div>

      <p style={{marginTop:30, marginBottom:10}}>Other Songs</p>
      <div className='setListGrid'>
        {otherSongs && otherSongs.length > 0 && 
        otherSongs.sort((a, b) => a.songname.localeCompare(b.songname)).map((item, index) => (
          <div key={index} style={{padding:10, borderBottom:'1px solid black', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <p style={{textTransform:'capitalize'}}>{item.songname}</p>
            <button 
            onClick={() => addSongToList(item.songId)}
            style={{backgroundColor: 'green', color:'white', fontWeight: 500, padding:'0px 8px', cursor:'pointer'}}>Add</button>
          </div>
        ))
        
        }
      </div>

    </div>
  )
}

export default EditSetlist