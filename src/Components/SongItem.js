import React, { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
        let ss = listing.find(element => element.songname.toLowerCase().includes(songtitle.toLowerCase()))
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
  let all_chords = []

  useEffect(() => {

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
      if(window.innerWidth<480){
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
      </select>
      

      <div className="song-info">
        <p style={{fontStyle:'italic', textAlign:'left'}}>Posted by: <span style={{fontWeight:600}}>{selectedSong.ownername}</span></p>
        <hr style={{border:'.5px solid black'}} />
        <br />
        <h1>{selectedSong.songname.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</h1>
        <p>~ {selectedSong.artistname.toUpperCase()}</p>
      </div>

        
      <div className="chord-category">
        <button id='guitar' className='chord-btn2' onClick={() => showCat2('guitar')}>Guitar</button>
        <button id='piano' className='chord-btn2' onClick={() => showCat2('piano')}>Piano</button>
      </div>


      {allChordsFiltered.length>0 &&
      <>
        <p className='chords-word'>Chords {selectedSong.capo && cat === 'guitar' && <span>(Capo: {selectedSong.capo})</span>}</p>
        <div className="allChords">
        {allChordsFiltered.map((x,key)=>{
          return(
            <div key={key} className="chord-group">
            <p>{x}</p>
            <img src={getMe(x,cat)} alt="NA" />
          </div>
          )
        })}
      </div>
      </>
      }
      

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