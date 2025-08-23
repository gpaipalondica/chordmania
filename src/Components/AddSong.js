import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddSong.css'

function AddSong({allSongs, newList}) {

  let allSongsList = allSongs

  let nav3= useNavigate()

  let [formProps, setFormProps] = useState({});

  function myFunction(e){
    e.preventDefault()
    let form = document.getElementById('myform1')

    let formData = new FormData(form)
    let formDetails = Object.fromEntries(formData);

    // console.log("FDT",formDetails.songName);

    // console.log("ASL",allSongsList);

    let titlesong = allSongsList.some(x => x.songname.toLowerCase() === formDetails.songName.toLowerCase());

    if(titlesong){
      alert("This song is already in the list")
    }else{
      setFormProps({"songname": formDetails.songName, "artistname": formDetails.artistName, "capo":formDetails.capo, "lyrics": formDetails.lyrics, "ownername": formDetails.ownerName})
  
      document.getElementById('myform1').style.display = 'none'
  
      window.scrollTo(0,0)
      document.querySelector('.part2').style.display = 'flex'
  
  
      let lyrics = formDetails.lyrics
  
      getChordsFunction(lyrics)
    }


  }
  // console.log("FP",formProps);

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
              let extraDiv = document.createElement('div')
              extraDiv.setAttribute('class', 'addIcon')
              extraDiv.setAttribute('id', `p${i}-l${j}-w${y.length - 1}E`)
              extraDiv.addEventListener('click', (e) => {
                  addSpace(i,j, y.length - 1)
              })
              lineDiv.appendChild(extraDiv)

        })
        disp.appendChild(paraDiv)
    })
  } 

