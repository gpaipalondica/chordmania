import React, { useRef, useState } from 'react'
import './Chords.css'
import { useEffect } from 'react';

function Piano() {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  const keysToMapped = {
    d: 'C',
    f: 'D',
    g: 'E',
    h: 'F',
    j: 'G',
    k: 'A',
    l: 'B',
    r: 'Csh',
    t: 'Dsh',
    u: 'Fsh',
    i: 'Gsh',
    o: 'Ash',
    ';':'Cnext'
  };

  const pressedKeys = useRef(new Set());
  let [octaveCount, setOctaveCount] = useState(2)

  useEffect(() => {
    const handleKeyDown = (event) => {
      let keyPressed = event.key.toLowerCase()

      let showBtn = document.getElementById(keyPressed)

      const action = keysToMapped[event.key];
      if (action && !pressedKeys.current.has(keyPressed)) {
        pressedKeys.current.add(keyPressed);
        showBtn.classList.add('active')
        playSound(keysToMapped[event.key])
      }
      if (!pressedKeys.current.has(keyPressed)) {
        pressedKeys.current.add(keyPressed);

        if (keyPressed === 'z') {
          setOctaveCount(prev => Math.max(prev - 1, 1));
        }
        if (keyPressed === 'x') {
          setOctaveCount(prev => Math.min(prev + 1, 5));
        }

        // Add other key actions if needed
      }
    };

    const handleKeyUp = (event) => {
      let keyPressed = event.key.toLowerCase()
      let showBtn = document.getElementById(keyPressed)

      const action = keysToMapped[event.key];
      pressedKeys.current.delete(keyPressed);
      if (action) {
        showBtn.classList.remove('active')
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [octaveCount]);



  function playSound(x){
    // console.log(x);
    if(x=== 'Cnext'){
      let whichNote = require('../Assets/pianonotes/C'+(octaveCount+1)+'.mp3')
  
      let aud = new Audio(whichNote)
      aud.play()
    }
    else {
      let whichNote = require('../Assets/pianonotes/'+x+octaveCount+'.mp3')
  
      let aud = new Audio(whichNote)
      aud.play()

    }
    
  }

  


  return (
    <>
    <style>
      {`
      .whiteButton {
        border: 1px solid black;
        width: 100px;
        background-color: white;
        color: black;
        font-size: 14px; 
        display: flex; 
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 20px;
      }

      .whiteButton.active, .whiteButton:active{
        background-color: lightgray
      }

      .blackButton {
        width: 50px;
        height: 170px;
        background-color: black;
        position: absolute;
        top:0;
        color:white;
        display: flex; 
        font-size: 14px; 
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 20px;
      }

      .blackButton.active, .blackButton:active{
        background-color: #555;
      }


      `}
    </style>
    <div className='chords'>
      <h2 className="title">Play Piano</h2>

      <h2 style={{position:'absolute', top:120}}>C{octaveCount}</h2>
      <h2 style={{position:'absolute', top:120, left:1050}}>C{octaveCount+1}</h2>
      <div style={{marginTop:40, width:'800px', height:300, border:'1px solid black', display:'flex', position:'relative'}}>
        <button onClick={() => playSound('C')} className='whiteButton' id='d'>D</button>
        <button onClick={() => playSound('D')} className='whiteButton' id='f'>F</button>
        <button onClick={() => playSound('E')} className='whiteButton' id='g'>G</button>
        <button onClick={() => playSound('F')} className='whiteButton' id='h'>H</button>
        <button onClick={() => playSound('G')} className='whiteButton' id='j'>J</button>
        <button onClick={() => playSound('A')} className='whiteButton' id='k'>K</button>
        <button onClick={() => playSound('B')} className='whiteButton' id='l'>L</button>
        <button onClick={() => playSound('Cnext')} className='whiteButton' id=';'>;</button>

        <button onClick={() => playSound('Csh')} className='blackButton' style={{left:'75px'}} id='r'>R</button>
        <button onClick={() => playSound('Dsh')} className='blackButton' style={{left:'175px'}} id='t'>T</button>
        <button onClick={() => playSound('Fsh')} className='blackButton' style={{left:'375px'}} id='u'>U</button>
        <button onClick={() => playSound('Gsh')} className='blackButton' style={{left:'475px'}} id='i'>I</button>
        <button onClick={() => playSound('Ash')} className='blackButton' style={{left:'575px'}} id='o'>O</button>
      </div>
      

      <div>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <h3>Octave</h3>
          <input type="text" readOnly value={octaveCount} style={{fontSize:25, width:80, textAlign:'center'}} />
        </div>
        <p style={{fontStyle:'italic', marginTop:10}}>(press X for +1 and Z for -1)</p>
      </div>
      
    </div>
    </>
  )
}

export default Piano