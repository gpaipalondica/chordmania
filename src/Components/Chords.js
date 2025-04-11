import React, { useState } from 'react'
import './Chords.css'
import {Chordlist} from '../Helper/Chordlist'
import { useEffect } from 'react';
import Loader from '../Helper/Loader';

function Chords() {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  //console.log('CL',Chordlist);

  let [cat, setCat] = useState('guitar')

  useEffect(() => {

      document.getElementById('guitar').classList.add('active')

      let allChordsList = document.querySelectorAll('.grid-item')
      allChordsList.forEach(ch => {
        let chName = ch.querySelector('.chord-name')        
        if(chName.innerHTML === 'NA'){
          ch.style.display = 'none'
        }
      })
  },[])


  function showCat(x){
      document.querySelectorAll('.chord-btn').forEach(y => {
        y.classList.remove('active')
      })

      if(x === 'guitar'){
        document.querySelector('.colorChart').style.display = 'flex'
      }else{
        document.querySelector('.colorChart').style.display = 'none'
      }

      setCat(`${x}`)
      document.getElementById(x).classList.add('active')
  }
    

  function searchMe(e){
      //console.log(e.target.value);
      let target = e.target.value.toLowerCase();


      if(target === ''){
        document.querySelector('.searchresult').innerHTML = ''
        document.querySelector('.searchresult').style.display = 'none'
      }else{
        document.querySelector('.searchresult').style.display = 'block'
        document.querySelector('.searchresult').innerHTML = 'Search result for '+e.target.value
      }

      let allChordsList = document.querySelectorAll('.grid-item')

      allChordsList.forEach(ch => {
        let chName = ch.querySelector('.chord-name')
        const isVis = chName.textContent.toLowerCase().includes(target)
        chName.parentNode.parentNode.classList.toggle('hide',!isVis)
        
        if(chName.innerHTML === 'NA'){
          ch.style.display = 'none'
        }
      })
  }

  function cancelInput(){
    document.querySelector('.search-bar input').value = ''
    document.querySelectorAll('.grid-item').forEach(x => {
      x.classList.remove('hide');
    })
    document.querySelector('.searchresult').style.display='none';
  }

  let [loading, setLoading] = useState(false)

  function playSound(x,y,z){
    let targ = z.currentTarget
    setLoading(true)

    let whichChord = Chordlist.find(item => item.name === x)
    console.log("WC", whichChord.gsound);
    if(whichChord){
      let aud
      if(y==='guitar'){
       aud = new Audio(whichChord.gsound);
      }else if(y==='piano'){
       aud = new Audio(whichChord.psound);
      }

      aud.play()

      aud.addEventListener('play', () => {
        setLoading(false)
        targ.classList.add('playing')
      })
      aud.addEventListener('ended', () => {
        targ.classList.remove('playing')
      })
    }
    
  }


  return (
    <div className='chords'>
      {loading && <Loader/>}
      <h2 className="title">Learn Chords</h2>

      <div className="chord-category">
        <button id='guitar' className='chord-btn' onClick={() => showCat('guitar')}>Guitar</button>
        <button id='piano' className='chord-btn'onClick={() => showCat('piano')}>Piano</button>
      </div>


      <div className="search-bar">
        <input type="text" placeholder='Search...' onChange={searchMe}/>
        <button onClick={cancelInput}>Clear</button>
      </div>

      <p className='searchresult'></p>

      <div className="colorChart">
        <div className="colorGroup">
          <div className="dot red"></div>
          <p>Index</p>
        </div>
        <div className="colorGroup">
          <div className="dot green"></div>
          <p>Middle</p>
        </div>
        <div className="colorGroup">
          <div className="dot blue"></div>
          <p>Ring</p>
        </div>
        <div className="colorGroup">
          <div className="dot purple"></div>
          <p>Pinky</p>
        </div>
      </div>
      
      <div className="chord-grid">
        {Chordlist
        .slice().sort((a, b) => a.name.localeCompare(b.name))
        .map((x,i) => {
          return(
          <div key={i} className="grid-item">
            <div className='grid-top'>
              <p className="chord-name">{x.name}</p>
              { ((cat  === 'guitar' &&  x.gsound) ||  (cat === 'piano' && x.psound))
               ?
              <button onClick={(e) => playSound(x.name,cat,e)}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" height="1em" width="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 8.02c0 1.09-.45 2.09-1.17 2.83l-.67-.67c.55-.56.89-1.31.89-2.16 0-.85-.34-1.61-.89-2.16l.67-.67A3.99 3.99 0 0 1 12 8.02zM7.72 2.28L4 6H2c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2l3.72 3.72c.47.47 1.28.14 1.28-.53V2.81c0-.67-.81-1-1.28-.53zm5.94.08l-.67.67a6.996 6.996 0 0 1 2.06 4.98c0 1.94-.78 3.7-2.06 4.98l.67.67A7.973 7.973 0 0 0 16 8c0-2.22-.89-4.22-2.34-5.66v.02zm-1.41 1.41l-.69.67a5.05 5.05 0 0 1 1.48 3.58c0 1.39-.56 2.66-1.48 3.56l.69.67A5.971 5.971 0 0 0 14 8.02c0-1.65-.67-3.16-1.75-4.25z"></path></svg></button>
              :  
              <button disabled><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" strokeWidth="2" d="M1,8 L1,16 L6.09901951,16 L12,21 L12,3 L6,8 L1,8 Z M15,9 L21,15 M21,9 L15,15"></path></svg></button>
            }
            </div>
            <img className='chord-image' src={x[cat]} alt="" />
          </div>
          )
        })
        }
      </div>

      
    </div>
  )
}

export default Chords