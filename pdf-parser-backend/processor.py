import re
import json

'''def convert_to_letter_grade(numeric_grade):
    numeric_grade = int(numeric_grade)
    # Replace these grade thresholds with the correct ones for your grading system
    if numeric_grade >= 90:
        return 'A'
    elif numeric_grade >= 80:
        return 'B+'
    elif numeric_grade >= 70:
        return 'B'
    elif numeric_grade >= 60:
        return 'C+'
    elif numeric_grade >= 50:
        return 'C'
    elif numeric_grade >= 40:
        return 'D+'
    elif numeric_grade >= 30:
        return 'D'
    else:
        return 'F'

# Define the function to parse the transcript text
def parse_transcript(text):
    # Extract student information
    student_info = {
        "college": None,
        "email": None,
        "major": None,
        "mobile": "12345678",  # Placeholder for mobile
        "name": None,
        "semesters": []
    }

    # Regex patterns to extract student information
    college_match = re.search(r"College: (.+?)\n", text)
    if college_match:
        student_info["college"] = college_match.group(1).strip()

    email_match = re.search(r"Student ID: (\S+)", text)
    if email_match:
        student_info["email"] = email_match.group(1).strip() + "@udst.edu.qa"

    major_match = re.search(r"Major: (.+?)\n", text)
    if major_match:
        student_info["major"] = major_match.group(1).strip()

    name_match = re.search(r"Name: (.+?)\s+College:", text)
    if name_match:
        student_info["name"] = name_match.group(1).strip()

    # Regex pattern to find courses
    course_pattern = re.compile(r"([A-Z]{2,4}\s\d{4}) (.*?) (\d+\.\d{2}) (\d+\.\d{2}) (\d{2,3}) (\d+\.\d{2})")

    # Parse the course information
    for course_match in course_pattern.finditer(text):
        if course_match:
            course_code, course_title, attempted_credits, earned_credits, grade, points = course_match.groups()
            student_info["semesters"].append({
                "courses": [{
                    "courseCode": course_code,
                    "courseName": course_title.strip(),
                    "credit": float(attempted_credits),
                    "grade": grade,
                    "letterGrade": convert_to_letter_grade(grade)
                }]
            })

    # Convert to JSON format
    return json.dumps(student_info, indent=4)

# Dummy transcript text; replace this with the actual extracted text'''
text = """
UNOFFICIAL TRANSCRIPT
Date Issued: 21/01/2024
Page 1 of 4
Name: Talib Ismail Tambe College: College of Computing and IT
Student ID: 60101158 Credential: Bachelor of Science
Date of Birth: 16/04/2002 Major: Information Systems
Nationality: India Status: Active in Program
Date Fall 2021 - Spring 2022
Institution College of the North Atlantic - Qatar INSTITUTIONAL CREDIT
Credential B.Sc. - IT
Credits Accepted 0.000 Fall 2020
Course Title Attempted Earned Grade Points
CM 1040 Academic Reading 3.00 3.00 90 12.00
CP 1000 Computer Essentials 3.00 3.00 95 12.00
Date Fall 2022
CP 1360 Programming I 3.00 3.00 90 12.00
Institution University of Doha for Science & Technology
MA 1900 Problem Solving for IT 4.00 4.00 95 16.00
Credential B.Sc. - IT
SD 1570 Effective Learning 4.00 4.00 100 16.00
Credits Accepted 0.000
Term Totals 17.00 17.00 68.00
Cumulative Totals 17.00 17.00 68.00
EXEMPTIONS Term GPA 4.00
Cumulative GPA 4.00
Course Title Credits Grade Term Academic Standing Clear Standing - Regular Level
BUSG 2002 Project Management 0.00 EN Fall 2021 Honor Standing
COMM 1010 English Communication I 0.00 EN Fall 2021
DACS 2201 Intro to Data & Cyber Security 0.00 EN Fall 2021
ECON 1001 Global Economic Concepts 0.00 EN Fall 2021
EFFL 1001 Effective Learning 0.00 EN Fall 2021
INFS 1101 Intro to Comp & Prob Solving 0.00 EN Fall 2021
INFS 1201 Computer Programming 0.00 EN Fall 2021
INFT 1201 Computer Hardware 0.00 EN Fall 2021
MATH 1050 Linear Algebra 0.00 EN Fall 2021
SCIE 1002 Science & the Environment 0.00 EN Fall 2021
SSHA 1003 Introductory Psychology 0.00 EN Fall 2021
MATH 1020 Pre-Calculus 0.00 EN Spring 2022
INFS 4205 Emerging Mobile Technologies 0.00 EN Fall 2022
INFT 2102 Mathematics for IT 0.00 EN Fall 2022
INFT 2102 Mathematics for IT 0.00 EN Fall 2022
INFT 2202 Linux Foundations 0.00 EN Fall 2022
UNOFFICIAL TRANSCRIPT
Date Issued: 21/01/2024
Page 2 of 4
Name: Talib Ismail Tambe College: College of Computing and IT
Student ID: 60101158 Credential: Bachelor of Science
Date of Birth: 16/04/2002 Major: Information Systems
Nationality: India Status: Active in Program
Winter 2021 Fall 2021
Course Title Attempted Earned Grade Points Course Title Attempted Earned
Grade Points
CM 2310 Essential Communications 3.00 3.00 80 12.00 INFS 2101 Web Technologies I 3.00 3.00 A 12.00
CP 1050 Computer Architecture 3.00 3.00 95 12.00 INFS 2201 Database Management Systems 3.00 3.00 B+ 10.50
CP 1436 Web I 3.00 3.00 90 12.00 INFS 3102 Object-Oriented Programming 3.00 3.00 C+ 7.50
CP 1932 Systems Analysis 3.00 3.00 80 12.00 MATH 1030 Calculus I 3.00 3.00 B+ 10.50
CP 2040 Programming II 4.00 4.00 85 16.00 Term Totals 12.00 12.00 40.50
PR 2155 Project Management 3.00 3.00 80 12.00 Cumulative Totals 57.00 57.00 220.50
Term Totals 19.00 19.00 76.00 Term GPA 3.38
Cumulative Totals 36.00 36.00 144.00 Cumulative GPA 3.87
Term GPA 4.00 Academic Standing
Cumulative GPA 4.00 Distinction Award
Academic Standing Clear Standing - Regular Level
Honor Standing
Winter 2022
Course Title Attempted Earned Grade Points
Spring 2021 COMM 1020 English Communication II 3.00 3.00 B+ 10.50
Course Title Attempted Earned Grade Points DACS 2101 Discrete Structures
3.00 3.00 B+ 10.50
CR 1041 Customer Service for IT 2.00 2.00 95 8.00 DSAI 2201 Intro to Data Science and AI 3.00 3.00 C+ 7.50
CR 1270 Information Security I 4.00 4.00 95 16.00 INFT 2201 Intro to Operating Systems 3.00 3.00 B 9.00
EP 1310 ICT in Organizations 3.00 3.00 90 12.00 Term Totals 12.00 12.00 37.50
Term Totals 9.00 9.00 36.00 Cumulative Totals 69.00 69.00 258.00
Cumulative Totals 45.00 45.00 180.00 Term GPA 3.13
Term GPA 4.00 Cumulative GPA 3.74
Cumulative GPA 4.00 Academic Standing Clear Standing
Academic Standing Clear Standing - Regular Level
Honor Standing
Dean's List
UNOFFICIAL TRANSCRIPT
Date Issued: 21/01/2024
Page 3 of 4
Name: Talib Ismail Tambe College: College of Computing and IT
Student ID: 60101158 Credential: Bachelor of Science
Date of Birth: 16/04/2002 Major: Information Systems
Nationality: India Status: Active in Program
Spring 2022 Winter 2023
Course Title Attempted Earned Grade Points Course Title Attempted Earned
Grade Points
INFS 1301 Computing Ethics and Society 3.00 3.00 A 12.00 INFS 3201 Web Technologies II 3.00 3.00 A 12.00
MATH 1040 Statistics 3.00 3.00 A 12.00 INFS 3202 IT Systems Integration 3.00 3.00 B+ 10.50
Term Totals 6.00 6.00 24.00 INFS 3203 Systems Deploy & Implement 3.00 3.00 B 9.00
Cumulative Totals 75.00 75.00 282.00 INFT 3203 Web Server Management 3.00 3.00 B+ 10.50
Term GPA 4.00 Term Totals 12.00 12.00 42.00
Cumulative GPA 3.76 Cumulative Totals 97.00 97.00 360.50
Academic Standing Term GPA 3.50
Cumulative GPA 3.72
Academic Standing Clear Standing
Fall 2022
Course Title Attempted Earned Grade Points
INFS 3103 Systems Analysis and Design 3.00 3.00 B+ 10.50 Spring 2023
INFS 3104 Data Structures and Algorithms 3.00 3.00 A 12.00 Course Title Attempted Earned Grade Points
INFT 2101 Networking I 4.00 4.00 B+ 14.00 GARC 1001 Qatar History & Society 3.00 3.00 A 12.00
Term Totals 10.00 10.00 36.50 INFS 3301 Human Computer Interaction 3.00 3.00 A 12.00
Cumulative Totals 85.00 85.00 318.50 Term Totals 6.00 6.00 24.00
Term GPA 3.65 Cumulative Totals 103.00 103.00 384.50
Cumulative GPA 3.75 Term GPA 4.00
Academic Standing Clear Standing Cumulative GPA 3.73
Academic Standing
UNOFFICIAL TRANSCRIPT
Date Issued: 21/01/2024
Page 4 of 4
Name: Talib Ismail Tambe College: College of Computing and IT
Student ID: 60101158 Credential: Bachelor of Science
Date of Birth: 16/04/2002 Major: Information Systems
Nationality: India Status: Active in Program
Fall 2023
Course Title Attempted Earned Grade Points
COMP 4101 Practicum 3.00 3.00 B 9.00
DACS 4102 Web Security 3.00 3.00 A 12.00
INFS 4104 Mobile App Technologies 3.00 3.00 A 12.00
INFS 4202 SW Testing & Quality Assurance 3.00 3.00 C+ 7.50
Term Totals 12.00 12.00 40.50
Cumulative Totals 115.00 115.00 425.00
Term GPA 3.38
Cumulative GPA 3.70
Academic Standing Clear Standing
Winter 2024
Course Title Attempted Earned Grade Points
COMP 4201 Capstone Project 3.00
INFS 4101 IS Management & Strategy 3.00
INFS 4103 UI/UX Design 3.00
Term Totals 9.00
Cumulative Totals
Term GPA
Cumulative GPA
Academic Standing
**** End of Transcript ****
"""

semesters_with_years = re.findall(r'(Fall|Winter|Spring)\s+\d{4}', text)

# Extract the last semester with year from the list
last_semester_with_year = semesters_with_years[-1] if semesters_with_years else None

print(last_semester_with_year)