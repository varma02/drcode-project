import { Progress } from '@/components/ui/progress';
import WorkInProgress from '@/components/WorkInProgress'
import { useAuth } from '@/lib/api/AuthProvider'
import { API_URL, defaultTimeout, FILE_URL, UPLOAD_URL } from '@/lib/api/constants';
import axios from 'axios';
import React, { useState } from 'react'

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

  const [uploadProgress, setUploadProgress] = useState(null)
  function handleUpload(e) {
    e.preventDefault()
    console.log('uploading...')
    const file = e.target.file.files[0]
    createFile(auth.token, {
      name: file.name,
      mime_type: file.type,
      size: file.size,
    }).then((resp) => {
      axios.put(
        UPLOAD_URL + "/" + resp.data.file.path,
        file,
        {
          params: {
            token: resp.data.token
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(progressEvent)
          }
        }
      ).then((resp) => {
        console.log("upload complete")
      }).catch((err) => {
        console.trace("upload failed")
      })
    }).catch((err) => {
      console.trace("create failed")
    })
  }

  const [selectedFile, setSelectedFile] = useState(null)
  function handleShowFile(e) {
    e.preventDefault()
    axios.get(
      API_URL + "/file/get", {
      params: {
        ids: e.target.id.value
      },
      headers: { Authorization: `Bearer ${auth.token}` },
      timeout: defaultTimeout
    }).then((resp) => {
      console.log(resp.data)
      setSelectedFile({...resp.data.data.files[0], token: resp.data.data.token})
    }).catch((err) => {
      console.trace("show failed", err)
    })
  }

  return (
    <div>
      <form onSubmit={handleUpload}>
        <h1>testing</h1>
        <input name='file' type="file" multiple={false} />
        <button className='bg-blue-500'>Upload</button>
        <p>rate: {uploadProgress?.rate / 125000}Mbps</p>
        <Progress value={uploadProgress?.progress * 100} />
      </form>
      <form onSubmit={handleShowFile}>
        <h1>moreee ee testing</h1>
        <input className='bg-gray-600' name='id' type="string" required/>
        <button className='bg-blue-500'>show</button>
        {selectedFile && 
        <iframe src={FILE_URL + `/${selectedFile.author}/${selectedFile.id}/${selectedFile.name}?token=${selectedFile.token}`} className='h-96'></iframe>
        }
      </form>
    </div>
  )
}
