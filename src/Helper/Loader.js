import React from 'react'
import { useEffect } from 'react'
import './Loader.css'

function Loader() {

  
  useEffect(() => {
    let mediaQ1 = matchMedia('(min-width:1025px)')
    let mediaQ2 = matchMedia('(max-width:1024px) and (min-width:769px)')
    let mediaQ3 = matchMedia('(max-width:768px) and (min-width:481px)')
    let mediaQ4 = matchMedia('(max-width:480px) and (min-width:0px)')
    
    if(mediaQ1.matches){
      // console.log('Q1');
      document.querySelector('.loadercontainer').style.width = 'calc(100% - 320px)'
    }
    else if(mediaQ2.matches){ 
      // console.log('Q2');
      document.querySelector('.loadercontainer').style.width = 'calc(100% - 270px)'
    }
    else if(mediaQ3.matches){ 
      // console.log('Q3');
      document.querySelector('.loadercontainer').style.width = 'calc(100% - 120px)'
    }
    else if(mediaQ4.matches){ 
      // console.log('Q4');
      document.querySelector('.loadercontainer').style.width = 'calc(100% - 120px)'
    }else{

    }
  },[])


  return (
    <div className="loadercontainer">
      <div className="loadbg">
      <div className="load-outer">
        <div className='loadcontent'></div>
        <svg className='load-music' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"></path><path fillRule="evenodd" d="M9 3v10H8V3h1z" clipRule="evenodd"></path><path d="M8 2.82a1 1 0 01.804-.98l3-.6A1 1 0 0113 2.22V4L8 5V2.82z"></path></svg>
      </div>
        <p>Loading</p>
      </div>
    </div>
  )
}

export default Loader