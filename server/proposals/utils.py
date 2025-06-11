from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os
import json
from core.models import FreelancerProfile, Projects, Experience
from .prompts import ProposalPromptFactory

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))



def get_freelancer_data(user):
    """
    Retrieve and format freelancer profile data, projects, and experience
    
    Args:
        user: The user object to retrieve data for
        
    Returns:
        str: Formatted string with freelancer data or None if profile doesn't exist
    """
    try:
        # Get freelancer profile
        try:
            freelance_obj = FreelancerProfile.objects.get(user=user)
        except FreelancerProfile.DoesNotExist:
            return None
            
        # Get projects and experience
        projects = Projects.objects.filter(user=user)
        experiences = Experience.objects.filter(user=user)
        
        # Format basic profile information
        to_string = f"""
        # FREELANCER PROFILE
        Name: {freelance_obj.full_name}
        TagLine: {freelance_obj.tagline}
        Portfolio: {freelance_obj.portfolio}
        About: {freelance_obj.about}
        Skills: {freelance_obj.skills}
        """

        # Add projects information if available
        if projects:
            to_string += "\n# PROJECTS\n"
            for i, project in enumerate(projects, 1):
                to_string += f"""
                Project {i}:
                - Title: {project.title}
                - Description: {project.description}
                - Budget: {project.budget}
                - Platform: {project.platform}
                - Status: {project.status}
                - Timeline: {project.start_date} to {project.end_date}
                """

        # Add experience information if available
        if experiences:
            to_string += "\n# WORK EXPERIENCE\n"
            for i, exp in enumerate(experiences, 1):
                to_string += f"""
                Experience {i}:
                - Company: {exp.company}
                - Title: {exp.title}
                - Location: {exp.location}
                - Period: {exp.start_date} to {exp.end_date}
                - Description: {exp.description}
                """
        
        return to_string

    except Exception as e:
        print(f"Error in get_freelancer_data: {str(e)}")
        return None



def analyze_client_pain_points(job_description):
    """
    Analyze the job description to identify client pain points and needs
    
    Args:
        job_description: The job description text
        
    Returns:
        dict: Identified pain points, needs, and goals of the client
    """
    try:
        # Format the prompt for pain point analysis
        prompt = f"""
        # CLIENT PAIN POINT ANALYSIS
        
        ## Job Description
        {job_description}
        
        ## Analysis Instructions
        Analyze this job description to identify the client's main pain points.
        
        Extract exactly 3 main pain points that the client is trying to solve with this job posting.
        Focus on specific problems, challenges, or needs that are either explicitly stated or clearly implied.
        If there are no clear pain points, identify the client's most important needs instead.
        
        Keep each pain point concise (1 sentence) but specific enough to be actionable in a proposal.
        
        Format your response as a JSON object with a single field 'pain_points' containing an array of 3 pain points.
        Example: {{'pain_points': ['Pain point 1', 'Pain point 2', 'Pain point 3']}}
        """
        
        # Call OpenAI API for pain point analysis
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.5,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an expert business analyst who specializes in identifying the most critical pain points from job descriptions. Focus on extracting the 3 most important problems or needs that a proposal should address."},
                {"role": "user", "content": prompt}
            ]
        )
        
        # Parse and return the analysis
        analysis = json.loads(response.choices[0].message.content)
        return analysis
    
    except Exception as e:
        print(f"Error in analyze_client_pain_points: {str(e)}")
        return {"error": f"Error analyzing client pain points: {str(e)}"}


