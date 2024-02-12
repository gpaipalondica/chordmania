import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import './SongItem.css'
import { Songlist } from '../Helper/Songlist'
import {Chordlist} from '../Helper/Chordlist'
import { useEffect } from 'react'

function SongItem() {

  useEffect(()=>{
    window.scrollTo(0,0)
  })

  let {songtitle} = useParams()

  let selectedSong = Songlist.find(element => element.name === songtitle)

  let lyrics = selectedSong.lyrics

  // console.log(lyrics);
  // console.log(Chordlist);
 
    let para = lyrics.split('\n\n');
    let line = para.map(p => p.split('\n'));
    let word = line.map(l => l.map(w => w.split(" ")))
    // console.log("all",word);
  
    // console.log(word[1][1][0])

    //setChords
    // console.log(selectedSong.chords);
    
    let [cat, setCat] = useState('guitar')

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

  useEffect(()=>{
    document.getElementById('guitar').classList.add('active')
  },[])
    
    useEffect(() => {
      
      if(selectedSong.chords.length > 0){
        selectedSong.chords.forEach((x)=>{
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
        console.log('No chords in DB');
      }
      
      let len = document.getElementById('p0-l0-w0').children.length
      if(len===0){
        document.querySelector('.lyrics').style.marginTop = '15px'
      }

    },[selectedSong, cat])
    
   
    let all_chords = []
    let all_chords_filtered = []

    if(selectedSong.chords){
      selectedSong.chords.forEach(item => {
        all_chords.push(item.chord)
      })
    }

    all_chords_filtered = all_chords.filter((item,index) => all_chords.indexOf(item) === index);
    
    // console.log(all_chords_filtered);
  

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
      if(checked){
        startScroll()
        console.log(document.querySelector('.navbar'));
        document.querySelector('.navbar').style.pointerEvents = 'none'
        document.querySelectorAll('.nav-group').forEach(x =>{
          x.classList.remove('active')
          x.classList.add('disabled')
        })
        document.querySelector('.nav-ext').style.display='none'
      }else{
        stopScroll()
        document.querySelector('.navbar').style.pointerEvents = 'all'
        document.querySelectorAll('.nav-group').forEach(x =>{
          x.classList.remove('disabled')
        })
        document.getElementById('songs').classList.add('active')
        document.querySelector('.nav-ext').style.display='flex'
      }
    }
      function startScroll(){
          playBtn = setInterval(scrollMe, 100);
      }

      function stopScroll(){
          clearInterval(playBtn);
      }

      function scrollMe(){

        if(window.innerWidth<480){
          window.scrollBy({
            top: 5,
            behavior: 'smooth',
          });
        }
        else{
          window.scrollBy({
            top: 2,
            behavior: 'smooth',
          });
        }
        
      }

  
  return (
    <div className="song-item">
      
      <div className="autoScroll" onClick={autoScroll}>
        Autoscroll<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path></svg>
      </div>

      <div className="song-info">
        <h1>{selectedSong.name}</h1>
        <p>~ {selectedSong.artist}</p>
      </div>

        
      <div className="chord-category">
        <button id='guitar' className='chord-btn2' onClick={() => showCat2('guitar')}>Guitar</button>
        <button id='piano' className='chord-btn2' onClick={() => showCat2('piano')}>Piano</button>
      </div>


      {all_chords_filtered.length>0 &&
      <>
        <p className='chords-word'>Chords {selectedSong.capo && cat === 'guitar' && <span>(Capo: {selectedSong.capo})</span>}</p>
        <div className="allChords">
        {all_chords_filtered.map((x,key)=>{
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
        {word!==null && word.map((x,i) => {
          return(
            <span key={i} className="para">
              {x.map((y,j)=>{
                return(
                  <span className='line' key={j}>
                    {y.map((z,k) =>{
                      return(
                        <span id={`p${i}-l${j}-w${k}`} className='word' key={k}>
                          {z}
                          {/* <span className='chordClick' onClick={showChordChart}>
                            <p className='chordText'>F</p>
                            <img className='smChord' src={Chordlist[0].guitar} alt="" />
                          </span> */}
                          </span>
                      )
                    })}
                    {/* <span  className='chordClickEnd' onClick={showChordChart}>
                      <p className='chordText'>C</p>
                      <img className='smChord' src={Chordlist[1].guitar} alt="" />
                      </span> */}
                  </span>
                )
            })}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default SongItem