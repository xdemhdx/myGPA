import re

transcript_text = """
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
Course Title Attempted Earned Grade Points DACS 2101 Discrete Structures 3.00 3.00 B+ 10.50
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
INFS 4103 UI UX Design 3.00
Term Totals 9.00
Cumulative Totals
Term GPA
Cumulative GPA
Academic Standing
**** End of Transcript ****
"""


import re

name_re = r"Name: ([\w\s]+) College:"
student_id_re = r"Student ID: (\d+)"
dob_re = r"Date of Birth: ([\d/]+)"
nationality_re = r"Nationality: (\w+)"
college_re = r"College: (.*?)\n"  
credential_re = r"Credential: (.*?)\n"  
major_re = r"Major: ([\w\s]+)\n"  
status_re = r"Status: ([\w\s]+)Program"

personal_details = {
    "Name": re.search(name_re, transcript_text).group(1).strip(),
    "Student ID": re.search(student_id_re, transcript_text).group(1).strip(),
    "Date of Birth": re.search(dob_re, transcript_text).group(1).strip(),
    "Nationality": re.search(nationality_re, transcript_text).group(1).strip(),
    "College": re.search(college_re, transcript_text).group(1).strip(),
    "Credential": re.search(credential_re, transcript_text).group(1).strip(),
    "Major": re.search(major_re, transcript_text).group(1).strip() if re.search(major_re, transcript_text) else "Not Found",
    "Status": re.search(status_re, transcript_text).group(1).strip()
}

print(personal_details)