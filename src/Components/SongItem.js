import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {Chordlist} from '../Helper/Chordlist'
import Loader from '../Helper/Loader'
import './SongItem.css'

function SongItem({list}) {

  useEffect(()=>{
    window.scrollTo(0,0)
    
  },[])


  let majorArray=['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', "G", "G#", "A", "A#", "B"]
  let minorArray=['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', "Gm", "G#m", "Am", "A#m", "Bm"]
  let seventhArray=['C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', "G7", "G#7", "A7", "A#7", "B7"]

  let {songtitle} = useParams()

  let [listing,setListing] = useState(null)
  let [selectedSong,setSelectedSong] = useState(null)

  // let [chordSet, setChordSet] = useState(Songlist[0].chords)
  let [chordSet, setChordSet] = useState(null)
  let [transVal, setTransVal] = useState(0)

  let [cat, setCat] = useState('guitar')

  useEffect(() => {
      setListing(list)
    },[list])
    
    useEffect(() => {
      if(listing!==null){
        let ss = listing.find(element => element.songname.toLowerCase() === songtitle.toLowerCase())
        //console.log("SS",ss);
        setSelectedSong(ss)   
      }
  },[listing,songtitle])

  let [word, setWord] = useState(null)

  useEffect(() => {
    if(selectedSong!==null){
      document.getElementById('guitar').classList.add('active')
      let para = selectedSong.lyrics.split('\n\n');
      let line = para.map(p => p.split('\n'));
      setWord(line.map(l => l.map(w => w.split(" "))))

      setChordSet(selectedSong.chords)
    }

  },[selectedSong])

  //console.log("SS",selectedSong);

  let [allChordsFiltered, setAllChordsFiltered] = useState(null)
  
  useEffect(() => {
    let all_chords = []

    // console.log("CS", typeof(chordSet), chordSet);
    if(chordSet!==null){
      if(chordSet.length > 0){
          chordSet.forEach((x)=>{
            // console.log("X",x);
            let post = x.pos
            if(post.charAt(post.length-1) !=='E'){
              let span = document.createElement('button')
              span.setAttribute('class', 'chordClick')
              span.setAttribute('tabIndex', '0')
    
              let chordText = document.createElement('p')
              chordText.setAttribute('class', 'chordText')
              chordText.innerHTML = x.chord;
        
              let chordImage = document.createElement('img')
              chordImage.setAttribute('class', 'smChord')
              let imgUrl = Chordlist.find( element => element.name === x.chord)
              if(imgUrl){
                chordImage.setAttribute('src', imgUrl[cat]) 
              }
              else{
                let notAvail = Chordlist.find(x => x.name === 'NA')
                chordImage.setAttribute('src', notAvail[cat]) 
              }
              chordImage.setAttribute('alt', "") 
        
              span.appendChild(chordText)
              span.appendChild(chordImage)
        
              // console.log(document.getElementById(post));
              document.getElementById(post).appendChild(span)
            }
            else if(post.charAt(post.length-1) ==='E'){
              let postMinusE = post.slice(0,post.length-1)
              // console.log(postMinusE);
              let spanEnd = document.createElement('button')
              spanEnd.setAttribute('class', 'chordClickEnd')
              spanEnd.setAttribute('tabIndex', '0')
              
              let chordTextEnd = document.createElement('p')
              chordTextEnd.setAttribute('class', 'chordText')
              chordTextEnd.innerHTML = x.chord;
    
              let chordImageEnd = document.createElement('img')
              chordImageEnd.setAttribute('class', 'smChord')
              let imgUrl2 = Chordlist.find( element => element.name === x.chord)
              if(imgUrl2){
                chordImageEnd.setAttribute('src', imgUrl2[cat]) 
              }
              else{
                let notAvail = Chordlist.find(x => x.name === 'NA')
                chordImageEnd.setAttribute('src', notAvail[cat]) 
              }
              chordImageEnd.setAttribute('alt', "") 
    
              spanEnd.appendChild(chordTextEnd)
              spanEnd.appendChild(chordImageEnd)
        
              document.getElementById(postMinusE).appendChild(spanEnd)
            
            }
          })
        }else{
          //console.log('No chords in DB');
        }
        
        let len = document.getElementById('p0-l0-w0').children.length
        if(len===0){
          document.querySelector('.lyrics').style.marginTop = '15px'
        }
    }

    if(chordSet){
      chordSet.forEach(item => {
        all_chords.push(item.chord)
      })
    }

    setAllChordsFiltered(all_chords.filter((item,index) => all_chords.indexOf(item) === index))


  },[selectedSong, cat, transVal, chordSet])

 


  //console.log("ACF",allChordsFiltered);
  

    function showCat2(x){
      // console.log(x);
      document.querySelectorAll('.chord-btn2').forEach(y => {
        y.classList.remove('active')
      })

      if(x === 'guitar'){
        document.querySelector('.colorChart').style.display = 'flex'
      }else{
        document.querySelector('.colorChart').style.display = 'none'
      }

      setCat(x)
      document.getElementById(x).classList.add('active')
  }


  function getMe(x,c){
    let passUrl = Chordlist.find( element => element.name === x)
    if(passUrl){
      return passUrl[c]
    }
    else{
      return (Chordlist.find(ele => ele.name === 'NA'))[cat] 
    }
  }


  var playBtn;

  function autoScroll(){

    let checked = document.querySelector('.autoScroll').classList.toggle('play')
    
    document.querySelector('.speed').classList.toggle('show')

    if(checked){
      startScroll()
      document.querySelector('.autoScroll').innerText='End Autoscroll'
      // console.log(document.querySelector('.navbar'));
      document.querySelector('.navbar').style.pointerEvents = 'none'
      document.querySelectorAll('.nav-group').forEach(x =>{
        x.classList.remove('active')
        x.classList.add('disabled')
      })
      document.querySelector('.nav-ext').classList.add('disabled')
      if(cat === 'guitar'){
        document.querySelectorAll('.chord-btn2')[1].classList.add('disabled')
      }else if(cat === 'piano'){
        document.querySelectorAll('.chord-btn2')[0].classList.add('disabled')
      }
      document.querySelector('.transposeContainer').style.display = 'none'
      
    }else{
      stopScroll()
      document.querySelector('.autoScroll').innerText='Start Autoscroll'
      document.querySelector('.navbar').style.pointerEvents = 'all'
      document.querySelectorAll('.nav-group').forEach(x =>{
        x.classList.remove('disabled')
      })
      document.getElementById('songs').classList.add('active')
      document.querySelector('.nav-ext').classList.remove('disabled')
      document.querySelectorAll('.chord-btn2').forEach(y=>{
        y.classList.remove('disabled')
      })
      document.querySelectorAll('.transposeContainer > button').forEach(x => {
          x.disabled = false
          x.style.pointerEvents = 'all'
        })
        document.querySelector('.transposeContainer').style.display = 'flex'
      }
  }
    function startScroll(){
        playBtn = setInterval(scrollMe, 100);
    }

    function stopScroll(){
        clearInterval(playBtn);
    }

    function scrollMe(){
      let speed = document.querySelector('.speed').value
      // console.log(speed);
      // if((window.innerWidth<480)){
      if((window.innerWidth<480 && window.innerHeight > window.innerWidth) || (window.innerHeight<480 && window.innerWidth > window.innerHeight)){
        window.scrollBy({
          top: 5*speed,
          behavior: 'smooth',
        });
      }
      else{
        window.scrollBy({
          top: 2*speed,
          behavior: 'smooth',
        });
      }
      
    }


    function trans(x){
      //console.log(x);
      let val = transVal

      if(x === 1){
        val = val+1;
        changeChords(1)
      }else{
        val = val-1;
        changeChords(-1)
      }
      setTransVal(val)
      document.getElementById('trans-value').value = val

      if(val === 12){
        document.getElementById('addTrans').classList.add('disabled')
      }else if(val === -12){
        document.getElementById('subTrans').classList.add('disabled')
      }
      else{
        document.getElementById('addTrans').classList.remove('disabled')
        document.getElementById('subTrans').classList.remove('disabled')
      }
    }


    function changeChords(v){
      //console.log('V', v);

      let newArray=[]
      let newShowChord = []
     
      if(v === 1){
      // console.log("CS",chordSet);
      let groupedChords = []

      chordSet.forEach((chordInfo, index) => {
        const { chord, pos } = chordInfo;
    
        if (!groupedChords[chord]) {
            groupedChords[chord] = [];
        }
    
        groupedChords[chord].push({ pos, chord });
    });

    for (const chord in groupedChords) {
        
        if(majorArray.includes(chord)){
          // console.log("YESS DUDE", groupedChords[chord]);
          newShowChord.push(majorArray[(majorArray.indexOf(chord)+1)%12])
          groupedChords[chord].forEach(x =>{
            x.chord = majorArray[(majorArray.indexOf(chord)+1)%12]
            newArray.push(x)
          })
          
        }
        else if(minorArray.includes(chord)){
          newShowChord.push(minorArray[(minorArray.indexOf(chord)+1)%12])
          groupedChords[chord].forEach(y =>{
            y.chord = minorArray[(minorArray.indexOf(chord)+1)%12]
            newArray.push(y)
          })
        }
        else if(seventhArray.includes(chord)){
          newShowChord.push(seventhArray[(seventhArray.indexOf(chord)+1)%12])
          groupedChords[chord].forEach(z =>{
            z.chord = seventhArray[(seventhArray.indexOf(chord)+1)%12]
            newArray.push(z)
          })
        }
      }
      }
      else if(v === -1){
        // console.log("CS",chordSet);
        let groupedChords = []
        let majorArray2 = majorArray.reverse()
        let minorArray2 = minorArray.reverse()
        let seventhArray2 = seventhArray.reverse()

        
        chordSet.forEach((chordInfo, index) => {
          const { chord, pos } = chordInfo;
      
          if (!groupedChords[chord]) {
              groupedChords[chord] = [];
          }
      
          groupedChords[chord].push({ pos, chord });
         });

        for (const chord in groupedChords) {
          
          if(majorArray2.includes(chord)){
            // console.log("YESS DUDE", groupedChords[chord]);
            newShowChord.push(majorArray2[(majorArray2.indexOf(chord)+1)%12])
            groupedChords[chord].forEach(x =>{
              x.chord = majorArray2[(majorArray2.indexOf(chord)+1)%12]
              newArray.push(x)
            })
            
          }
          else if(minorArray2.includes(chord)){
            newShowChord.push(minorArray2[(minorArray2.indexOf(chord)+1)%12])
            groupedChords[chord].forEach(y =>{
              y.chord = minorArray2[(minorArray2.indexOf(chord)+1)%12]
              newArray.push(y)
            })
          }
          else if(seventhArray2.includes(chord)){
            newShowChord.push(seventhArray2[(seventhArray2.indexOf(chord)+1)%12])
            groupedChords[chord].forEach(z =>{
              z.chord = seventhArray2[(seventhArray2.indexOf(chord)+1)%12]
              newArray.push(z)
            })
          }
        }   
      }
      setChordSet(newArray)
      setAllChordsFiltered(newShowChord)
  }

  let nav = useNavigate()
  function showSongsByUser(x){
    nav('/songslist/'+x)
    sessionStorage.setItem('currentPage', 'songs')
  }

    let mediaQ1 = matchMedia('(min-width:1025px)')
    let mediaQ2 = matchMedia('(max-width:1024px) and (min-width:769px)')
    let mediaQ3 = matchMedia('(max-width:768px) and (min-width:481px)')
    let mediaQ4 = matchMedia('(max-width:480px) and (min-width:0px)')


  let [singlechord, setSingleChord] = useState(null)

  function showSingleChord(x){
    // console.log(x);

    document.querySelector('.singlechordbackground').style.display = 'flex'

    setSingleChord(x)

    if(mediaQ1.matches){
      document.querySelector('.singlechordbackground').style.paddingLeft = '320px'
    }
    else if(mediaQ2.matches){
      document.querySelector('.singlechordbackground').style.paddingLeft = '270px'
    }
    else if(mediaQ3.matches){
      document.querySelector('.singlechordbackground').style.paddingLeft = '120px'
    }
    else if(mediaQ4.matches){
      document.querySelector('.singlechordbackground').style.paddingLeft = '80px'
      document.querySelector('.singlechordcontainer').style.maxWidth = '280px'
    }
    
  }


  function playMe(x,y,z){
    let targ = z.currentTarget
    let whichChord = Chordlist.find(item => item.name === x)
    if(whichChord){
      let aud
      if(y==='guitar'){
       aud = new Audio(whichChord.gsound);
      }else if(y==='piano'){
       aud = new Audio(whichChord.psound);
      }

      aud.play()

      aud.addEventListener('play', () => {
        targ.classList.add('playing')
      })
      aud.addEventListener('ended', () => {
        targ.classList.remove('playing')
      })
    }
  }

  function hidesingle(){
    document.querySelector('.singlechordbackground').style.display = 'none'
    setSingleChord(null)
  }



  return (<>
      {listing ? <>
       {selectedSong ? 
       <>
        <div className="song-item">
      
      <div className="autoScroll" onClick={autoScroll}>
        Start Autoscroll
      </div>
      <select name="speed" className="speed" id='speed' onChange={scrollMe} defaultValue={1}>
        <option value={0.5}>0.5x</option>
        <option value={0.8}>0.8x</option>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
        <option value={4}>4x</option>
      </select>
      

      <div className="song-info">
        <p style={{fontStyle:'italic', textAlign:'left', fontWeight:600, cursor:'pointer'}}>Posted by: <span style={{textDecoration:'underline', color:'blue'}} onClick={() => showSongsByUser(selectedSong.ownername)}>{selectedSong.ownername}</span></p>
        <hr style={{border:'.5px solid black', marginTop:'2px'}} />
        <br />
        <h1>{selectedSong.songname.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h1>
        <p>~ {selectedSong.artistname.toUpperCase()}</p>
      </div>

        
      <div className="chord-category">
        <button id='guitar' className='chord-btn2' onClick={() => showCat2('guitar')}>Guitar</button>
        <button id='piano' className='chord-btn2' onClick={() => showCat2('piano')}>Piano</button>
      </div>

      <div className='singlechordbackground'>
          <button className='hidesingle' onClick={hidesingle}>X</button>
          
          <div className="singlechordcontainer">
            {singlechord && 
            <>
            {
              Chordlist.find(item => item.name === singlechord && (cat==='guitar' && item.gsound)) 
              &&
              <div style={{display:'flex', width:'60%' ,justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize:'25px'}}>{singlechord}</h2>
                <button className='ssvg' onClick={(e) => playMe(singlechord,cat,e)}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" height="1em" width="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 8.02c0 1.09-.45 2.09-1.17 2.83l-.67-.67c.55-.56.89-1.31.89-2.16 0-.85-.34-1.61-.89-2.16l.67-.67A3.99 3.99 0 0 1 12 8.02zM7.72 2.28L4 6H2c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2l3.72 3.72c.47.47 1.28.14 1.28-.53V2.81c0-.67-.81-1-1.28-.53zm5.94.08l-.67.67a6.996 6.996 0 0 1 2.06 4.98c0 1.94-.78 3.7-2.06 4.98l.67.67A7.973 7.973 0 0 0 16 8c0-2.22-.89-4.22-2.34-5.66v.02zm-1.41 1.41l-.69.67a5.05 5.05 0 0 1 1.48 3.58c0 1.39-.56 2.66-1.48 3.56l.69.67A5.971 5.971 0 0 0 14 8.02c0-1.65-.67-3.16-1.75-4.25z"></path></svg></button>
              </div>
            }
            {
              Chordlist.find(item => item.name === singlechord && (cat==='piano' && item.psound)) 
              &&
              <div style={{display:'flex', width:'60%' ,justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize:'25px'}}>{singlechord}</h2>
                <button className='ssvg' onClick={(e) => playMe(singlechord,cat,e)}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" height="1em" width="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 8.02c0 1.09-.45 2.09-1.17 2.83l-.67-.67c.55-.56.89-1.31.89-2.16 0-.85-.34-1.61-.89-2.16l.67-.67A3.99 3.99 0 0 1 12 8.02zM7.72 2.28L4 6H2c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h2l3.72 3.72c.47.47 1.28.14 1.28-.53V2.81c0-.67-.81-1-1.28-.53zm5.94.08l-.67.67a6.996 6.996 0 0 1 2.06 4.98c0 1.94-.78 3.7-2.06 4.98l.67.67A7.973 7.973 0 0 0 16 8c0-2.22-.89-4.22-2.34-5.66v.02zm-1.41 1.41l-.69.67a5.05 5.05 0 0 1 1.48 3.58c0 1.39-.56 2.66-1.48 3.56l.69.67A5.971 5.971 0 0 0 14 8.02c0-1.65-.67-3.16-1.75-4.25z"></path></svg></button>
              </div>
            }
            {
              Chordlist.find(item => item.name === singlechord && (cat==='guitar' && !item.gsound)) 
              &&
              <div style={{display:'flex', width:'60%' ,justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize:'25px'}}>{singlechord}</h2>
                <button className='ssvg'disabled><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" strokeWidth="2" d="M1,8 L1,16 L6.09901951,16 L12,21 L12,3 L6,8 L1,8 Z M15,9 L21,15 M21,9 L15,15"></path></svg></button>
              </div>
            }
            {
              Chordlist.find(item => item.name === singlechord && (cat==='piano' && !item.psound)) 
              &&
              <div style={{display:'flex', width:'60%' ,justifyContent:'space-between', alignItems:'center'}}>
                <h2 style={{fontSize:'25px'}}>{singlechord}</h2>
                <button className='ssvg'disabled><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" strokeWidth="2" d="M1,8 L1,16 L6.09901951,16 L12,21 L12,3 L6,8 L1,8 Z M15,9 L21,15 M21,9 L15,15"></path></svg></button>
              </div>
            }
              <img className='schord' src={getMe(singlechord,cat)} alt="" />
            </>
            }
          </div>
      </div>


      {allChordsFiltered.length>0 &&
      <>
        <p className='chords-word'>Chords {selectedSong.capo>0 && cat === 'guitar' && <span>(Capo: {selectedSong.capo})</span>}</p>
        <div className="allChords">
        {allChordsFiltered.map((x,key)=>{
          return(
            <div key={key} className="chord-group" onClick={()=>showSingleChord(x)} >
            <p>{x}</p>
            <img src={getMe(x,cat)} alt="NA" />
          </div>
          )
        })}
      </div>
      </>
      }

      <p className='chord-extra' style={{fontSize:'14px'}}>(Click on a chord to see more information)</p>
      

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

        
      <div className='lyrics'>
        {selectedSong && word!==null && word.map((x,i) => {
          return(
            <span key={i} className="para">
              {x.map((y,j)=>{
                return(
                  <span className='line' key={j}>
                    {y.map((z,k) =>{
                      return(
                        <span id={`p${i}-l${j}-w${k}`} className='word' key={k}>
                          {z}
                        
                          </span>
                      )
                    })}
                   
                  </span>
                )
            })}
            </span>
          )
        })}
      </div>


      <div className="transposeContainer">
        <p>Transpose: </p>
        <button id='subTrans' onClick={() => trans(-1)}>-</button>
        <input type="text" readOnly id='trans-value' defaultValue={transVal}/>
        <button id='addTrans' onClick={() => trans(1)}>+</button>
      </div>

       </div>
      </> :
      
      <div className="song-item">
        <Loader />
      </div>
      
      }
      </> 
      :
      <div className="song-item">
        <Loader />
      </div>
      }

    </>
  )
}

export default SongItem