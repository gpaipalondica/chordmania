import React, { useEffect, useRef } from 'react'
import { useState } from 'react'

function Metronome() {

    let [metroValue, setMetroValue] = useState(90)
    const [currentBeat, setCurrentBeat] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [isMute, setIsMute] = useState(false);

    const isMuteRef = useRef(isMute);

    useEffect(() => {
        isMuteRef.current = isMute;
      }, [isMute]);

    const [isStrobing, setIsStrobing] = useState(false);
    const [isStrobingContainer, setIsStrobingContainer] = useState(false);

    const isStrobingRef = useRef(isStrobing);

    useEffect(() => {
        isStrobingRef.current = isStrobing;
      }, [isStrobing]);

    const intervalRef = useRef(null);

    const clickSound = useRef(null);

    useEffect(() => {
        clickSound.current = new Audio('/click.mp3');
        clickSound.current.load();
      }, []);

    const playSound = () => {
        if (clickSound.current && !isMuteRef.current) {
            clickSound.current.currentTime = 0; // rewind to start
            clickSound.current.play().catch(e => {
            console.warn("Playback failed:", e);
            });
          }

          if(isStrobingRef.current){
              setIsStrobingContainer(true);
              setTimeout(() => setIsStrobingContainer(false), 100); // 100ms flash
          }
        }

    const startMetronome = () => {
        if (!metroValue || isNaN(metroValue)) {
          alert("Enter a valid metronome value");
          return;
        }
      
        stopMetronome(); // clear previous
      
        const beatInterval = 60000 / metroValue;
        setCurrentBeat(0);
        playSound();
      
        intervalRef.current = setInterval(() => {
          setCurrentBeat((prev) => {
            const next = (prev + 1) % 4;
            playSound();
            return next;
          });
        }, beatInterval);
      };
      
      const stopMetronome = () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setCurrentBeat(-1)
        }
      };
      
      const toggleMetronome = () => {
        if (isPlaying) {
          stopMetronome();
        } else {
          startMetronome();
        }
        setIsPlaying(!isPlaying);
      };

      const toggleMute= () => {
        setIsMute(!isMute)
      };

      const toggleLight= () => {
        setIsStrobing(!isStrobing)
      };
      
      // Restart metronome automatically if bpm changes while playing
      useEffect(() => {
        if (isPlaying) {
          startMetronome();
        }
        return stopMetronome;
      }, [metroValue]);

  return (
    <>
    <style>
      {`

        @keyframes strobe {
            0%, 100% { background-color: #fff; box-shadow: 0 0 5px 2px #00ff00; }
            50% { background-color: #00ff00; box-shadow: 0 0 20px 4px #00ff00; }
        }
        
      .dots-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 50px
      }

      .dots {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid black;    
      }      

      .container2 {
        width: 80%;
        display: flex;
        flex-direction: column;
        padding: 40px;
        justify-content: center;
        align-items: center;
        gap: 60px;
        border: 1px solid black;
        border-radius: 40px;
        background-color: ${isStrobingContainer ? 'lightgreen' : ''};
      }

      .container3 {
        width: 100%;
        display: flex;
        padding: 20px;
        justify-content: center;
        align-items: center;
        gap: 80px;
      }

      .metroDisplay{
        font-size: 50px;
        width: 120px;
        height: 100px;
        text-align: center;
        border: 1px solid black;
      }

      .metroDisplay::-webkit-inner-spin-button,
      .metroDisplay::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .metroDisplay:disabled {
        background-color: rgba(0,0,0,0.1)
      }

      .metBtn {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        cursor: pointer;
        background-color: white;
        color: black;
        font-size: 50px;
        padding: 0;
        margin: 0;
        border: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center
      }

      .metBtn svg {
        color: black;
      }

      @media (max-width: 480px) {
        .container2 {
            width: 100%;
            gap: 20px;
            padding: 40px 10px;
        }

        .dots-container{
            gap: 20px;
        }

        .dots {
            width: 20px;
            height: 20px;
        }

        .container3 {
            gap: 20px;
        }

        .metBtn {
            font-size: 30px;
            width: 50px;
            height: 50px;
        }

        .metroDisplay {
            width: 80px;
            height: 80px;
            font-size: 30px;
        }
      }


      `}
    </style>

    <div className='chords' style={{height:'90vh'}}>
        <h2 className="title">Metronome</h2>

        <div className='container2'>

            <div className='dots-container'>
                {[0, 1, 2, 3].map((index) => (
                    <div
                    key={index}
                    className='dots'
                    style={{
                        backgroundColor: index === currentBeat ? 'orange' : 'lightgray',
                        transition: 'background-color 0.2s',
                    }}
                    />
                ))}
            </div>

            <div className='container3'>
                <button className='metBtn' onClick={() => setMetroValue(parseInt(metroValue)-1)}>-</button>
                <input 
                className='metroDisplay' 
                disabled={currentBeat!==-1}
                readOnly={currentBeat!==-1}
                type="number" 
                value={metroValue}
                min={1}
                max={200}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value <= 200 && value > -1) {
                        setMetroValue(value);
                    }
                }}
                />
                <button className='metBtn' onClick={() => setMetroValue(parseInt(metroValue)+1)}>+</button>
            </div>

            <hr style={{width: '100%', height:4, backgroundColor: 'gray'}} />

            <div className='container3'>
                <button className='metBtn' onClick={toggleMetronome}>
                    {isPlaying ? 
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 3.5h6A1.5 1.5 0 0112.5 5v6a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 11V5A1.5 1.5 0 015 3.5z"></path></svg>
                    :
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 010 1.393z"></path></svg>
                     }
                </button>
                <button className='metBtn' onClick={toggleMute}>
                    {isMute ? 
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.5 5h2.79l3.86-3.83.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85 4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732-.707.707L12.5 9.207l-1.732 1.732-.707-.707L11.793 8.5 10.06 6.77l.707-.707 1.733 1.73 1.731-1.731z"></path></svg>
                    :
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1.5 4.83h2.79L8.15 1l.85.35v13l-.85.33-3.86-3.85H1.5l-.5-.5v-5l.5-.5zM4.85 10L8 13.14V2.56L4.85 5.68l-.35.15H2v4h2.5l.35.17zM15 7.83a6.97 6.97 0 0 1-1.578 4.428l-.712-.71A5.975 5.975 0 0 0 14 7.83c0-1.4-.48-2.689-1.284-3.71l.712-.71A6.971 6.971 0 0 1 15 7.83zm-2 0a4.978 4.978 0 0 1-1.002 3.004l-.716-.716A3.982 3.982 0 0 0 12 7.83a3.98 3.98 0 0 0-.713-2.28l.716-.716c.626.835.997 1.872.997 2.996zm-2 0c0 .574-.16 1.11-.44 1.566l-.739-.738a1.993 1.993 0 0 0 .005-1.647l.739-.739c.276.454.435.988.435 1.558z"></path></svg>
                     }
                </button>

                <button className='metBtn' onClick={toggleLight}>
                    {isStrobing ? 
                    <svg stroke="orange" fill="orange" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path></svg>
                    :
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path></svg>
                     }
                </button>

            </div>
        </div>
        
    </div>
    </>
  )
}

export default Metronome