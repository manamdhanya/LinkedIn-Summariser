const axios = require('axios')
const CandidateDB = require('../models/candidateDB')

async function DataRetriver(url) {
    const apiKey = process.env.proxycurl_api
    const headers = {
        Authorization: `Bearer ${apiKey}`
    }

    const params = {
        linkedin_profile_url: url,
        extra: 'include',
        personal_contact_number: 'include',
        personal_email: 'include',
        inferred_salary: 'include',
        skills: 'include',
        use_cache: 'if-present',
        fallback_to_cache: 'on-error',
    }

    try {
        const response = await axios.get('https://enrichlayer.com/api/v2/profile', {
            headers: headers,
            params: params
        })

        

        const data = response.data
        const fullName = data.full_name
        const profile_pic_url = data.profile_pic_url
        const occupation = data.occupation
        const recommendations = data.recommendations
        let try_skills = {}
        const summary = data.summary
        const experiences = data.experiences
        const education = data.education
        const certifications = data.certifications
        const accomplishment_projects = data.accomplishment_projects
        const volunteer_work = data.volunteer_work
        const accomplishment_publications = data.accomplishment_publications
        const accomplishment_honors_awards = data.accomplishment_honors_awards
        const accomplishment_test_scores = data.accomplishment_test_scores

        const username = data.public_identifier

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.rapid_api,
                'X-RapidAPI-Host': 'linkdapi.p.rapidapi.com'
            }
        }

        const options1 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.rapid_api,
                'X-RapidAPI-Host': 'linkedin-data-scraper-api1.p.rapidapi.com'
            }
        }


        await fetch(`https://linkedin-data-scraper-api1.p.rapidapi.com/profile/detail?username=${username}`, options1)
            .then(response => response.json())
            .then(profileData => {
                 
                const urn = profileData?.data?.basic_info?.urn;

                if (!urn) {
                    throw new Error('URN not found in profileData.data');
                }

                


                return fetch(`https://linkdapi.p.rapidapi.com/api/v1/profile/skills?urn=${urn}`, options);
            })
            .then(response => response.json())
            .then(data => {
                const skills_endorse = data.data.skills;
                const skills_endorsement = {}
                for (let i = 0; i < skills_endorse.length; i++) {
                    
                    let skillName = skills_endorse[i].skillName
                    let num_endorsements = skills_endorse[i].endorsementsCount
                    skills_endorsement[String(skills_endorse[i].skillName)] = num_endorsements

                }
                
                try_skills = skills_endorsement
            })
            .catch(err => console.error("Error:", err.message));

        const skills_endorsements = try_skills

        

        await CandidateDB.create({
            fullName, profile_pic_url, occupation, recommendations, skills_endorsements, summary, experiences, education,
            certifications, accomplishment_projects, volunteer_work, accomplishment_publications, accomplishment_honors_awards, accomplishment_test_scores,
        })

        

        const user = {
            profile_pic_url: profile_pic_url,
            fullName: fullName,
            occupation: occupation,
            recommendations: recommendations,
            skills_endorsements: skills_endorsements,
            summary: summary,
            linkedUrl: url,
            experiences: experiences,
            education: education,
            certifications: certifications,
            accomplishment_projects: accomplishment_projects,
            volunteer_work: volunteer_work,
            accomplishment_publications: accomplishment_publications,
            accomplishment_honors_awards: accomplishment_honors_awards,
            accomplishment_test_scores: accomplishment_test_scores,
        }

        return ["success", user]
    } catch (error) {
        console.error("Error in Data retriever:", error.message)
        return ["Link is invalid", null]
    }
}

module.exports = { DataRetriver }
