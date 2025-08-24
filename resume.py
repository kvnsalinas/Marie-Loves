from docx import Document
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

# Create PDF
pdf_path = "/mnt/data/Kevin_Salinas_Resume.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=A4)
styles = getSampleStyleSheet()
story = []

# Resume content from canvas
resume_text = """
Kevin Emmanuel Salinas

Marikina City, Philippines
Phone: +63 961 956 7273
Email: kevinsalinas408@gmail.com
LinkedIn: linkedin.com/in/kvnsalinas

Professional Summary
Results-driven Computer Science graduate with real-world experience in backend development, data migration, and technical support. Proven ability to automate systems, resolve user issues, and optimize performance using Python, SQL, PHP, and Linux/Windows environments. Adept at collaborating with diverse teams, managing systems, and delivering user-centered solutions. Currently seeking to leverage my technical and communication skills in IT support or software roles.

Skills
Technical: Python, PHP, SQL, JavaScript, MySQL, PostgreSQL, Flask, Linux, Windows OS, Microsoft Office, Google Workspace, Technical Documentation
Tools & Systems: Basic Networking, System Administration, Ticketing Systems (e.g., JIRA, Zendesk), LMS, Git
Soft Skills: Troubleshooting, Communication, Time Management, Customer Service, Problem-Solving, Teamwork, Adaptability

Education
Bachelor of Science in Computer Science
Technological Institute of the Philippines – Quezon City
Graduated: 2025

Professional Experience
Technical Support Intern
Massive Integrated Tech Solutions Inc. | Feb 2025 – Apr 2025
- Automated 95% of patient data migration using backend scripting, ensuring high data accuracy in a live hospital environment.
- Troubleshot backend and database issues in real-time, supporting live hospital systems and improving system stability.
- Collaborated with clinical staff to resolve over 20+ user-side technical issues, boosting usability by 30%.
- Documented common system problems and solutions to streamline internal troubleshooting processes.

Professional Development
May 2025 – Aug 2025
- Completed certifications in Python, Data Analysis, and Dashboarding from IBM and freeCodeCamp.
- Enhanced technical expertise through hands-on projects, peer collaboration, and mock system deployments.
- Refined problem-solving and debugging skills to prepare for full-time IT support and backend roles.

Projects
TravelMate – Recommender System
Team Lead & Back-End Developer | Python, Flask, PostgreSQL
- Built a web-based travel recommender using Neural Collaborative and Content-Based Filtering.
- Integrated database systems and conducted performance evaluations using RMSE, MAE, Precision, and Recall.
- Led a 4-person team through development, testing, and deployment phases.

SmileCare – Dental Appointment System
Back-End Developer | PHP, MySQL, JavaScript
- Developed scheduling and patient record system for clinics, reducing appointment errors by 40%.
- Ensured secure database configuration and resolved over 10+ backend bugs during system testing.
- Worked with clinic staff to enhance user experience and ease of access.

Certifications
- Python for Data Science, AI & Development – IBM (2025)
- Python Project for Data Science – IBM (2025)
- Introduction to Data Analytics – IBM (2025)
- Data Visualization with Excel and Cognos – IBM (2025)
- Data Analysis with Python – freeCodeCamp (2025)

References
Available upon request.
"""

for line in resume_text.strip().split("\n"):
    if line.strip() == "":
        story.append(Spacer(1, 12))
    else:
        style = styles["Heading3"] if line.strip().endswith(":") else styles["BodyText"]
        story.append(Paragraph(line.strip(), style))

doc.build(story)
pdf_path
