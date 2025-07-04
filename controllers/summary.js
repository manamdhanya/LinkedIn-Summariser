const { GoogleGenAI } = require('@google/genai')
const detailsSummaryDB = require("../models/detailsSummaryDB")
const exsistingCandidatesDB = require("../models/exsistingCandidatesDB")

function sanitize(text) {
    if (!text) return "";
    return text.toString().replace(/"/g, '\\"').replace(/\n/g, ' ').replace(/\r/g, ' ')
}

async function geminiModel(value, userDetails) {
    try {
        const api = new GoogleGenAI({ 
            apiKey: process.env.google_api
        })

        const user = value
        const {
            fullName,
            profile_pic_url,
            occupation,
            recommendations = [],
            summary,
            skills_endorsements = [],
            experiences = [],
            education = [],
            certifications = [],
            accomplishment_projects = [],
            volunteer_work = [],
            accomplishment_publications = [],
            accomplishment_honors_awards = [],
            accomplishment_test_scores = []
        } = user

        const formattedExperience = experiences.map(exp =>
            `${sanitize(exp.role)} at ${sanitize(exp.company)}${exp.duration ? ` (${sanitize(exp.duration)})` : ''}`
        ).join('; ')

        const formattedEducation = education.map(edu =>
            `${sanitize(edu.degree_name)} in ${sanitize(edu.field_of_study)} from ${sanitize(edu.school_linkedin_profile_url)}`
        ).join('; ')

        const formattedCertifications = certifications.map(cert =>
            `${sanitize(cert.name)} from ${sanitize(cert.issuer)}${cert.year ? ` (${sanitize(cert.year)})` : ''}`
        ).join(', ')

        const formattedProjects = accomplishment_projects.map(project =>
            `${sanitize(project.name)}: ${sanitize(project.description)}`
        ).join('; ')

        const formattedVolunteerWork = volunteer_work.map(vol =>
            `${sanitize(vol.title)} at ${sanitize(vol.company)} - ${sanitize(vol.description)}`
        ).join('; ')

        const formattedPublications = accomplishment_publications.map(pub =>
            `${sanitize(pub.title)} - ${sanitize(pub.publisher)}${pub.year ? ` (${sanitize(pub.year)})` : ''}`
        ).join('; ')

        const formattedHonorsAwards = accomplishment_honors_awards.map(award =>
            `${sanitize(award.title)} from ${sanitize(award.issuer)}${award.year ? ` (${sanitize(award.year)})` : ''}`
        ).join(', ')

        const formattedTestScores = accomplishment_test_scores.map(score =>
            `${sanitize(score.testName)}: ${sanitize(score.score)}${score.percentile ? ` (${sanitize(score.percentile)} percentile)` : ''}`
        ).join(', ')

        const skills = ["HTML"]

        const prompt = `
        You will be given a person's LinkedIn profile data.
        Your task is to extract the key details and return a well-structured JSON object with the following fields:

        {
        "name": "",
        "occupation": "",
        "bio": [ "bio point 1", "bio point 2", "bio point 3" ],
        "experience": [ "company 1", "company 2", "company 3" ],
        "projects": [ "project 1 description", "project 2 description" ],
        "skills": "As JSON Object",
        "education": [ "Degree - Institution", "Degree - Institution" ],
        "certifications": [ "Certificate 1", "Certificate 2" ],
        "achievements": [ "Achievement 1", "Achievement 2" ],
        "interests": [ "Interest 1", "Interest 2" ],
        "recommendations": [ "Recommendation text 1", "Recommendation text 2" ],
        "volunteer": [ "Volunteer work 1", "Volunteer work 2" ]
        }

        Only return valid JSON. Do not include any extra text.Only return the JSON object. Do NOT wrap the response in markdown or backticks.

        Here is the resume data:
        {
        "name": "${sanitize(fullName)}",
        "occupation": "${sanitize(occupation)}",
        "recommendations": ${JSON.stringify(recommendations)},
        "skills": "${JSON.stringify(skills_endorsements)}",
        "experience": "${sanitize(formattedExperience)}",
        "education": "${sanitize(formattedEducation)}",
        "certifications": "${sanitize(formattedCertifications)}",
        "accomplishment_projects": "${sanitize(formattedProjects)}",
        "volunteer_work": "${sanitize(formattedVolunteerWork)}",
        "accomplishment_publications": "${sanitize(formattedPublications)}",
        "accomplishment_honors_awards": "${sanitize(formattedHonorsAwards)}",
        "accomplishment_test_scores": "${sanitize(formattedTestScores)}"
        }
        `

        const response = await api.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "Don't use features like bold an italic",
            }
        })

        let summaryDetailed

        try {
            summaryDetailed = JSON.parse(response.text);
        } catch (e) {
            console.error("Invalid JSON from Gemini:\n", response.text)
            throw new Error("Gemini returned invalid JSON")
        }

        const { firstName, lastName, phoneNumber, position, email, linkedUrl} = userDetails

        await detailsSummaryDB.create({ profile_pic_url, firstName, lastName, phoneNumber, position, email, linkedUrl, summaryDetailed })

        await exsistingCandidatesDB.create({ profile_pic_url, fullName, position, email, summaryDetailed})

        return summaryDetailed

    } catch (error) {
        console.error("Error in summary generation:", error.message)
        return "Summary Generation Error"
    }
}

module.exports = { geminiModel }
