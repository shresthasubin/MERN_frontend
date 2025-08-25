import React, {useEffect, useState} from 'react'
import axios from 'axios'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setErrorMessage] = useState('')
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setClicked(false)
        }, 10000)
    },[clicked])
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await axios.post(`http://localhost:3002/api/auth/login`, {
                email,
                password
            })
            console.log('Login successful:', res.data);
            console.log('Token:', res.data.data.token);
            console.log('User:', res.data.user);
            setErrorMessage('');
            // Optionally: Redirect user or store token
            } catch (error) {
                const message =
                    error.response?.data?.message || 'Something went wrong. Please try again later.';
                console.error('Login failed:', message);
                setErrorMessage(message);
            }
        }
     const handleClick = () => {
        if (email !== "" || password !== "") {
            setClicked(true)
        }
     }
    
  return (
    <form onSubmit={handleSubmit} className='w-full p-4 h-full flex justify-center items-center'>
        <div className='w-fit p-4 h-full flex justify-center items-center flex-col gap-4 bg-blue-900 rounded-[20px]'>
        <p className='text-2xl font-bold  text-white'>Login</p>
        {
            (clicked)? <p className={error?'text-red-600':'text-green-500'}>{error? 'Login Failed': 'Login Successful'}</p> : ""
        }
        <div className='flex flex-col'>
            <label className='text-white'>Email:</label>
            <input type="email" placeholder="johndoe@gmail.com" className='border-[1px] rounded-[4px] text-white p-1 w-[400px] '  value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className='flex flex-col'>
            <label className='text-white'>Password:</label>
            <input type="password" placeholder="*********" className='border-[1px] rounded-[4px] text-white p-1 w-[400px] ' value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button className='w-[200px] bg-blue-300 p-2 rounded-full font-bold text-white' onClick={handleClick}>Login</button>
        </div>
    </form>
  )
}

export default Login
