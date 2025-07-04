const { S3Client } = require("@aws-sdk/client-s3")
const { DeleteObjectCommand } = require("@aws-sdk/client-s3")
const path = require('path')

async function deleteFileFromS3(fileUrl) {
    try {
        
        const name = path.basename(fileUrl)
        
        const s3 = new S3Client({
            region: process.env.aws_region,
            credentials: {
                accessKeyId: process.env.aws_accessID,
                secretAccessKey: process.env.aws_accessKey,
            },
        });
        const input = {
            Bucket: process.env.aws_bucket,
            Key: `${name}`,
        }
        const command = new DeleteObjectCommand(input)
        const response = await s3.send(command)
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = { deleteFileFromS3 }