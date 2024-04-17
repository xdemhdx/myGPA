'''from flask import Flask, request, jsonify
import PyPDF2
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Read the PDF file
        pdfReader = PyPDF2.PdfReader(file.stream)
        text = ''

        # Extract text from each page
        for page in pdfReader.pages:
            text += page.extract_text() + ' '

        return jsonify({'text': text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)'''


'''from flask import Flask, request, jsonify
import fitz  # PyMuPDF

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Load the PDF file using PyMuPDF
        doc = fitz.open(stream=file.stream, filetype="pdf")
        text = ''

        # Extract text from each page
        for page in doc:
            text += page.get_text()

        # Respond with the extracted text
        return jsonify({'text': text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)'''

from flask import Flask, request, jsonify
import pdfplumber
import io
import json
import re
from itertools import product
import math

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a file is part of the request
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Convert the uploaded file stream to a BytesIO object
        file_stream = io.BytesIO(file.read())
        
        # Use pdfplumber to open and read the PDF file
        with pdfplumber.open(file_stream) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() + '\n'  # Extract text from each page

            '''
            with open('qaf.txt', 'w') as file:
                # Write your text to the file
                file.write(text)
            '''

        print(text)   

        #All Courses
        #all_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z&\s]+(?:\d{1,2}\.\d{2} ){2}[A-Z\d+/-]+\s\d{1,2}\.\d{2}'
        all_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z&\s/-]+(?:\d{1,2}\.\d{2} ){2}[A-Z\d+/-]+\s\d{1,2}\.\d{2}'
        all_courses = []
        all_list = re.findall(all_pattern, text)

        for item in all_list:
            splitted_text = item.split()
            joined_string = ' '.join(splitted_text[:-4])
            adict = {
                "course":joined_string,
                "grade":splitted_text[-2],
                "credit":int(float(splitted_text[-4]))
            }
            all_courses.append(adict)


        formatted_json = json.dumps(all_courses, indent=4, sort_keys=True)
        print("All the Courses with grades and credits:")
        print(formatted_json)



        print("")

        print("Exempted Courses:")



        #Exmeption List
        #exemptions_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z\s&]+ 0\.00 EN\b'
        exemptions_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z\s&/-]+ 0\.00 EN\b'

        exemption_list = re.findall(exemptions_pattern, text)
        exempted_courses = []

        for item in exemption_list:
            splitted_text = item.split()
            joined_string = ' '.join(splitted_text[:-2])
            exempted_courses.append(joined_string)
        print(exempted_courses)
        print(len(exempted_courses))


        print("")

        # Courses that are currently going on (Currently Enrolled)
        #current_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z\s&]+ \d+\.\d+\n'
        current_pattern = r'\b[A-Z]{2,4} \d{4} [A-Za-z\s&/-]+ \d+\.\d+\n'

        current_list = re.findall(current_pattern, text)

        current_courses = []

        print("Current Courses/ Currently Enrolled")

        for item in current_list:
            splitted_text = item.split()
            joined_string = ' '.join(splitted_text[:-1])

            adict = {
                "course":joined_string,
                "credit":int(float(splitted_text[-1]))
            }
            current_courses.append(adict)

        formatted_json = json.dumps(current_courses, indent=4, sort_keys=True)
        print(formatted_json)


        name_re = r"Name: ([\w\s]+) College:"
        student_id_re = r"Student ID: (\d+)"
        dob_re = r"Date of Birth: ([\d/]+)"
        nationality_re = r"Nationality: (\w+)"
        college_re = r"College: (.*?)\n"  
        credential_re = r"Credential: (.*?)\n"  
        major_re = r"Major: ([\w\s]+)\n"  
        status_re = r"Status: ([\w\s]+)Program"

        personal_details = {
            "Name": re.search(name_re, text).group(1).strip(),
            "Student ID": re.search(student_id_re, text).group(1).strip(),
            "Date of Birth": re.search(dob_re, text).group(1).strip(),
            "Nationality": re.search(nationality_re, text).group(1).strip(),
            "College": re.search(college_re, text).group(1).strip(),
            "Credential": re.search(credential_re, text).group(1).strip(),
            "Major": re.search(major_re, text).group(1).strip() if re.search(major_re, text) else "Not Found",
            "Status": re.search(status_re, text).group(1).strip()
        }

        print(personal_details)


        gpa_pattern = r"(Term GPA|Cumulative GPA)\s+([\d\.]+)"

        # Find all matches using the pattern
        gpa_matches = re.findall(gpa_pattern, text)

        # Initialize variables to hold the results
        term_gpas = []
        cumulative_gpas = []

        # Process each match
        for match in gpa_matches:
            if match[0] == "Term GPA":
                term_gpas.append(match[1])
            elif match[0] == "Cumulative GPA":
                cumulative_gpas.append(match[1])

        # Print the results in the requested format
        for i, (term_gpa, cumulative_gpa) in enumerate(zip(term_gpas, cumulative_gpas), start=1):
            print(f"- {i}: Term GPA {term_gpa}, Cumulative GPA {cumulative_gpa}")


        pattern = r'Cumulative Totals \d+\.?\d* (\d+\.?\d*) (\d+\.?\d*)'
        

        # Find all matches and take the last one, since it represents the latest data
        matches = re.findall(pattern, text)
        if matches:
            latest_match = matches[-1]  # Get the last match
            latest_cumulative_totals = float(latest_match[0])
            latest_cumulative_points = float(latest_match[1])
        else:
            latest_cumulative_totals = None
            latest_cumulative_points = None

        print("Latest Cumulative Totals:", latest_cumulative_totals)
        print("Latest Cumulative Points:", latest_cumulative_points)


        pattern = r'(Winter|Spring|Fall) \d{4}$'

        # Find all matches in the transcript text using MULTILINE mode to consider each line separately
        matches = re.findall(pattern, text, re.MULTILINE)

        # Extract the last semester mentioned if the list of matches is not empty
        current_semester = matches[-1] if matches else None
        

            

        all_data = {"completed_courses":all_courses,
                    "personal_details":personal_details,
                    "current_courses":current_courses,
                    "term_gpas":term_gpas,
                    "cumulative_gpas":cumulative_gpas,
                    "exempted_courses":exempted_courses,
                    "cumulative_total":latest_cumulative_totals,
                    "cumulative_points":latest_cumulative_points,
                    "current_semester":current_semester}

        print(all_data)




       
                
        # Respond with the extracted text
        return jsonify({'Processed Data': all_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/recommendedlist', methods=['POST'])
def receive_data():
    data = request.get_json()
    print(data)
    
    infs = {1:[{1:[{"course":"COMM 1010 English Communication I","pre-req":[],"credit":"3","category":"english"},
                   {"course":"INFS 1101 Intro to Computing & Problem Solving","pre-req":[],"credit":"3","category":"coding"},
                   {"course":"MATH 1020 Pre-Calculus","pre-req":[],"credit":"3","category":"math"},
                   {"course":"EFFL 1001 Effective Learning","pre-req":[],"credit":"3","category":"general"}
                ],
                2:[{"course":"COMM 1020 English Communication II","pre-req":["COMM 1010"],"credit":"3","category":"english"},
                   {"course":"INFS 1201 Computer Programming","pre-req":["INFS 1101"],"credit":"4","category":"coding"},
                   {"course":"INFT 1201 Computer Hardware","pre-req":[],"credit":"4","category":"hardware"},
                   {"course":"MATH 1030 Calculus I","pre-req":["MATH 1020"],"credit":"3","category":"math"}
                ],
                3:[{"course":"INFS 1301 Computing Ethics & Society","pre-req":[],"credit":"3","category":"general"},
                   {"course":"SCIE 1002 Science & the Environment","pre-req":[],"credit":"3","category":"general"}
                ]}],
            2:[{1:[{"course":"INFS 2101 Web Technologies I","pre-req":["INFS 1201"],"credit":"3","category":"development"},
                   {"course":"INFT 2101 Networking I","pre-req":["INFT 1201"],"credit":"4","category":"hardware"},
                   {"course":"INFT 2102 Mathematics for IT","pre-req":["INFS 1101"],"credit":"3","category":"math"},
                   {"course":"MATH 1040 Statistics","pre-req":[],"credit":"3","category":"math"}
                ],
                2:[{"course":"DACS 2201 Introduction to Data & Cyber Security","pre-req":["INFT 2101"],"credit":"3","category":"cybersecurity"},
                   {"course":"DSAI 2201 Introduction to Data Science & AI","pre-req":["INFS 1201"],"credit":"3","category":"coding"},
                   {"course":"INFS 2201 Database Management Systems","pre-req":["INFS 1101"],"credit":"3","category":"database"},
                   {"course":"INFT 2202 Linux Foundations","pre-req":["INFT 1201"],"credit":"3","category":"linux"}
                ],
                3:[{"course":"BUSG 2002 Project Management","pre-req":[],"credit":"3","category":"general"},
                   {"course":"SSHA 1003 Introductory Psychology","pre-req":[],"credit":"3","category":"general"}
                ]}],
            3:[{1:[{"course":"INFS 3102 Object Oriented Programming","pre-req":["INFS 1201"],"credit":"3","category":"coding"},
                   {"course":"INFS 3103 Systems Analysis & Design","pre-req":["INFS 2201"],"credit":"3","category":"general"},
                   {"course":"INFS 3104 Data Structures and Algorithms ","pre-req":["INFS 1201","INFT 2102"],"credit":"3","category":"coding"},
                   {"course":"ECON 1001 Global Economic Concepts","pre-req":[],"credit":"3","category":"general"}
                ],
                2:[{"course":"INFS 3201 Web Technologies II","pre-req":["INFS 2101"],"credit":"3","category":"development"},
                   {"course":"INFS 3202 IT Systems Integration","pre-req":["INFS 3103"],"credit":"3","category":"coding"},
                   {"course":"INFS 3203 Systems Deployment & Implementation","pre-req":["INFS 3103"],"credit":"3","category":"coding"},
                   {"course":"INFT 3203 Web Server Management ","pre-req":["INFS 2101","INFT 2202"],"credit":"3","category":"linux"}
                ],
                3:[{"course":"INFS 3301 Human Computer Interaction","pre-req":["INFS 1201"],"credit":"3","category":"ui"},
                   {"course":"GARC 1001 Qatar History & Society","pre-req":[],"credit":"3","category":"general"}
                ]}],
            4:[{1:[{"course":"COMP 4101 Practicum","pre-req":[],"credit":"3","category":"english"},
                   {"course":"INFS 4202 Software Testing & Quality Assurance","pre-req":["INFS 3103"],"credit":"3","category":"general"},
                   {"course":"INFS 4104 Mobile App Technologies","pre-req":["INFS 3201"],"credit":"3","category":"development"},
                   {"course":"DACS 4102 Web Security","pre-req":["INFS 3201"],"credit":"3","category":"cybersecurity"}
                ],
                2:[{"course":"COMP 4201 Capstone Project","pre-req":["COMP 4101"],"credit":"3","category":"coding"},
                   {"course":"INFS 4101 IS Management & Strategy","pre-req":["INFS 3103"],"credit":"3","category":"general"},
                   {"course":"INFS 4103 UI/UX Design","pre-req":["INFS 3201"],"credit":"3","category":"ui"},
                   {"course":"INFS 4205 Selected Topics in Information Systems","pre-req":["INFS 4104"],"credit":"3","category":"general"}
                ],
                3:[{"course":"COMP 4301 Work Placement ","pre-req":["COMP 4201"],"credit":"9","category":"internship"}]
                }]}
    
    
    inft = {1:[{1:[{"course":"COMM 1010 English Communication I","pre-req":[],"credit":"3","category":"english"},
                   {"course":"INFS 1101 Intro to Computing & Problem Solving","pre-req":[],"credit":"3","category":"coding"},
                   {"course":"MATH 1020 Pre-Calculus","pre-req":[],"credit":"3","category":"math"},
                   {"course":"EFFL 1001 Effective Learning","pre-req":[],"credit":"3","category":"general"}
                ],
                2:[{"course":"COMM 1020 English Communication II","pre-req":["COMM 1010"],"credit":"3","category":"english"},
                   {"course":"INFS 1201 Computer Programming","pre-req":["INFS 1101"],"credit":"4","category":"coding"},
                   {"course":"INFT 1201 Computer Hardware","pre-req":[],"credit":"4","category":"hardware"},
                   {"course":"MATH 1030 Calculus I","pre-req":["MATH 1020"],"credit":"3","category":"math"}
                ],
                3:[{"course":"INFS 1301 Computing Ethics & Society","pre-req":[],"credit":"3","category":"general"},
                   {"course":"SCIE 1002 Science & the Environment","pre-req":[],"credit":"3","category":"general"}
                ]}],
            2:[{1:[{"course":"INFS 2101 Web Technologies I","pre-req":["INFS 1201"],"credit":"3","category":"development"},
                   {"course":"INFT 2101 Networking I","pre-req":["INFT 1201"],"credit":"4","category":"hardware"},
                   {"course":"INFT 2102 Mathematics for IT","pre-req":["INFS 1101"],"credit":"3","category":"math"},
                   {"course":"MATH 1040 Statistics","pre-req":[],"credit":"3","category":"math"}
                ],
                2:[{"course":"DACS 2201 Introduction to Data & Cyber Security","pre-req":["INFT 2101"],"credit":"3","category":"cybersecurity"},
                   {"course":"DSAI 2201 Introduction to Data Science & AI","pre-req":["INFS 1201"],"credit":"3","category":"coding"},
                   {"course":"INFS 2201 Database Management Systems","pre-req":["INFS 1101"],"credit":"3","category":"database"},
                   {"course":"INFT 2202 Linux Foundations","pre-req":["INFT 1201"],"credit":"3","category":"linux"}
                ],
                3:[{"course":"BUSG 2002 Project Management","pre-req":[],"credit":"3","category":"general"},
                   {"course":"SSHA 1003 Introductory Psychology","pre-req":[],"credit":"3","category":"general"}
                ]}],
            3:[{1:[{"course":"DSAI 4104 Fundamentals of IoT","pre-req":["INFT 2101"],"credit":"3","category":"ai"},
                   {"course":"INFT 3101 Networking II","pre-req":["INFT 2101"],"credit":"3","category":"hardware"},
                   {"course":"INFT 3102	Network Programming","pre-req":["INFS 1201","INFT 2202"],"credit":"3","category":"coding"},
                   {"course":"ECON 1001 Global Economic Concepts","pre-req":[],"credit":"3","category":"general"}
                ],
                2:[{"course":"DACS 3201	Network Security","pre-req":["INFT 3101"],"credit":"3","category":"cybersecurity"},
                   {"course":"INFT 3201	System Integration & Administration","pre-req":["INFT 1201","INFT 2202"],"credit":"3","category":"coding"},
                   {"course":"INFT 3202	Cloud Computing","pre-req":["INFT 2101","INFT 2202"],"credit":"3","category":""},
                   {"course":"INFT 3203 Web Server Management ","pre-req":["INFS 2101","INFT 2202"],"credit":"3","category":"linux"}
                ],
                3:[{"course":"INFT 3301	IT Service Management","pre-req":[],"credit":"3","category":"general"},
                   {"course":"GARC 1001 Qatar History & Society","pre-req":[],"credit":"3","category":"general"}
                ]}],
            4:[{1:[{"course":"COMP 4101 Practicum","pre-req":[],"credit":"3","category":"english"},
                   {"course":"INFT 4105	Wireless Networks","pre-req":["INFT 3101"],"credit":"3","category":"hardware"},
                   {"course":"INFT 4107	Virtualization Technologies","pre-req":["INFT 3101","INFT 3102","INFT 3202"],"credit":"3","category":""},
                   {"course":"DSAI 4106	Embedded Systems & IoT","pre-req":["INFT 2101"],"credit":"3","category":"ai"}
                ],
                2:[{"course":"COMP 4201 Capstone Project","pre-req":["COMP 4101"],"credit":"3","category":"coding"},
                   {"course":"INFT 4203	Network Management","pre-req":["INFT 3101"],"credit":"3","category":"hardware"},
                   {"course":"DACS 4204	Cloud Security","pre-req":["DACS 3201"],"credit":"3","category":"cybersecurity"},
                   {"course":"INFT 4208	Governance & Management of IT","pre-req":["INFT 3101"],"credit":"3","category":"general"}
                ],
                3:[{"course":"COMP 4301 Work Placement ","pre-req":["COMP 4201"],"credit":"9","category":"internship"}]
                }]}

    program = data['Processed Data']['personal_details']['Major']

    if program == "Information Systems":
        plan = infs
    elif program == "Information Technology":
        plan = inft
    # elif program == "Data and Cyber Security":
    #     plan = dacs
    # elif program == "Data Science and Artificial Intelligence":
    #     plan = dsai

    exempted_courses = data['Processed Data']['exempted_courses']
    completed_courses = data['Processed Data']['completed_courses']
    current_courses = {"data": data['Processed Data']['data']}
    
    for i in completed_courses: print(i)
    print()
    for i in current_courses["data"]: print(i)
    print()

    grade_scheme = {'A':4, 'B+':3.5, 'B':3, 'C+':2.5, 'C':2, 'D+':1.5, 'D':1, 'F':0}

    recommended_list = []
    total_gps = 0
    total_crs = 0
    target_CGPA = 3.24

    categories = {}
    categories_count = {}
    categories_avg = {}

    for a in range(1, len(plan)+1):
        for b in range(1, len(plan[a][0])+1):
            for c in range(len(plan[a][0][b])):
                    append_to_list = True
                    for x in exempted_courses:
                        if ' '.join(plan[a][0][b][c]["course"].split()[:2]) == ' '.join(x.split()[:2]):
                            append_to_list = False
                            break

                    for y in completed_courses:
                        if ' '.join(plan[a][0][b][c]["course"].split()[:2]) == ' '.join(y["course"].split()[:2]):
                            if plan[a][0][b][c]["category"] in categories:    
                                categories[plan[a][0][b][c]["category"]]+=grade_scheme[y["grade"]]
                                categories_count[plan[a][0][b][c]["category"]]+=1
                            else:
                                categories[plan[a][0][b][c]["category"]]=grade_scheme[y["grade"]]
                                categories_count[plan[a][0][b][c]["category"]]=1
                            total_gps+=grade_scheme[y["grade"]] * int(plan[a][0][b][c]["credit"])
                            total_crs+=int(plan[a][0][b][c]["credit"])
                            append_to_list = False
                            break

                    for z in current_courses["data"]:
                        if ' '.join(plan[a][0][b][c]["course"].split()[:2]) == ' '.join(z["course"].split()[:2]):
                            if plan[a][0][b][c]["category"] in categories:    
                                categories[plan[a][0][b][c]["category"]]+=grade_scheme[z["grade"]]
                                categories_count[plan[a][0][b][c]["category"]]+=1
                            else:
                                categories[plan[a][0][b][c]["category"]]=grade_scheme[z["grade"]]
                                categories_count[plan[a][0][b][c]["category"]]=1
                            total_gps+=grade_scheme[z["grade"]] * int(plan[a][0][b][c]["credit"])
                            total_crs+=int(plan[a][0][b][c]["credit"])
                            append_to_list = False
                            break
                    
                    if append_to_list and len(recommended_list)<4:
                        found = False
                        for course in recommended_list:
                            for pr in plan[a][0][b][c]["pre-req"]:
                                if pr == ' '.join(course["course"].split()[:2]):
                                    found = True
                                    break
                            if found:
                                break

                        if found:
                            continue

                        elif ' '.join(plan[a][0][b][c]["course"].split()[:2]) == "COMP 4301" and len(recommended_list) >= 0:
                            continue

                        else:
                            recommended_list.append(plan[a][0][b][c])

    


    print("categories:\n", categories)
    print("categories_count:\n", categories_count)

    for k, v in categories.items():
        categories_avg[k]=math.ceil((v/categories_count[k]) * 2) / 2

    print("categories_avg:\n", categories_avg)

    print()

    max_gps = total_gps
    max_crs = total_crs

    for c in recommended_list:
        max_gps+=4*int(c["credit"])
        max_crs+=int(c["credit"])

    firstpart = {}
    firstpart["recommended_list"] = recommended_list
    firstpart["total_gps"] = total_gps
    firstpart["total_crs"] = total_crs
    firstpart["current_cgpa"] = round((total_gps/total_crs), 2)
    firstpart["max_cgpa"] = round((max_gps/max_crs), 2)
    firstpart["categories_avg"] = categories_avg
    # print("The following is the first part")
    # print(firstpart)

    return jsonify(firstpart), 200
    

@app.route('/possiblecombinations', methods=['POST'])
def possible_combinations():
    data = request.get_json()
    for item in data:
        print(item)
    print('total gps:',data["firstPart"]["total_gps"])
    

    
    print('total crs:', data["firstPart"]["total_crs"])
    print("current_CGPA:", data["firstPart"]["current_cgpa"])
    print("target_CGPA:", data["target_cgpa"])

    target_CGPA = data["target_cgpa"]
    recommended_list = data["firstPart"]["recommended_list"]
    total_crs = data["firstPart"]["total_crs"]
    categories_avg = data["firstPart"]["categories_avg"]
    total_gps = data["firstPart"]["total_gps"]

    grade_scheme = {'A':4, 'B+':3.5, 'B':3, 'C+':2.5, 'C':2, 'D+':1.5, 'D':1, 'F':0}
    print()

    for c in recommended_list:
        print(c)

    print()

    # Generate all possible grade combinations
    grades = list(grade_scheme.keys())
    grade_combinations = product(grades, repeat=len(recommended_list))
    counter = 0
    possible_combinations = []

    # Check each combination if it meets the target GPA and minimum grades for each group
    for combination in grade_combinations:
        grade_points = total_gps
        credits = total_crs
        for i, course in enumerate(recommended_list):
            grade = combination[i]
            if grade != 'F':  # If the grade is F, no grade points will be added
                grade_points += grade_scheme[grade] * int(course['credit'])
            credits += int(course['credit'])
        gpa = round((grade_points/credits), 2)
        
        # Check if the GPA meets the target and minimum grades for each group
        if gpa == target_CGPA:
            counter+=1
            print(counter)
            print("Grade Combination:")
            print(combination)
            possible_combinations.append(list(combination))
            print("GPA:", gpa)
            
    print()

    possible_combinations2 = []

    for grades in possible_combinations:
        combination = []
        for course, grade in zip(recommended_list, grades):
            course_with_grade = course.copy()
            course_with_grade["target_grade"] = grade
            combination.append(course_with_grade)
        possible_combinations2.append(combination)

    for pc in possible_combinations2: #print(pc)
        for c in pc:
            print(c)
        print()

    possible_combinations3 = []

    for pc in possible_combinations2:
        append = True
        for c in pc:
            if grade_scheme[c["target_grade"]] > categories_avg[c["category"]]:
                append = False
                break

        if append:
            possible_combinations3.append(pc)
        
    print()
    print("After removing outliers\n")

    for pc in possible_combinations3:
        for c in pc:
            print(c)
        print()

    if not possible_combinations3:
        return jsonify(possible_combinations2)
    else:
        return jsonify(possible_combinations3)



def round_grade_value(gv):
    if 0 <= gv <= 1:
        return 0
    elif 1 < gv <= 1.25:
        return 1
    elif 1.25 < gv <= 1.75:
        return 1.5
    elif 1.75 < gv <= 2.25:
        return 2
    elif 2.25 < gv <= 2.75:
        return 2.5
    elif 2.75 < gv <= 3.25:
        return 3
    elif 3.25 < gv <= 3.75:
        return 3.5
    elif 3.75 < gv <= 4:
        return 4

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)


