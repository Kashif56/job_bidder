from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os
from core.models import FreelancerProfile
from .utils import get_freelancer_data

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def analyze_job_match(user, job_description):
    """
    Analyze how well a freelancer matches a job description and if it's worth bidding on
    
    Args:
        user: The user object for whom to analyze the match
        job_description: The job description text
        
    Returns:
        dict: Analysis results including match score, strengths, weaknesses, and recommendation
    """
    try:
        # Get freelancer data
        freelancer_data = get_freelancer_data(user)
        if not freelancer_data:
            return {
                "error": "Freelancer profile not found"
            }
        
        # Format the prompt for job match analysis
        prompt = f"""
        # JOB MATCH ANALYSIS TASK
        
        ## Freelancer Profile
        {freelancer_data}
        
        ## Job Description
        {job_description}
        
        ## Analysis Instructions
        Analyze how well this freelancer matches the job requirements and determine if this is a good opportunity to bid on.
        
        Provide the following in your analysis:
        1. Match Score: A numerical score from 1-100 indicating how well the freelancer's skills and experience match the job requirements
        2. Key Strengths: 3-5 bullet points highlighting the freelancer's strongest qualifications for this job
        3. Potential Gaps: 2-3 bullet points noting any missing skills or experience that might be concerning
        4. Bid Recommendation: Clear recommendation on whether to bid (Highly Recommended, Recommended, Consider with Caution, Not Recommended)
        5. Winning Strategy: Brief suggestion on how to position the proposal to win this job
        
        Format your response as a JSON object with the following structure:
        {{
            "match_score": 85,
            "strengths": ["strength1", "strength2", "strength3"],
            "gaps": ["gap1", "gap2"],
            "recommendation": "Recommended",
            "strategy": "Focus on your experience with similar projects and emphasize your quick turnaround time."
        }}
        """
        
        # Call OpenAI API for job match analysis
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.5,  # Lower temperature for more consistent analysis
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an expert freelance job analyzer that helps freelancers determine if a job is a good match for their skills and experience. Provide honest, data-driven analysis."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse and return the analysis
        analysis = response.choices[0].message.content
        return analysis
    
    except Exception as e:
        print(f"Error in analyze_job_match: {str(e)}")
        return {
            "error": f"Error analyzing job match: {str(e)}"
        }