if(document.querySelector('.wordDisp')){
  document.querySelectorAll('.wordDisp').forEach(x => {
    
    x.addEventListener('click', (e) => {
      document.querySelectorAll('.wordDisp').forEach(x => {
        x.classList.remove('active')
      })
      document.querySelectorAll('.addIcon').forEach(x => {
        x.classList.remove('active')
      })

      // console.log(chordsArray);

        // console.log(e.currentTarget);
        let targ = e.currentTarget

        let pos = e.currentTarget.id
        targ.classList.add('active')

  
        let smDiv = document.createElement('div')
        smDiv.setAttribute('class','smDiv')
  
        let smInput = document.createElement('input')
        smInput.setAttribute('class', 'chordName')
        smInput.setAttribute('name', 'chordName')
        smInput.setAttribute('placeholder', 'Enter Chord')
        smInput.setAttribute('type','text')

        
        let enter = document.createElement('button')
        enter.setAttribute('class', 'chordBtn')
        enter.addEventListener('click', (() => {
          let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
          // console.log("CM",chordMod);
          chordArrItem(pos, chordMod, smDiv)
        }) )
        enter.innerHTML='Set'

        let cancelBtn = document.createElement('button')
        cancelBtn.setAttribute('class', 'chordBtn')
        cancelBtn.addEventListener('click', (() => {
          cancelBtnFunc()
        }) )
        cancelBtn.style.width = '30px'
        cancelBtn.innerHTML='X'
  
        smDiv.appendChild(smInput)
        smDiv.appendChild(enter)
        smDiv.appendChild(cancelBtn)
  
        document.querySelector('.chordSetter').appendChild(smDiv)

        smInput.focus()
        smDiv.addEventListener('keydown', ((event) => {
          if (event.key === "Enter"){
            let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
            // console.log("CM",chordMod);
            chordArrItem(pos, chordMod, smDiv)
          }
        }))
  
    })
  })
}

  let [chordsArray, setChordsArray] = useState([])

  function chordArrItem(x,y,z) {

      z.style.display = 'none'

      document.querySelectorAll('.smDiv').forEach(x=>{
        x.style.display='none'
      })

      // document.querySelector('.chordList').innerHTML = ''

      let position = x;
      let chord = y

      // document.getElementById(`${position}`).style.backgroundColor = '#58fc58'
      document.getElementById(`${position}`).classList.add('selected')

      // console.log("Hi",position,chord,z);

      let existingChord = chordsArray.find(item => item.pos === position);

      if(chord !== ''){
          if (!existingChord) {
              // chordsArray.push({ "pos": position, "chord": chord });
              setChordsArray(prev => [...prev, { "pos": position, "chord": chord }])
            } else {
              existingChord.chord = chord;
          }
      }else{
          alert("Enter Chord Value")
      }

      // console.log("ChArr",chordsArray);

      // chordsArray.forEach(item => {
      //     let chordItem = document.createElement('div')
      //     chordItem.setAttribute('class','cItem')
      //     chordItem.setAttribute('id','pos_'+item.pos)
      //     let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
      //     let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
      //     let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
      //     chordItem.innerHTML = 'Para '+para+', Line '+line+', Word '+word +':  '+item.chord;
      //     let delbtn = document.createElement('button')
      //     delbtn.addEventListener('click', ((e) => {
      //       deleteNode(e.currentTarget.parentNode)
      //     }))
      //     delbtn.innerHTML = 'X'
      //     // delbtn.style.cssText=""

      //     chordItem.appendChild(delbtn)
          
      //     document.querySelector('.chordList').appendChild(chordItem)
      // })

  }


  useEffect(() => {

    document.querySelector('.chordList').innerHTML = ''

    chordsArray.forEach(item => {
      let chordItem = document.createElement('div')
      chordItem.setAttribute('class','cItem')
      chordItem.setAttribute('id','pos_'+item.pos)
      let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
      let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
      let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
      // chordItem.innerHTML = 'Para '+para+', Line '+line+', Word '+word +':  '+item.chord;
      chordItem.innerHTML = item.pos[item.pos.length - 1] === 'E'? `Para ${para}, Line ${line} (end):  ${item.chord}`:`Para ${para}, Line ${line}, Word ${word}:  ${item.chord}`
      let delbtn = document.createElement('button')
      delbtn.addEventListener('click', ((e) => {
        deleteNode(e.currentTarget.parentNode)
      }))
      delbtn.innerHTML = 'X'
      // delbtn.style.cssText=""

      chordItem.appendChild(delbtn)
      
      document.querySelector('.chordList').appendChild(chordItem)
  })
  }, [chordsArray])

  function deleteNode(x){
    // console.log(x);
    let pos = x.id.split('_')[1]
    // document.getElementById(pos).style.backgroundColor='#eee'
    document.getElementById(pos).classList.remove('active')
    document.getElementById(pos).classList.remove('selected')

    x.remove()
    let f2 = chordsArray.filter(chordObj => chordObj.pos !== pos);
    // console.log(f2);
    setChordsArray(f2)
  }



  function showJsonData(){
      let data = {
          "songname": `${formProps.songname}`,
          "artistname": `${formProps.artistname}`,
          "lyrics": `${formProps.lyrics}`,
          "chords": chordsArray,
          "ownername": document.getElementsByName('ownerName')[0].value,
          "capo":`${formProps.capo}`
      }
      // console.log("DATA",data);

      document.querySelector('.songadded').style.backgroundColor = '#0d7dc2'
      document.querySelector('.songadded').innerHTML = 'Adding..'

      fetch('https://firstnodejstest.azurewebsites.net/createSong',{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(res => {
          // console.log(res);
          newList('refresh')
          nav3('/songs')
          sessionStorage.setItem('currentPage', 'songs')
        })
        .catch(error => {
          console.log('Error in POST function', error);
          return error
        });
  }

  let [infoFocus, setInfoFocus] = useState(false)

  function showLyricsInfo(){
    setInfoFocus(true)
  }
  function hideLyricsInfo() {
    setInfoFocus(false)
  }

  function closeInfo(){
    setInfoFocus(false)
  }

  function goBack(){
    let yes = window.confirm('Going back will reset all chords')

    if(yes){
      document.getElementById('myform1').style.display = 'flex'
      document.querySelector('.part2').style.display = 'none'
      document.querySelector('.displayLyrics').innerHTML = ''
      document.querySelectorAll('.cItem').forEach(x => {
        x.remove()
      })
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
    }
  }

  function goToAllSongs(){
    document.getElementById('myform1').reset();
    nav3('/songs')
  }

  let [owner, setOwner] = useState()

  useEffect(() => {
    if(sessionStorage){
      if(sessionStorage.getItem('user')!==null){
        let x = JSON.parse(sessionStorage.getItem('user')).username
        // console.log(x);
        setOwner(x)
      }
    }
  },[])


  function addSpace(pIndex, lIndex, wIndex){
    // console.log(pIndex, lIndex, wIndex);
    
    document.querySelectorAll('.addIcon').forEach(x => {
      x.classList.remove('active')
    })
    document.querySelectorAll('.wordDisp').forEach(x => {
      x.classList.remove('active')
    })
    
    let post2 = `p${pIndex}-l${lIndex}-w${wIndex}E`

    document.getElementById(post2).classList.add('active')

    let smDiv = document.createElement('div')
    smDiv.setAttribute('class','smDiv')

    let smInput = document.createElement('input')
    smInput.setAttribute('class', 'chordName')
    smInput.setAttribute('name', 'chordName')
    smInput.setAttribute('placeholder', 'Enter Chord')
    smInput.setAttribute('type','text')

    
    let enter = document.createElement('button')
    enter.setAttribute('class', 'chordBtn')
    enter.addEventListener('click', (() => {
      let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
      // console.log("pos",post2);
      // console.log("CM",chordMod);
      endOfLineChord(post2, chordMod)
    }) )
    enter.innerHTML='Set'

    let cancelBtn = document.createElement('button')
    cancelBtn.setAttribute('class', 'chordBtn')
    cancelBtn.addEventListener('click', (() => {
      cancelBtnFunc()
    }) )
    cancelBtn.style.width = '30px'
    cancelBtn.innerHTML='X'

    smDiv.appendChild(smInput)
    smDiv.appendChild(enter)
    smDiv.appendChild(cancelBtn)

    document.querySelector('.chordSetter').appendChild(smDiv)

    smInput.focus()
        smDiv.addEventListener('keydown', ((event) => {
          if (event.key === "Enter"){
            let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
            // console.log("CM",chordMod);
            endOfLineChord(post2, chordMod)
            // chordArrItem(post2, chordMod, smDiv)
          }
        }))

  }


  function cancelBtnFunc(){
    document.querySelectorAll('.smDiv').forEach(x=>{
      x.style.display='none'
    })
    document.querySelectorAll('.addIcon').forEach(x => {
      x.classList.remove('active')
    })
    document.querySelectorAll('.wordDisp').forEach(x => {
      x.classList.remove('active')
    })
  }

  function endOfLineChord(x,y){

    document.querySelectorAll('.smDiv').forEach(x=>{
      x.style.display='none'
    })
  
    // document.querySelector('.chordList').innerHTML = ''
  
    let position = x;
    let chord = y
  
    document.getElementById(`${position}`).classList.add('selected')
  
    // console.log("Hi",position,chord);

    let existingChord = chordsArray.find(item => item.pos === position);

    if(chord !== ''){
        if (!existingChord) {
            // chordsArray.push({ "pos": position, "chord": chord });
            setChordsArray(prev => [...prev, { "pos": position, "chord": chord }])
        } else {
            existingChord.chord = chord;
        }
    }else{
        alert("Enter Chord Value")
    }
  
    // console.log("ChArr",chordsArray);
  
    // chordsArray.forEach(item => {
    //     let chordItem = document.createElement('div')
    //     chordItem.setAttribute('class','cItem')
    //     chordItem.setAttribute('id','pos_'+item.pos)
    //     let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
    //     let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
    //     let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
    //     chordItem.innerHTML = item.pos[item.pos.length - 1] === 'E'? `Para ${para}, Line ${line}, Word ${word}E:  ${item.chord}`:`Para ${para}, Line ${line}, Word ${word}:  ${item.chord}`
    //     let delbtn = document.createElement('button')
    //     delbtn.addEventListener('click', ((e) => {
    //       deleteNode(e)
    //     }))
    //     delbtn.innerHTML = 'X'
  
    //     chordItem.appendChild(delbtn)
        
    //     document.querySelector('.chordList').appendChild(chordItem)
    // })
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
            <label className='lyricswordrow' htmlFor="lyrics"> <p>Lyrics: </p><button type='button' tabIndex={0} onFocus={showLyricsInfo} onBlur={hideLyricsInfo} className='lyricsinfo'><svg style={{pointerEvents:'none'}} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path></svg></button>
            {infoFocus && 
            <p className='lyricInfoDisp'> <button type="button" className='cancelInfo' onClick={closeInfo}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M354 671h58.9c4.7 0 9.2-2.1 12.3-5.7L512 561.8l86.8 103.5c3 3.6 7.5 5.7 12.3 5.7H670c6.8 0 10.5-7.9 6.1-13.1L553.8 512l122.4-145.9c4.4-5.2.7-13.1-6.1-13.1h-58.9c-4.7 0-9.2 2.1-12.3 5.7L512 462.2l-86.8-103.5c-3-3.6-7.5-5.7-12.3-5.7H354c-6.8 0-10.5 7.9-6.1 13.1L470.2 512 347.9 657.9A7.95 7.95 0 0 0 354 671z"></path><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path></svg></button> How to add lyrics for best results? <br/><br/>
            Keep each paragraph of lyrics separated by pressing Enter twice. <br/><br/>
            Keep each line of the lyrics separated by pressing Enter  once. <br/><br/>
            Words in each line should be separated by one Space.
            </p>
            }
            </label>
            <textarea required type="text" name="lyrics" ></textarea>
        </div>

        <div className="form-group" style={{display:'none'}}>
            <label htmlFor="ownerName">Your name: </label>
            <input defaultValue={owner} disabled type="text" name="ownerName"/>
        </div>
        <div className="formButtons">
          <button id='toAllSongs' type="button" onClick={goToAllSongs}>Back</button>
          <button id='next' type="submit">Next</button>
        </div>
    </form>


      <div className="part2">
        
        <p>Click on a word to assign/replace chord. Scroll down to add song</p>
        
        <div className="lyrics-container">
          <div className="displayLyrics">
              
          </div>
          <div className="right">
              <div className="chordSetter"></div>
              <h3>List</h3>
              <div className="chordList"></div>
          </div>

        </div>
        <div className="part2btn">
          <button className='goback' onClick={goBack}>Back</button>
          <button className='songadded' onClick={showJsonData}>Add to Chord Mania</button>

        </div>
      </div>
    
    </div>
  )
}

export default AddSong