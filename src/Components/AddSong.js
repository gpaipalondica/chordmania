import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSong.css'

function AddSong({newList}) {

  let nav3= useNavigate()

  let [formProps, setFormProps] = useState({});

  function myFunction(e){
    e.preventDefault()
    let form = document.getElementById('myform1')

    let formData = new FormData(form)
    let formDetails = Object.fromEntries(formData);

    console.log(formDetails);

    setFormProps({"songname": formDetails.songName, "artistname": formDetails.artistName, "capo":formDetails.capo, "lyrics": formDetails.lyrics, "ownername": formDetails.ownerName})

    document.getElementById('myform1').style.display = 'none'
    document.querySelector('.part2').style.display = 'flex'


    let lyrics = formDetails.lyrics

    getChordsFunction(lyrics)

  }
  console.log("FP",formProps);

  function getChordsFunction(passedLyrics){
    
    let para = passedLyrics.split('\n\n');
    let line = para.map(p => p.split('\n'));
    let word = line.map(l => l.map(w => w.split(" ")))


    let disp = document.querySelector('.displayLyrics')
    // console.log("W", word);

    word.forEach((x,i) => {
        let paraDiv = document.createElement('div')
        paraDiv.setAttribute('class',`paraDisp`)
        // console.log(x);
        x.forEach((y,j) => {
            // console.log(y);
            let lineDiv = document.createElement('div')
            lineDiv.setAttribute('class', `lineDisp`) 
            paraDiv.appendChild(lineDiv)
            y.forEach((z,k) => {
                let button = document.createElement('button')
                button.setAttribute('class', `wordDisp`)
                button.setAttribute('id', `p${i}-l${j}-w${k}`)
                button.innerHTML = z
                // console.log(z);
                lineDiv.appendChild(button)
            })
        })
        disp.appendChild(paraDiv)
    })
  } 

if(document.querySelector('.wordDisp')){
  document.querySelectorAll('.wordDisp').forEach(x => {
    
    x.addEventListener('click', (e) => {
  
        console.log(e.currentTarget);

        let pos = e.currentTarget.id
  
        let smDiv = document.createElement('div')
        smDiv.setAttribute('class','smDiv')
  
        let smInput = document.createElement('input')
        smInput.setAttribute('class', 'chordName')
        smInput.setAttribute('name', 'chordName')
        smInput.setAttribute('placeholder', 'Enter Chord Name')
        smInput.setAttribute('type','text')
  
        let enter = document.createElement('button')
        enter.setAttribute('class', 'chordBtn')
        enter.addEventListener('click', (() => {
          chordArrItem(pos, smInput.value, smDiv)}) )
        enter.innerHTML='Set'
  
        smDiv.appendChild(smInput)
        smDiv.appendChild(enter)
  
        document.querySelector('.chordSetter').appendChild(smDiv)
  
    })
  })
}

  let chordsArray = []

  function chordArrItem(x,y,z) {

      z.style.display = 'none'

      document.querySelectorAll('.smDiv').forEach(x=>{
        x.style.display='none'
      })

      document.querySelector('.chordList').innerHTML = ''

      let position = x;
      let chord = y

      console.log("Hi",position,chord,z);

      let existingChord = chordsArray.find(item => item.pos === position);

      if(chord !== ''){
          if (!existingChord) {
              chordsArray.push({ "pos": position, "chord": chord });
          } else {
              existingChord.chord = chord;
          }
      }else{
          alert("Enter Chord Value")
      }

      console.log("ChArr",chordsArray);

      chordsArray.forEach(item => {
          let chordItem = document.createElement('p')
          chordItem.setAttribute('class','cItem')
          let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
          let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
          let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
          chordItem.innerHTML = 'Para '+para+', Line '+line+', Word '+word +':  '+item.chord;
          document.querySelector('.chordList').appendChild(chordItem)
      })

  }



  function showJsonData(){
      let data = {
          "songname": `${formProps.songname}`,
          "artistname": `${formProps.artistname}`,
          "lyrics": `${formProps.lyrics}`,
          "chords": chordsArray,
          "ownername": `${formProps.ownername}`,
          "capo":`${formProps.capo}`
      }
      console.log("DATA",data);

      fetch('https://firstnodejstest.azurewebsites.net/createSong',{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(res => {
          console.log(res);
          newList('refresh')
          nav3('/songs')
        })
        .catch(error => {
          console.log('Error in POST function', error);
          return error
        });
  }

 
  return (
    <div className='create-song'>
      <h3>Add a song</h3>

      <form id="myform1" onSubmit={myFunction}>
        <div className="form-group">
            <label htmlFor="songName">Song Name: </label>
            <input required type="text" name="songName" />
        </div>
        <div className="form-group">
            <label htmlFor="artistName">Artist Name: </label>
            <input required type="text" name="artistName" />
        </div>
        <div className="form-group">
            <label htmlFor="capo">Capo: </label>
            <input type="number" min="0" max="12" defaultValue={0} name="capo"/>
        </div>
        <div className="form-group">
            <label htmlFor="lyrics">Lyrics: </label>
            <textarea required type="text" name="lyrics" ></textarea>
        </div>

        <div className="form-group">
            <label htmlFor="ownerName">Your name: </label>
            <input type="text" name="ownerName"/>
        </div>
        <div className="formButtons">
          <button id='clear' type="reset">Clear</button>
          <button id='next' type="submit">Next</button>
        </div>
    </form>


      <div className="part2">
        
        <p>Click on a word to assign/replace chord</p>
        
        <div className="lyrics-container">
          <div className="displayLyrics">
              
          </div>
          <div className="right">
              <div className="chordSetter"></div>
              <h3>List</h3>
              <div className="chordList"></div>
          </div>

        </div>
          <button className='songadded' onClick={showJsonData}>Add to Chord Mania</button>
      </div>
    
    </div>
  )
}

export default AddSong