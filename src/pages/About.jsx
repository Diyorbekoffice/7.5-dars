import React from 'react'

function About() {
  return (
    <div className='h-[500px]'>
      <div className='flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center mt-16'> 
        <h1 className='text-4xl font-bold leading-none tracking-tight sm:text-6xl text-slate-600'>We love</h1>
        <div className='stats bg-primary shadow'>
          <div className='stat'>
            <div className='text-4xl font-bold flex items-center justify-center  rounded-xl text-gray-200'>comfy</div>
          </div>
        </div>
      </div>
      <p className='mt-6 text-lg leading-8 max-w-2xl mx-auto text-slate-600'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore quae quam blanditiis vitae, dolor non eveniet ipsum voluptatibus, quia optio aut! Perferendis ipsa cumque ipsam nostrum reprehenderit ad illo sed officiis ea tempore! Similique eos minima sit porro, ratione aspernatur!</p>
    </div>
  )
}

export default About;