def generate_targeted_proposal(user, job_description, pain_points, style="default", strategy=''):
    """
    Generate a proposal that specifically addresses the client's pain points
    
    Args:
        user: The user object for whom to generate the proposal
        job_description: The job description text
        pain_points: The pain points analysis from analyze_client_pain_points
        style: The style of proposal to generate
        strategy: The strategy to use for proposal generation
        
    Returns:
        str: The generated proposal text or None if an error occurred
    """
    try:
        # Get freelancer data
        freelancer_data = get_freelancer_data(user)
        if not freelancer_data:
            return None
        
        # Import the ProposalPromptFactory
        from proposals.prompts import ProposalPromptFactory
        
        # Get the appropriate prompt based on style
        prompt_obj = ProposalPromptFactory.get_prompt(style)
        
        # Get the base prompt from the prompt object
        base_prompt = prompt_obj.get_prompt(freelancer_data, job_description)
        
        # Add pain points to the prompt
        pain_points_section = "\n\n## Client Pain Points Analysis\n"
        if isinstance(pain_points, list):
            for i, point in enumerate(pain_points, 1):
                pain_points_section += f"\n{i}. {point}"
        else:
            pain_points_section += str(pain_points)
        
        # Combine the base prompt with pain points
        prompt = base_prompt + pain_points_section
        
        # Call OpenAI API for targeted proposal generation
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.7,
            messages=[
                {"role": "system", "content": prompt},
            ]
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error in generate_targeted_proposal: {str(e)}")
        return f"Error generating targeted proposal: {str(e)}"


def humanize_proposal(proposal_text):
    """
    Make the proposal sound more human and natural
    
    Args:
        proposal_text: The generated proposal text
        
    Returns:
        str: The humanized proposal text
    """
    try:
        # Format the prompt for humanizing the proposal
        prompt = f"""
        # HUMANIZE PROPOSAL
        
        ## Original Proposal
        {proposal_text}
        
        ## Instructions
        Rewrite this proposal to sound more human, natural, and personally written while STRICTLY maintaining the original structure, format, and organization. 
        
        Make the following improvements:
        1. Remove any AI-like patterns or formulaic language
        2. Add some personality and warmth to the tone
        3. Vary sentence structure within each section
        4. Use contractions and conversational language where appropriate
        5. Maintain all the key points, professional quality, and EXACT SECTION STRUCTURE
        
        IMPORTANT RULES:
        - DO NOT change section headings or titles
        - DO NOT reorganize the content or change the order of sections
        - DO NOT remove or add new sections
        - DO NOT change the format of bullet points or numbered lists
        - DO NOT alter the pricing structure or technical specifications
        - KEEP all paragraphs in their original locations
        
        The goal is to make this sound like it was written by a real person while preserving the exact structure of the original proposal.
        """
        
        # Call OpenAI API for humanizing the proposal
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.8,  # Higher temperature for more creative, human-like text
            messages=[
                {"role": "system", "content": "You are an expert proposal writer who specializes in making professional proposals sound naturally human-written. Your goal is to maintain the exact structure, format, and organization of the proposal while adding warmth and personality. Never change section headings, bullet points, or the overall format of the document."},
                {"role": "user", "content": prompt}
            ]
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        print(f"Error in humanize_proposal: {str(e)}")
        return proposal_text  # Return original if humanizing fails


def generate_proposal(user, job_description, style="default"):
    """
    Generate a proposal based on user data, job description and selected style
    This is the legacy function maintained for backward compatibility
    
    Args:
        user: The user object for whom to generate the proposal
        job_description: The job description text
        style: The style of proposal to generate (default, professional, creative, solutions, casual, technical)
        
    Returns:
        str: The generated proposal text or None if an error occurred
    """
    try:
        # Get freelancer data
        freelancer_data = get_freelancer_data(user)
        if not freelancer_data:
            return None
            
        # Get the appropriate prompt based on style
        prompt_instance = ProposalPromptFactory.get_prompt(style)
        formatted_prompt = prompt_instance.get_prompt(freelancer_data, job_description)
        
        # Call OpenAI API with the formatted prompt and enhanced system message
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.7,  # Slightly higher temperature for more natural language
            messages=[
                {"role": "system", "content": "You are writing as the freelancer themselves. Use a natural, conversational tone that avoids AI-generated patterns. Write in first person and make the proposal sound personally written with the freelancer's unique voice. Keep it concise and focused on the most relevant qualifications for this specific job."},
                {"role": "user", "content": formatted_prompt}
            ]
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in generate_proposal: {str(e)}")
        return f"Error generating proposal: {str(e)}"