import { Progress } from '@/components/ui/progress';
import WorkInProgress from '@/components/WorkInProgress'
import { useAuth } from '@/lib/api/AuthProvider'
import { API_URL, defaultTimeout } from '@/lib/api/constants';
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
        "http://localhost:41663/upload/"+resp.data.file.path,
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

  return (
    <form onSubmit={handleUpload}>
      <h1>testing</h1>
      <input name='file' type="file" multiple={false} />
      <button>Upload</button>
      <p>rate: {uploadProgress?.rate / 125000}Mbps</p>
      <Progress value={uploadProgress?.progress * 100} />
    </form>
  )
}
