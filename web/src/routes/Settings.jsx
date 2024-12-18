import { Pen } from 'lucide-react'
import React from 'react'

export const Settings = () => {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-xl font-bold'>Beállíások</h2>
      <div className='w-96'>
        <h3>Profil</h3>
        <div className='bg-[#2a2a30] rounded-xl divide-y divide-black'>
        <div className='p-3 flex justify-between items-center'>
            <div className='flex flex-col'>
              <label className='opacity-50 text-sm'>Felhasználónév</label>
              <input type="text" value={"Username"} className='bg-transparent' />
            </div>
            <Pen />
          </div>
          <div className='p-3 flex justify-between items-center'>
            <div className='flex flex-col'>
              <label className='opacity-50 text-sm'>Jelszó</label>
              <input type="password" value={"12345678"} className='bg-transparent' />
            </div>
            <Pen />
          </div>
          <div className='p-3 flex justify-between items-center'>
            <p>Profilkép</p>
            <input type="file" className='bg-transparent w-20 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  )
}
