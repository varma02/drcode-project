import WorkInProgress from '@/components/WorkInProgress'
import { useAuth } from '@/lib/api/AuthProvider'
import { API_URL, defaultTimeout } from '@/lib/api/constants';
import axios from 'axios';
import React from 'react'

export default function Search() {

  const auth = useAuth()

  async function createFile(token, data) {
    return (
      await axios.post(
        API_URL + "/file/create", 
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: defaultTimeout
        }
      )
    ).data;
  }

  function handleUpload(e) {
    e.preventDefault()
    console.log('uploading...')
    const file = e.target.file.files[0]
    console.log(file)
    createFile(auth.token, {
      name: file.name,
      mime_type: file.type,
      size: file.size,
    }).then((resp) => {
      // const formData = new FormData()
      // formData.append('file', file)
      // console.log(formData, file);
      
      axios.put(
        "http://localhost:41663/upload/"+resp.data.file.path,
        file,
        {
          params: {
            token: resp.data.token
          },
          timeout: defaultTimeout
        }
      ).then((resp) => {
        console.log(resp)
      }).catch((err) => {
        console.trace(err)
      })
    }).catch((err) => {
      console.trace(err)
    })
  }

  return (
    <form onSubmit={handleUpload}>
      <h1>testing</h1>
      <input name='file' type="file" multiple={false} />
      <button>Upload</button>
    </form>
  )
}
