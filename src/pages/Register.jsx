import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { http } from '../axios';

const Register = () => {
    const UsernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const FormRef = useRef();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    function validate() {
        if (UsernameRef.current.value.length < 3) {
            alert('Username is not valid');
            UsernameRef.current.focus(); // FirstnameRef o'rniga UsernameRef ishlatiladi
            return false;
        }

        if (!validateEmail(emailRef.current.value)) {
            alert('Email is not valid');
            emailRef.current.focus();
            return false;
        }

        if (passwordRef.current.value.length < 6) {
            alert('Password should be at least 6 characters long');
            passwordRef.current.focus();
            return false;
        }

        return true;
    }

    function handleClick(e) {
        e.preventDefault();
        let isValid = validate();

        if (!isValid) {
            return;
        }

        const user = {
          "username": UsernameRef.current.value,
          "email": emailRef.current.value,
          "password": passwordRef.current.value,
        };

        http.post('/auth/local/register', user) // To'liq API yo'li kiriting
            .then((response) => {
                const data = response.data;
                if (data.user) {
                    navigate('/login');
                }
                FormRef.current.reset(); // Forma reset qiling
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
      <div className='bg-slate-100 pt-24 pb-48'   >
          <div>
              <form ref={FormRef} className='w-96 mx-auto  p-8 flex flex-col gap-4 shadow-lg backdrop-sepia-0 bg-white rounded-2xl'>
                  <div className='w-full'>
                      <div className="input-bordered flex flex-col gap-2">
                          <label className='text-[#394E6A] py-2 px-1 text-sm' htmlFor="te">Username</label>
                          <input ref={UsernameRef} type="text" className="grow border text-[#394E6A] border-[#e5e7eb] px-4 w-[316px] h-12 rounded-lg bg-white" id='te' />
                      </div>
                      <div className="input-bordered flex flex-col gap-2">
                          <label className='text-[#394E6A] py-2 px-1 text-sm' htmlFor="em">Email</label>
                          <input ref={emailRef} type="email" className="grow border text-[#394E6A] border-[#e5e7eb] px-4 w-[316px] h-12 rounded-lg bg-white" id='em' />
                      </div>
                      <div className="input-bordered flex flex-col gap-2">
                          <label className='text-[#394E6A] py-2 px-1 text-sm' htmlFor="pa">Password</label>
                          <input ref={passwordRef} type="password" className="grow border text-[#394E6A] border-[#e5e7eb] px-4 w-[316px] h-12 rounded-lg bg-white" id='pa' />
                      </div>
                      <div>
                          <button onClick={handleClick} className='bg-[#057AFF] w-full my-4 h-12 rounded-lg text-[#DBE1FF] uppercase font-semibold'>Register</button>
                      </div>
                      <div className='flex gap-2 text-[#394E6A] text-base justify-center'>
                          <p>Already a member</p>
                          <Link to='/login' className='text-[#057AFF] hover:underline'>Login</Link>
                      </div>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default Register;
