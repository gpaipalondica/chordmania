import React, { useState } from 'react'
import './Chords.css'
import {Chordlist} from '../Helper/Chordlist'
import { useEffect } from 'react';

function Chords() {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  console.log('CL',Chordlist);

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
      console.log(e.target.value);
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
        chName.parentNode.classList.toggle('hide',!isVis)
        
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


  return (
    <div className='chords'>
      <h2 className="title">Learn Chords</h2>

      <div className="chord-category">
        <button id='guitar' className='chord-btn' onClick={() => showCat('guitar')}>Guitar</button>
        <button id='piano' className='chord-btn'onClick={() => showCat('piano')}>Piano</button>
      </div>


      <div className="search-bar">
        <input type="text" placeholder='Search...' onChange={searchMe}/>
        <button onClick={cancelInput}>Cancel</button>
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
            <p className="chord-name">{x.name}</p>
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