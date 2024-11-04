export const uploadService = {
  uploadImg
}

async function uploadImg(ev: Event) {
  const CLOUD_NAME: string = "dcwibf9o5";
  const UPLOAD_PRESET: string = "vt0iqgff";
  const UPLOAD_URL: string = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    const formData: FormData = new FormData();
    if (ev.target instanceof HTMLInputElement) {
      formData.append('upload_preset', UPLOAD_PRESET);
      if (ev.target.files && ev.target.files.length > 0) {
        formData.append('file', ev.target.files[0]);
      }
    }

    const res: Response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData
    });
    const imgUrl: any = await res.json();
    return imgUrl;
  } catch (err) {
    console.error('Failed to upload', err);
    throw err;
  }
}


//////////////////////////////////////////////////////with out ts

// export const uploadService = {
//   uploadImg
// }
// async function uploadImg(ev) {
//   const CLOUD_NAME = "dcwibf9o5"
//   const UPLOAD_PRESET = "vt0iqgff"
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

//   try {
//     const formData = new FormData()
//     formData.append('upload_preset', UPLOAD_PRESET)
//     formData.append('file', ev.target.files[0])

//     const res = await fetch(UPLOAD_URL, {
//       method: 'POST',
//       body: formData
//     })
//     const imgUrl = await res.json()
//     return imgUrl
//   } catch (err) {
//     console.error('Failed to upload', err)
//     throw err
//   }
// }

