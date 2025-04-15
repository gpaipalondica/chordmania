import React, { useRef, useState } from 'react'
import './Chords.css'
import { useEffect } from 'react';

function Piano() {

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  let originalArray=['C', 'Csh', 'D', 'Dsh', 'E', 'F', 'Fsh', "G", "Gsh", "A", "Ash", "B"]

  let [duplicateArray, setDuplicateArray] = useState(originalArray)

  const keysToMapped = {
    d: duplicateArray[0],
    r: duplicateArray[1],
    f: duplicateArray[2],
    t: duplicateArray[3],
    g: duplicateArray[4],
    h: duplicateArray[5],
    u: duplicateArray[6],
    j: duplicateArray[7],
    i: duplicateArray[8],
    k: duplicateArray[9],
    o: duplicateArray[10],
    l: duplicateArray[11],
    ';': duplicateArray[0].includes('prev') ? duplicateArray[0].split('prev')[0] : `${duplicateArray[0]}next`,
    // "'": duplicateArray[2].includes('prev') ? duplicateArray[2].split('prev')[0] : `${duplicateArray[2]}next`,

  };

  function rotateArr(x){
    if(x === -1){
      // console.log("Reverse");
      let arr = duplicateArray
      let last = arr.pop()
      if(last.includes('next')){
        last = last.replace('next', '')
      }
      else {
        last = last + 'prev'
      }
      // console.log("LAST", last);
      arr.unshift(last)
      setDuplicateArray(arr)
    }
    else if(x === 1){
      // console.log("Forward");
      let arr = duplicateArray
      let first = arr.shift()
      if(first.includes('prev')){
        first = first.replace('prev', '')
      }
      else {
        first = first + 'next'
      }
      // console.log("FIRST", first);
      arr.push(first)
      setDuplicateArray(arr)
    }
  }

  // console.log('chordsArr', duplicateArray);

  // const keysToMapped = {
  //   d: 'C',
  //   r: 'Csh',
  //   f: 'D',
  //   t: 'Dsh',
  //   g: 'E',
  //   h: 'F',
  //   u: 'Fsh',
  //   j: 'G',
  //   i: 'Gsh',
  //   k: 'A',
  //   o: 'Ash',
  //   l: 'B',
  //   ';': 'Cnext',
  //   "'": 'Dnext'
  // };

  const pressedKeys = useRef(new Set());
  let [octaveCount, setOctaveCount] = useState(2)
  let [transposeCount, setTransposeCount] = useState(0)

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
          setOctaveCount(prev => Math.min(prev + 1, 4));
        }

        if (keyPressed === 'q') {
          setTransposeCount(prev => Math.max(prev - 1, -11));
          rotateArr(-1)
        }
        if (keyPressed === 'w') {
          setTransposeCount(prev => Math.min(prev + 1, 11));
          rotateArr(1)
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
  }, [octaveCount, transposeCount]);


  const audioMap = {};

  // const loadSounds = () => {
  //   const notes = ['C0', 'Csh0', 'D0', 'Dsh0', 'E0', 'F0', 'Fsh0', 'G0', 'Gsh0', 'A0', 'Ash0', 'B0','C1', 'Csh1', 'D1', 'Dsh1', 'E1', 'F1', 'Fsh1', 'G1', 'Gsh1', 'A1', 'Ash1', 'B1', 'C2', 'Csh2', 'D2', 'Dsh2', 'E2', 'F2', 'Fsh2', 'G2', 'Gsh2', 'A2', 'Ash2', 'B2', 'C3', 'Csh3', 'D3', 'Dsh3', 'E3', 'F3', 'Fsh3', 'G3', 'Gsh3', 'A3', 'Ash3', 'B3', 'C4', 'Csh4', 'D4', 'Dsh4', 'E4', 'F4', 'Fsh4', 'G4', 'Gsh4', 'A4', 'Ash4', 'B4', 'C5', 'Csh5', 'D5', 'Dsh5', 'E5', 'F5', 'Fsh5', 'G5', 'Gsh5', 'A5', 'Ash5', 'B5', 'C6', 'Csh6', 'D6', 'Dsh6', 'E6', 'F6', 'Fsh6', 'G6', 'Gsh6', 'A6', 'Ash6', 'B6',] 
  //   notes.forEach(note => {
  //     const audio = new Audio(require('../Assets/pianonotes/'+note+'.mp3'));
  //     audio.load();
  //     audioMap[note] = audio;
  //   });
  //   // console.log(audioMap);
  // };

  const loadSounds = () => {
    // Clean up old audio
    Object.values(audioMap).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    Object.keys(audioMap).forEach(key => delete audioMap[key]);
  
    const notes = ['C0', 'Csh0', 'D0', 'Dsh0', 'E0', 'F0', 'Fsh0', 'G0', 'Gsh0', 'A0', 'Ash0', 'B0','C1', 'Csh1', 'D1', 'Dsh1', 'E1', 'F1', 'Fsh1', 'G1', 'Gsh1', 'A1', 'Ash1', 'B1', 'C2', 'Csh2', 'D2', 'Dsh2', 'E2', 'F2', 'Fsh2', 'G2', 'Gsh2', 'A2', 'Ash2', 'B2', 'C3', 'Csh3', 'D3', 'Dsh3', 'E3', 'F3', 'Fsh3', 'G3', 'Gsh3', 'A3', 'Ash3', 'B3', 'C4', 'Csh4', 'D4', 'Dsh4', 'E4', 'F4', 'Fsh4', 'G4', 'Gsh4', 'A4', 'Ash4', 'B4', 'C5', 'Csh5', 'D5', 'Dsh5', 'E5', 'F5', 'Fsh5', 'G5', 'Gsh5', 'A5', 'Ash5', 'B5', 'C6', 'Csh6', 'D6', 'Dsh6', 'E6', 'F6', 'Fsh6', 'G6', 'Gsh6', 'A6', 'Ash6', 'B6',]
    notes.forEach(note => {
      const audio = new Audio(require(`../Assets/pianonotes/${note}.mp3`));
      audio.load();
      audioMap[note] = audio;
    });
  };

  useEffect(() => {
    loadSounds();
  }, [octaveCount, transposeCount]);



  function playSound(x){
    // console.log('playSound ', x);
    let note
    // if(x === 'Dnext') {
    //   note = `D${parseInt(octaveCount)+1}`
    // }
    // else if(x === 'Cnext'){
    //   note = `C${parseInt(octaveCount)+1}`
    // }
    if(x.includes('next')){
      let nt=x.split('next')[0]
      note = `${nt}${parseInt(octaveCount)+1}`
    }
    else if(x.includes('prev')){
      let nt=x.split('prev')[0]
      note = `${nt}${parseInt(octaveCount)-1}`
    }
    else{
      note = x+octaveCount
    }

    // if(x=== 'Cnext'){
    //   let whichNote = require('../Assets/pianonotes/C'+(octaveCount+1)+'.mp3')
  
    //   let aud = new Audio(whichNote)
    //   aud.play()
    // }
    // else {
    //   let whichNote = require('../Assets/pianonotes/'+x+octaveCount+'.mp3')
  
    //   let aud = new Audio(whichNote)
    //   aud.play()

    // }

    audioMap[note].currentTime = 0;
    audioMap[note].play();
    
  }

  // console.log(audioMap);

  


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

    <div className='chords' style={{height:'90vh'}}>
      <h2 className="title">Play Piano</h2>
      
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
        <div style={{position:'relative'}}>
          <h2 style={{position:'absolute', top:0}}>C{octaveCount}</h2>
          <h2 style={{position:'absolute', top:0, left:705}}>C{octaveCount+1}</h2>
          <div style={{marginTop:40, width:'800px', height:300, border:'1px solid black', display:'flex', position:'relative'}}>
            <button onClick={() => playSound('C')} className='whiteButton' id='d'>D</button>
            <button onClick={() => playSound('D')} className='whiteButton' id='f'>F</button>
            <button onClick={() => playSound('E')} className='whiteButton' id='g'>G</button>
            <button onClick={() => playSound('F')} className='whiteButton' id='h'>H</button>
            <button onClick={() => playSound('G')} className='whiteButton' id='j'>J</button>
            <button onClick={() => playSound('A')} className='whiteButton' id='k'>K</button>
            <button onClick={() => playSound('B')} className='whiteButton' id='l'>L</button>
            <button onClick={() => playSound('Cnext')} className='whiteButton' id=';'>;</button>
            {/* <button onClick={() => playSound('Dnext')} className='whiteButton' id="'">'</button> */}

            <button onClick={() => playSound('Csh')} className='blackButton' style={{left:'75px'}} id='r'>R</button>
            <button onClick={() => playSound('Dsh')} className='blackButton' style={{left:'175px'}} id='t'>T</button>
            <button onClick={() => playSound('Fsh')} className='blackButton' style={{left:'375px'}} id='u'>U</button>
            <button onClick={() => playSound('Gsh')} className='blackButton' style={{left:'475px'}} id='i'>I</button>
            <button onClick={() => playSound('Ash')} className='blackButton' style={{left:'575px'}} id='o'>O</button>
          </div>
          

          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:170, marginTop:50}}>
            <div>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:10}}>
                <h3>Octave</h3>
                <input type="text" readOnly value={octaveCount} style={{fontSize:25, width:80, textAlign:'center'}} />
              </div>
              <p style={{fontStyle:'italic', marginTop:10}}>(press Z for -1 and X for +1)</p>
            </div>
            <div>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:10}}>
                <h3>Transpose</h3>
                <input type="text" readOnly value={transposeCount} style={{fontSize:25, width:80, textAlign:'center'}} />
              </div>
              <p style={{fontStyle:'italic', marginTop:10}}>(press Q for -1 and W for +1)</p>
            </div>
          </div>

        </div>
      </div>
      
    </div>
    </>
  )
}

export default Piano