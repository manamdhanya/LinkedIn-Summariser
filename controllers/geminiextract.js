const { GoogleGenAI } = require('@google/genai')
const axios = require('axios')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const path = require('path')
const {deleteFileFromS3} = require("./deleteFileFromS3")

async function extractCandidateDetails(fileUrl) {
    try {
        const api = new GoogleGenAI({
            apiKey: process.env.google_api,
        })

        const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' })
        const ext = path.extname(fileUrl).toLowerCase()
        let resumeText = ''

        if (ext === '.pdf') {
            const parsed = await pdfParse(fileResponse.data)
            resumeText = parsed.text
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ buffer: fileResponse.data })
            resumeText = result.value
        } else {
            throw new Error('Unsupported file type')
        }

        const prompt = `
            Extract the following fields from the resume below:
            - First Name
            - Last Name
            - Phone Number (10-digit format only, no dashes or spaces)
            - Email
            - LinkedIn URL

            Return ONLY a strict JSON OBJECT like:
            {
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "1234567890",
                "email": "john.doe@gmail.com",
                "linkedUrl": "https://linkedin.com/in/johndoe"
            }

            Resume Text: ${resumeText}
        `

        const result = await api.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Don't use features like bold or italic",
            }
        });

        let rawText = result.text
        rawText = rawText.replace(/```json|```|JSON|\n/g, '').trim()
        let parsedJson = null

        try {
            parsedJson = JSON.parse(rawText)
        } catch (error) {
            throw new Error("Error parsing model response to JSON.")
        }


        for (let x in parsedJson) {
            if (parsedJson[x] == "") {
                throw new Error(`${x} is not mentioned in resume`)
            }
        }
        return parsedJson

    } catch (error) {
        deleteFileFromS3(fileUrl)
        throw new Error(`${error.message}`)
    }
}

module.exports = { extractCandidateDetails }
