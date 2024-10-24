import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { http } from '../axios'

const Login = () => {

  const emailRef = useRef()
  const passwordRef = useRef()
  const formRef = useRef()
  const navigate = useNavigate()

  function validateForm() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Email noto\'g\'ri kiritilgan');
      return false;
    }

    if (password.length < 4) {
      alert('Parol kamida 4 ta belgidan iborat bo\'lishi kerak');
      return false;
    }

    return true;
  }

  function hendelSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userForm = {
      'identifier': emailRef.current.value,
      'password': passwordRef.current.value
    }


    if (emailRef.current.value == '' || passwordRef.current.value == '') {
      alert("Iltimos loginni to'ldiring")
      setLoading(false)
    }

    http.post('auth/local', userForm)
      .then((response) => {
        const data = response.data;

        if (data.message === "Request failed with status code 400") {
          alert("Username yoki parol noto'g'ri");
        }
        console.log(data);

        if (data.user) {
          localStorage.setItem('token', data.jwt);
          localStorage.setItem('user', JSON.stringify(data));
          navigate('/');
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Parol yoki email noto'g'ri");
      })
  }

  function guest(e) {
    e.preventDefault()

    const userForm = {
      'identifier': "test@test.com",
      'password': "secret"
    }

    http.post('auth/local', userForm)
      .then((response) => {
        const data = response.data;

        if (data.message === "Request failed with status code 400") {
          alert("Username yoki parol noto'g'ri");
        }
        console.log(data);

        if (data.user) {
          localStorage.setItem('token', data.jwt);
          localStorage.setItem('user', JSON.stringify(data));
          navigate('/');
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Parol yoki email noto'g'ri");
      })
  }


  return (
    <div className='bg-slate-50 pt-24 pb-48'>
      
      <form ref={formRef} className='w-96 mx-auto p-8 flex flex-col gap-4 shadow-lg backdrop-sepia-0 bg-white rounded-2xl'>
        <h1 className='text-center text-3xl font-bold text-[#394E6A]'>Login</h1>
        <div className='w-full'>
          <div className="input-bordered flex flex-col gap-2">
            <label className='text-[#394E6A] py-2 px-1 text-sm' htmlFor="em">Email</label>
            <input ref={emailRef}  type="email" className="grow border border-[#e5e7eb] px-4 w-[316px] h-12 rounded-lg bg-white" id='em' />
          </div>
          <div className="input-bordered flex flex-col gap-2">
            <label className='text-[#394E6A] py-2 px-1 text-sm' htmlFor="pa">Password</label>
            <input ref={passwordRef}  type="password" className="grow border border-[#e5e7eb] px-4 w-[316px] h-12 rounded-lg bg-white" id='pa' />
          </div>
          <div className='flex flex-col gap-3 my-4'>
            <button onClick={hendelSubmit} className='bg-[#057AFF] h-12 rounded-lg text-[#DBE1FF] uppercase font-semibold'>Login</button>
            <button onClick={guest} className='bg-[#463AA1] h-12 rounded-lg text-[#DBE1FF] uppercase font-semibold'>guest user</button>
          </div>
          <div className='flex gap-2 text-[#394E6A] text-base justify-center'>
            <p>Not a member yet?</p>
            <Link to='/register' className='text-[#057AFF] hover:underline'>Register</Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Login
