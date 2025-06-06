from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))



def extract_profile_details(text):
    try:
        system_prompt = """
        You are a helpful assistant that can extract profile details from a given text in JSON format.
        
        Data we need is:
        1. Full_Name
        2. ProfessionalTitle
        3. Skills (Tech Skills Like React, Python and Javscript) - List
        4. Experience - List of Objects
        5. PortfolioURI
        6. Projects - List of Objects
        7. SocialLinks - List of Objects
        8. About

        Projects Platform CHocies
        1. upwork
        2. fiverr
        3. freelancer
        4. direct_client

        Projects Status CHocies
        1. pending
        2. in_progress
        3. completed
        4. cancelled

        Example JSON Struture:
        {
            "full_name": "John Doe",
            "professional_title": "Software Engineer",
            "about": "Software Engineer with 5 years of experience in web development.",
            "skills": ["React", "Python", "JavaScript"],
            "experience": [
                {
                    "company": "Tech Corp",
                    "title": "Software Engineer",
                    "start_date": "2022-01-01",
                    "end_date": "2022-12-31"
                }
            ],
            "portfolio_uri": "https://example.com/portfolio",
            "projects": [
                {
                    "title": "Project A",
                    "description": "Description of Project A",
                    "budget": 1000,
                    "platform": "upwork",
                    "status": "completed"
                }
            ],
            "social_links": [
                {
                    "platform": "LinkedIn",
                    "url": "https://linkedin.com/in/johndoe"
                }
            ]
        }
        
        IMPORTANT: Return ONLY the JSON object with no additional text, markdown formatting, or code blocks.
        """
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ]
        )

        content = response.choices[0].message.content
        
        # Clean up the response to ensure it's valid JSON
        # Remove any markdown code block markers
        content = content.replace('```json', '').replace('```', '').strip()
        
        # Try to parse the JSON to ensure it's valid
        try:
            import json
            parsed_json = json.loads(content)
            return parsed_json  # Return the parsed JSON as a Python dictionary
        except json.JSONDecodeError:
            # If parsing fails, return the cleaned string
            return content
        
    except Exception as e:
        print(f"Error in extract_profile_details: {e}")
        # Return a default structure in case of error
        return {
            "full_name": "",
            "professional_title": "",
            "about": "",
            "skills": [],
            "experience": [],
            "portfolio_uri": None,
            "projects": [],
            "social_links": []
        }