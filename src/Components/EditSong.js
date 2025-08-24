import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Helper/Loader';
import './EditSong.css'
import { url } from './variables';

function EditSong({allSongs, chosenSong, newList}) {

  let [loading, setLoading] = useState(false)

  let [songToEdit, setSongToEdit] = useState(null)

  let [chordArray, setChordArray]=useState([])
  let [formProps, setFormProps] = useState({})

  let nav = useNavigate()

  useEffect(() => {
    setSongToEdit(chosenSong)
    // console.log('HAHA',chosenSong);
    if(chosenSong){
      setFormProps({"songname":chosenSong.songname,
      "artistname":chosenSong.artistname,
      "capo":chosenSong.capo,
      "lyrics":chosenSong.lyrics
    })
    }
  },[chosenSong])


  function goBack(){
    let yes = window.confirm('Going back will reset all chords')

    if(yes){
      document.querySelector('.part1').style.display = 'none'
      document.getElementById('edit-myform1').style.display = 'flex'
      document.querySelector('.edit-displayLyrics').innerHTML = ''
      setChordArray([])
      document.querySelectorAll('.edit-cItem').forEach(x => {
        x.remove()
      })
      window.scrollTo({
        top:0,
        behavior:'smooth'
      })
    }
  }

  let allSongsList = allSongs

  function myFunc(e){
    e.preventDefault()
    let form = document.getElementById('edit-myform1')

    let formData = new FormData(form)
    let formDetails = Object.fromEntries(formData);

    // console.log("FDT",formDetails.songName);

    // console.log("ASL",allSongsList);

    let titlesong = allSongsList.some(x => x.songname.toLowerCase() === formDetails.songName.toLowerCase() && x.songname !== formDetails.songName);

    if(titlesong){
      alert("This song is already in the list")
    }
    else{
      setFormProps({"songname": formDetails.songName, "artistname": formDetails.artistName, "capo":formDetails.capo, "lyrics": formDetails.lyrics})
  
      document.getElementById('edit-myform1').style.display = 'none'
  
      window.scrollTo(0,0)
      document.querySelector('.part1').style.display = 'flex'
  
  
      let lyrics = formDetails.lyrics
  
      getChordsFunction(lyrics)
    }
  }

  function getChordsFunction(passedLyrics){
    
    let para = passedLyrics.split('\n\n');
    let line = para.map(p => p.split('\n'));
    let word = line.map(l => l.map(w => w.split(" ")))


    let disp = document.querySelector('.edit-displayLyrics')
    // console.log("W", word);

    word.forEach((x,i) => {
        let paraDiv = document.createElement('div')
        paraDiv.setAttribute('class',`edit-paraDisp`)
        // console.log(x);
        x.forEach((y,j) => {
            // console.log(y);
            let lineDiv = document.createElement('div')
            lineDiv.setAttribute('class', `edit-lineDisp`) 
            paraDiv.appendChild(lineDiv)
            y.forEach((z,k) => {
                let button = document.createElement('button')
                button.setAttribute('class', `edit-wordDisp`)
                button.setAttribute('id', `p${i}-l${j}-w${k}`)
                button.addEventListener('click', setChord)
                button.innerHTML = z
                // console.log(z);
                lineDiv.appendChild(button)
            })
        })
        disp.appendChild(paraDiv)
    })
  } 





  function showJsonData(){

    let idsong = songToEdit.songId
    let chords2 = chordArray
    // console.log(idsong);
    // console.log(chords2);

    let data = {
      "songname": `${formProps.songname}`,
      "artistname": `${formProps.artistname}`,
      "lyrics": `${formProps.lyrics}`,
      "capo":`${formProps.capo}`,
      "chords": chords2
    }

    // console.log("DATA",data);
    // setLoading(true)
    document.querySelector('.edit-songadded').style.backgroundColor = '#0d7dc2'
    document.querySelector('.edit-songadded').innerHTML = 'Updating..'



    fetch(url+'/song/'+idsong,{
      method: "PUT",
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data =>{
          // console.log("UPDATED", data);
          newList('update')
          nav('/mysongs')
          sessionStorage.setItem('currentPage','mysongs')
      })
      .catch(error => {
          console.log("UPDATE ERROR", error);
      })

  }

  useEffect(() => {
    document.querySelectorAll('.edit-cItem').forEach(item => {
      const pos = item.id.split('_')[1];
      const chordObject = songToEdit.chords.find(x => x.pos === pos);
      
      if(pos[pos.length - 1] !== 'E'){
        if (chordObject) {
          document.getElementById(pos).classList.add('selected');
          setChordArray(prevChordArray => [
            ...prevChordArray,
            { pos: pos, chord: chordObject.chord }
          ]);
        }
      } else {
        document.getElementById(pos).classList.add('selected');
        setChordArray(prevChordArray => [
          ...prevChordArray,
          { pos: pos, chord: chordObject.chord }
        ]);
      }
    });
  }, [songToEdit]);

  // console.log("CA", chordArray);
  
  
  function deleteNode(e){
    let pos = e.currentTarget.parentNode
    // console.log("del", pos);
    let targ = pos.id.split('_')[1]
    document.getElementById(targ).classList.remove('active')
    document.getElementById(targ).classList.remove('selected')
    
    pos.remove()
    let chordArray2 = chordArray.filter(chordObj => chordObj.pos !== targ);
    setChordArray(chordArray2)
  }
  // console.log("CA", chordArray);


  function setChord(e){
    let target = e.currentTarget
    let post = target.id

    document.querySelectorAll('.edit-wordDisp').forEach(x => {
      x.classList.remove('active')
    })
    document.querySelectorAll('.addIcon').forEach(x => {
      x.classList.remove('active')
    })

    document.getElementById(post).classList.add('active')

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
      // console.log("pos",post);
      chordArrItem(post, chordMod, smDiv)
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

    document.querySelector('.edit-chordSetter').appendChild(smDiv)

    smInput.focus()
        smDiv.addEventListener('keydown', ((event) => {
          if (event.key === "Enter"){
            let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
            // console.log("CM",chordMod);
            chordArrItem(post, chordMod, smDiv)
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
    document.querySelectorAll('.edit-wordDisp').forEach(x => {
      x.classList.remove('active')
    })
  }


  function chordArrItem(x,y,z) {

    z.style.display = 'none'

    document.querySelectorAll('.smDiv').forEach(x=>{
      x.style.display='none'
    })

    document.querySelector('.edit-chordList').innerHTML = ''

    let position = x;
    let chord = y

    // document.getElementById(`${position}`).style.backgroundColor = '#58fc58'
    document.getElementById(`${position}`).classList.add('selected')

    // console.log("Hi",position,chord,z);

    let existingChord = chordArray.find(item => item.pos === position);

    if(chord !== ''){
        if (!existingChord) {
            chordArray.push({ "pos": position, "chord": chord });
        } else {
            existingChord.chord = chord;
        }
    }else{
        alert("Enter Chord Value")
    }

    // console.log("ChArr",chordArray);

    chordArray.forEach(item => {
        let chordItem = document.createElement('div')
        chordItem.setAttribute('class','edit-cItem')
        chordItem.setAttribute('id','pos_'+item.pos)
        let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
        let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
        let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
        chordItem.innerHTML = 'Para '+para+', Line '+line+', Word '+word +':  '+item.chord;
        let delbtn = document.createElement('button')
        delbtn.addEventListener('click', ((e) => {
          deleteNode(e)
        }))
        delbtn.innerHTML = 'X'
        // delbtn.style.cssText=""

        chordItem.appendChild(delbtn)
        
        document.querySelector('.edit-chordList').appendChild(chordItem)
    })

}


function addSpace(pIndex, lIndex){

  document.querySelectorAll('.addIcon').forEach(x => {
    x.classList.remove('active')
  })
  document.querySelectorAll('.edit-wordDisp').forEach(x => {
    x.classList.remove('active')
  })

  let prevLyrics = songToEdit.lyrics

  const paragraphs = prevLyrics.split("\n\n");
  const lines = paragraphs[pIndex].split("\n");
  const wordIndex = lines[lIndex].split(' ').length - 1

  // console.log(`p${pIndex}-l${lIndex}-w${wordIndex}E`);

  let post2 = `p${pIndex}-l${lIndex}-w${wordIndex}E`

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

    document.querySelector('.edit-chordSetter').appendChild(smDiv)

    smInput.focus()
        smDiv.addEventListener('keydown', ((event) => {
          if (event.key === "Enter"){
            let chordMod = smInput.value.charAt(0).toUpperCase()+smInput.value.slice(1).toLowerCase()
            // console.log("CM",chordMod);
            endOfLineChord(post2, chordMod)
          }
        }))
}

function endOfLineChord(x,y){

  document.querySelectorAll('.smDiv').forEach(x=>{
    x.style.display='none'
  })

  document.querySelector('.edit-chordList').innerHTML = ''

  let position = x;
  let chord = y


  document.getElementById(`${position}`).classList.add('selected')

  // console.log("Hi",position,chord);

  let existingChord = chordArray.find(item => item.pos === position);

  if(chord !== ''){
      if (!existingChord) {
          chordArray.push({ "pos": position, "chord": chord });
      } else {
          existingChord.chord = chord;
      }
  }else{
      alert("Enter Chord Value")
  }

  // console.log("ChArr",chordArray);

  chordArray.forEach(item => {
      let chordItem = document.createElement('div')
      chordItem.setAttribute('class','edit-cItem')
      chordItem.setAttribute('id','pos_'+item.pos)
      let para = parseInt(item.pos.split('-')[0].split('p')[1])+1
      let line = parseInt(item.pos.split('-')[1].split('l')[1])+1
      let word = parseInt(item.pos.split('-')[2].split('w')[1])+1
      // chordItem.innerHTML = 'Para '+para+', Line '+line+', Word '+word +':  '+item.chord;
      chordItem.innerHTML = item.pos[item.pos.length - 1] === 'E'? `Para ${para}, Line ${line} (end):  ${item.chord}`:`Para ${para}, Line ${line}, Word ${word}:  ${item.chord}`
      let delbtn = document.createElement('button')
      delbtn.addEventListener('click', ((e) => {
        deleteNode(e)
      }))
      delbtn.innerHTML = 'X'
      // delbtn.style.cssText=""

      chordItem.appendChild(delbtn)
      
      document.querySelector('.edit-chordList').appendChild(chordItem)
  })
}

let goTo = useNavigate()

  return (
    <div className='edit-song'>
      {loading && <Loader/>}

      <h3>Edit song</h3>
      {songToEdit ?
      <>

      <button style={{position:'fixed', cursor:'pointer', top:10, right:20, width:45, height:45, zIndex:10, backgroundColor:'black', borderRadius:'50%'}}>
        <p onClick={() => goTo('/mysongs')} style={{color:'white', fontSize:24}}>X</p>
      </button>

      <div className="part1">
              
      <p>Click to assign/replace chord. Scroll down to apply changes</p>

      <div className="edit-lyrics-container">
        <div className="edit-displayLyrics">
          {songToEdit.lyrics &&
              songToEdit.lyrics.split('\n\n').map((x,i) => {
                return(
                  <div className='edit-paraDisp' key={i}>
                    {x.split('\n').map((y,j) => {
                      return(
                        <div className='edit-lineDisp' key={j}>
                          {y.split(' ').map((z,k) => {
                            return(
                              <button onClick={setChord} className='edit-wordDisp' id={`p${i}-l${j}-w${k}`} key={k}>{z}</button>
                            )
                          })}
                          <div
                          id={`p${i}-l${j}-w${y.split(' ').length - 1}E`}
                          className='addIcon'  
                          onClick={() => addSpace(i,j)}></div>
                          {/* <svg
                          id={`p${i}-l${j}-w${y.split(' ').length - 1}E`}
                          className='addIcon'  
                          onClick={() => addSpace(i,j)} strokeWidth="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM704 536c0 4.4-3.6 8-8 8H544v152c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V544H328c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h152V328c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v152h152c4.4 0 8 3.6 8 8v48z"></path></svg> */}
                        </div>
                      )
                    })}
                  </div>
                )
              })
          }    
        </div>
        <div className="edit-right">
            <div className="edit-chordSetter"></div>
            <h3>List</h3>
            <div className="edit-chordList">
            {songToEdit.chords && songToEdit.chords.map((chord, index) => (
                <div className={'edit-cItem'} 
                id={`pos_${chord.pos}`} key={index}>
                  {chord.pos[chord.pos.length - 1] === 'E' ?
                  `Para ${parseInt((chord.pos).split('-')[0].split('p')[1])+1}, Line ${parseInt((chord.pos).split('-')[1].split('l')[1])+1}, Word ${parseInt((chord.pos).split('-')[2].split('w')[1])+1}E: ${chord.chord}`
                  :
                  `Para ${parseInt((chord.pos).split('-')[0].split('p')[1])+1}, Line ${parseInt((chord.pos).split('-')[1].split('l')[1])+1}, Word ${parseInt((chord.pos).split('-')[2].split('w')[1])+1}: ${chord.chord}`
                  }
                  <button onClick={deleteNode}>X</button>
                </div>
            ))}
             </div>
        </div>

      </div>
      <div className="edit-part2btn">
        <button className='edit-goback' onClick={goBack}>Change Lyrics</button>
        <button className='edit-songadded' onClick={showJsonData}>Update Song</button>

      </div>
      </div>  
      
      <form id="edit-myform1" onSubmit={myFunc}>
      <div className="edit-form-group">
          <label htmlFor="songName">Song Name: </label>
          <input required type="text" name="songName" defaultValue={songToEdit.songname} />
      </div>
      <div className="edit-form-group">
          <label htmlFor="artistName">Artist Name: </label>
          <input required type="text" name="artistName" defaultValue={songToEdit.artistname}/>
      </div>
      <div className="edit-form-group">
          <label htmlFor="capo">Capo: </label>
          <input type="number" min="0" max="12" defaultValue={songToEdit.capo} name="capo"/>
      </div>
      <div className="edit-form-group">
          <label className='lyricswordrow' htmlFor="lyrics"> <p>Lyrics: </p>
          </label>
          <textarea required type="text" name="lyrics" defaultValue={songToEdit.lyrics}></textarea>
      </div>

      <div className="edit-formButtons">
        <button id='next' type="submit">Next</button>
      </div>
      </form>

      </>
      :
      <Loader/>
    }
    </div>
  )
}

export default EditSong