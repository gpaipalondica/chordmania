import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './Login.css'
import Loader from '../Helper/Loader';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [loading, setLoading] = useState(false)

    const url = 'https://firstnodejstest.azurewebsites.net'

    useEffect(() => {
        document.getElementById('btn_login').classList.add('active')
    },[])

    function showThis(x){

        document.querySelectorAll('.formBtn').forEach(y => {
            y.classList.remove('active')
        })
        let mediaQ = matchMedia('(max-width:480px)')

        if(x==='login'){
            if(mediaQ.matches){
            document.querySelector('.container').style.marginTop='100px'
        }else{
            document.querySelector('.container').style.marginTop='60px'
            }
            document.getElementById('btn_login').classList.add('active')
            document.querySelector('.form-title').innerHTML = 'Login Form'
            document.getElementById('loginForm').style.display='flex'
            document.getElementById('registerForm').style.display='none'
        }
        else if(x === 'register'){
            if(mediaQ.matches){
                document.querySelector('.container').style.marginTop='40px'
            }else{
                document.querySelector('.container').style.marginTop='60px'
            }
            document.getElementById('btn_register').classList.add('active')
            document.querySelector('.form-title').innerHTML = 'Register Form'
            document.getElementById('loginForm').style.display='none'
            document.getElementById('registerForm').style.display='flex'
        }
    }

    let [showPassLogin, letShowPassLogin] = useState(false)
    let [showPassReg, letShowPassReg] = useState(false)
    let [showPassConf, letShowPassConf] = useState(false)

    function showPassword(x,y){

        let tar = x.currentTarget.parentNode.querySelector('input')
        
        if(y === 'login'){
            if(!showPassLogin){
                tar.type = "text"
            }
            else{
                tar.type="password"
            }
            letShowPassLogin(!showPassLogin)
        }
        else if(y==='register'){
            if(!showPassReg){
                tar.type = "text"
            }
            else{
                tar.type="password"
            }
            letShowPassReg(!showPassReg)
        }
        else if(y==='confirmPas'){
            if(!showPassConf){
                tar.type = "text"
            }
            else{
                tar.type="password"
            }
            letShowPassConf(!showPassConf)
        }
    }

    //LOGIN
    async function handleLogin(e){
        e.preventDefault()
        let form = document.getElementById('loginForm')
        let formData = new FormData(form)
        let loginDetails = Object.fromEntries(formData);

        let user = loginDetails
        // console.log("USER",user);
        setLoading(true)
        
        // console.log(loginDetails);
        let isVerified 
        try{
            isVerified = await verifyUser(user)
        }catch(error){
            console.error('Error', error);
        }

        // console.log("IV", isVerified);
        
        if(isVerified.data === true){      
            loginUser(isVerified.user)
        }
        else if (isVerified.data === false){
             alert("Incorrect credentials");
             setLoading(false)
        }else if(isVerified.message){
            setLoading(false)
        }
    }

    async function verifyUser(passedUser){
        return (fetch(url+'/users',{
                method:"GET"
               }).then(response => response.json())
              .then(data => {
                  let allUsers = data
                //   console.log("AU",allUsers);
                //   console.log("PU",passedUser);
                  let count = 0
                  for(let user in allUsers){
                    let au = allUsers[user].username
                    let pu = passedUser.username

                    if(au === pu || allUsers[user].email === pu){
                        //   console.log("USERNAME matched")
                          count++;
                          
                          let data3 = {
                              "plaintext": passedUser.password,
                              "hashed": allUsers[user].password
                          }

                        //   console.log("data3", data3);
    
                         return fetch(url+'/verifyUser', {
                              method:"POST",
                              headers:{
                                  'Content-type': 'application/json'
                              },
                              body: JSON.stringify(data3)
                          }).then(response => response.json())
                          .then(data => {
                              // console.log("HERE", data);
                              return {"data":data, "user": allUsers[user]}
                          })
                          .catch(err => {
                          console.log(err);
                          })
                      }
                      else{
                        count = 0
                        continue
                      }
                  }

                  if(count === 0){
                    alert('user not found')
                    return false
                  }
                  }) 
                  .catch(error => {
                      console.log('ERROR IN VERIFY USER FUNCTION', error);
                    }));
                       
    }
    function loginUser(x){

        let name = x.username
    
        const data = {
            "username": name,
        }
    
        // console.log(data);
        fetch(url+'/login',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // console.log("POST data", data);
    
            if(data.accessToken){
                let accTok = data.accessToken
                // console.log("AT",accTok);
                tokenVerify(x,accTok)
            }
            else{
                console.log("No Access Token");
            }
        })
        .catch(err => {
            console.log("POST error: ",err);
        })
    
    }

    let navigate = useNavigate()

    function tokenVerify(x2,x) {
        let accTok = x; 
        let userDetails = {
        //   "user_id":x2._id,
          "username": x2.username,
          "email": x2.email
        }

        // console.log(userDetails);
        const token = accTok
    
        const auth = `Bearer ${token}`
    
        // console.log(auth);
    
        fetch(url+'/posts', {
        method: 'GET',
        headers: {
            'Authorization': auth
        }
        })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log(data); 
        sessionStorage.setItem('user', JSON.stringify(userDetails))
        sessionStorage.setItem('token', token)

        props.setAuthToken(token)
        props.setUserData(JSON.stringify(data))
        sessionStorage.setItem('currentPage', 'songs')
        setLoading(false)
        navigate('/songs')
      
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }



    //REGISTER
    async function handleRegister(e){
        e.preventDefault()
        setLoading(true)
        let form = document.getElementById('registerForm')
        let formData = new FormData(form)
        let data ={}
        formData.forEach((val,key) => {
            data[key] = val
        })

        let newUser = data
        // console.log(newUser);

        let isUnique 
        try{
            isUnique = await checkUser(newUser)
        }
        catch(error){
            console.log(error);
        }

        // console.log(isUnique);
        if ( isUnique === true){
            if (newUser.password === newUser.passwordConfirm){
                // console.log("YASS");
                let data2 = {
                    "username": newUser.username,
                    "email": newUser.email,
                    "password": newUser.password
                }
      
                // console.log("data2", data2);
                fetch(url+'/user',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    }, 
                    body: JSON.stringify(data2)
                }).then(response => response.json())
                .then(data => {
                    // console.log(data);
                    setLoading(false)
                    alert('User registered successfully')
                    document.getElementById('registerForm').reset()
                    document.getElementById('btn_login').click()
                })
                .catch(error => {
                    console.log(error);
                })
      
            }else{
                setLoading(false)
                alert("Passwords do not match")
            }
      
        }else if(isUnique.count === "Email"){
            setLoading(false)
            alert("Email already exists")
        }else if(isUnique.count === "Username"){
            setLoading(false)
            alert("Username taken")
        }
    }

    async function checkUser(newUser){
        // console.log("NU", newUser);
        
        return fetch(url+'/users', {
            method:"GET"
        }).then(response => response.json())
        .then(data => {
            // console.log(data);
            let allUsers = data
            let countEmail = 0 
            let countUsername = 0 
      
            for(let user in allUsers){
                if (allUsers[user].email === newUser.email){
                    countEmail++
                }else if(allUsers[user].username === newUser.username){
                    countUsername++
                }
            }
      
            if (countEmail === 0 && countUsername === 0){
                return true 
            }else if(countEmail > 0){ 
              return {bool:false,count:'Email'}
            }
            else if(countUsername > 0){ 
              return {bool:false,count:'Username'}
            }
        }).catch(error => {
            console.log(error);
        })
      }


  return (
      <div className='login'>
        {loading && <Loader/>}
        <div className="container">
            <h3 className='form-title'>Login Form</h3>
            <div className="form-btns">
                <button id='btn_login' className='formBtn' onClick={() => showThis('login')}>Login</button>
                <button id='btn_register' className='formBtn' onClick={() => showThis('register')}>Register</button>
            </div>
            <form id='loginForm' onSubmit={handleLogin} method="POST">
                <div className="groupForm">
                    <input type="text" name='username' placeholder='Username' required />
                </div>
                <div className="groupForm">
                    <input type="password" name='password' placeholder='Password' required/>
                    {showPassLogin? 
                    <svg className='eye' onClick={(event) => showPassword(event,'login')} 
                    fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                    :<svg className='eye' onClick={(event) => showPassword(event,'login')} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>                    
                    }
                </div>
                <button type="submit">Login</button>
                <p>Not a member? <span onClick={() => showThis('register')}>Sign Up now</span></p>
            </form>

            <form id='registerForm' onSubmit={handleRegister}>
                <div className="groupForm">
                    <input type="text" name='username' placeholder='Username' required />
                </div>
                <div className="groupForm">
                    <input type="email" name='email' placeholder='Email' required />
                </div>
                <div className="groupForm">
                    <input type="password" name='password' placeholder='Password' required/>
                    {showPassReg? 
                    <svg className='eye' onClick={(event) => showPassword(event,'register')}
                    fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                    :<svg className='eye' onClick={(event) => showPassword(event,'register')} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>                    
                    }
                </div>
                <div className="groupForm">
                    <input type="password" name='passwordConfirm' placeholder='Confirm Password' required/>
                    {showPassConf? 
                    <svg className='eye' onClick={(event) => showPassword(event,'confirmPas')} 
                    fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                    :<svg className='eye' onClick={(event) => showPassword(event,'confirmPas')}  stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>                    
                    }
                </div>
                <button type="submit">Register</button>
                <p>Already a member? <span onClick={() => showThis('login')}>Log In now</span></p>
            </form>

        </div>
    </div>
  );
};

export default Login;
