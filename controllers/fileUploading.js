const { S3Client } = require("@aws-sdk/client-s3")
const { Upload } = require("@aws-sdk/lib-storage")
const { formidable } = require("formidable")
const { PassThrough } = require("stream")
const mime = require('mime-types')

const s3 = new S3Client({
  region: process.env.aws_region,
  credentials: {
    accessKeyId: process.env.aws_accessID,
    secretAccessKey: process.env.aws_accessKey,
  },
});

async function parsefile(req) {
  return new Promise((resolve, reject) => {
    const uploads = []

    const form = formidable({
      maxFileSize: 100 * 1024 * 1024,
      fileWriteStreamHandler: file => {
        const pass = new PassThrough()

        const fileExtension = file.originalFilename.split('.').pop()

        const contentType = mime.lookup(fileExtension) || 'application/octet-stream'

        console.log(contentType)

        const upload = new Upload({
          client: s3,
          params: {
            Bucket: process.env.aws_bucket,
            Key: `${Date.now()}-${file.originalFilename}`,
            Body: pass,
            ContentType: contentType,

          },
          queueSize: 4,
          partSize: 5 * 1024 * 1024,
          leavePartsOnError: false,
        })

        uploads.push(
          upload.done().then(data => {
            file.uploaded = {
              Location: data.Location,
              Key: data.Key,
              Bucket: data.Bucket,
            }
          })
        )

        return pass
      }
    })

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      Promise.all(uploads)
        .then(() => resolve({ fields, files }))
        .catch(reject)
    })
  })
}

module.exports = { parsefile }
