function showSection(id){
    document.querySelectorAll('section').forEach(function(sec){
        sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('nav button').forEach(function(btn){
        btn.classList.remove('active');
    });
    if (typeof event !== 'undefined' && event && event.target){
    event.target.classList.add('active');
    }
}
function addClass(){
    const subject = document.getElementById('classSubject').value;
    const day = document.getElementById('classDay').value;
    const time = document.getElementById('classTime').value;
    if (subject === ''){
        alert('Please enter a subject');
        return;
    }
    fetch('/api/classes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({subject: subject, day: day, time: time })
    })
    .then(res => {
        if(res.status === 401) {
            alert("Please login first!");
            return;
        }
        return res.json();
})
    .then(() => {
    document.getElementById('timetableList').innerHTML = '';
    document.getElementById('classSubject').value = '';
    document.getElementById('classDay').value = '';
    document.getElementById('classTime').value = '';
    loadClasses();
});
}
function loadClasses(){
    fetch('api/classes')
    .then(res => {
        if(res.status === 401) {
            return [];
        }
        return res.json();
})
    .then(items => {
        items.forEach(function(item){
            const row = document.createElement('tr');
            row.innerHTML = '<td>' + item.subject + '</td><td>' + item.day + '</td><td>' + item.time + '</td><td><button onclick="deleteClass(this)" data-id="' + item.id + '">x</button></td>';
            document.getElementById('timetableList').appendChild(row);
        });
});
}
function deleteClass(btn){
    const id = btn.getAttribute('data-id');
    fetch('/api/classes/' + id,{method: 'DELETE'})
    .then(res => res.json())
    .then(() => {
        document.getElementById('timetableList').innerHTML = '';
        loadClasses();
        updateDashboard();
});
}
function addAssignment(){
    const name = document.getElementById('assignmentName').value;
    const due = document.getElementById('assignmentDue').value;
    if (name === ''){
        alert('Please enter assignment name');
        return;
    }
    fetch('api/assignments',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, due: due })
    })
    .then(res => {
        if(res.status === 401) {
            alert("Please login first!");
            return;
        }
        return res.json();
})
    .then(() => {
        document.getElementById('assignmentList').innerHTML='';
        document.getElementById('assignmentName').value = '';
        document.getElementById('assignmentDue').value = '';
        loadAssignments();
    });
}
function toggleStatus(cell){
    const id = cell.getAttribute('data-id');
    const newStatus = cell.textContent === 'Pending' ? 'Done' : 'Pending';
    fetch('/api/assignments/' + id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: newStatus})
    })
    .then(res => res.json())
    .then(() => {
        document.getElementById('assignmentList').innerHTML = '';
        loadAssignments();
        updateDashboard();
    });
}
function loadAssignments(){
    fetch('api/assignments')
    .then(res => {
        if(res.status === 401) {
            return [];
        }
        return res.json();
})
    .then(items => {
        items.forEach(function(item){
            const row = document.createElement('tr');
            const color = item.status === 'Done' ? 'green' : 'orange';
            row.innerHTML = '<td>' + item.name + '</td><td>' + item.due + '</td><td onclick="toggleStatus(this)" style="cursor:pointer; color:' + color + ';" data-id="' + item.id + '">' + item.status + '</td><td><button onclick="deleteAssignment(this)" data-id="' + item.id + '">x</button></td>';
            document.getElementById('assignmentList').appendChild(row);
        });
        updateDashboard();
});
}
function deleteAssignment(btn){
    const id = btn.getAttribute('data-id');
    fetch('/api/assignments/' + id,{method: 'DELETE'})
    .then(res => res.json())
    .then(() => {
        document.getElementById('assignmentList').innerHTML = '';
        loadAssignments();
        updateDashboard();
    });
}
function addExpense(){
    const name = document.getElementById('expenseName').value;
    const amount = document.getElementById('expenseAmount').value;
    if (name === '' || amount === ''){
        alert('Please enter both name and amount');
        return;
    }
    fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, amount: parseFloat(amount) })
    })
    .then(res => {
        if(res.status === 401) {
            alert("Please login first!");
            return;
        }
        return res.json();
})
    .then(() => {
    document.getElementById('expenseList').innerHTML = '';
    document.getElementById('expenseName').value = '';
    document.getElementById('expenseAmount').value = '';
    loadExpenses();
});
}
function loadExpenses(){
    fetch('api/expenses')
    .then(res => {
        if(res.status === 401) {
            return [];
        }
        return res.json();
})
    .then(items => {
        items.forEach(function(item){
            const row = document.createElement('tr');
            row.innerHTML = '<td>' + item.name + '</td><td>' + item.amount + '</td><td><button onclick="deleteExpense(this)" data-id="' + item.id + '">x</button></td>';
            document.getElementById('expenseList').appendChild(row);
        });
        updateDashboard();
});
}
function deleteExpense(btn){
    const id = btn.getAttribute('data-id');
    fetch('/api/expenses/' + id,{method: 'DELETE'})
    .then(res => res.json())
    .then(() => {
        document.getElementById('expenseList').innerHTML = '';
        loadExpenses();
        updateDashboard();
});
}
function addAttendance(){
    const subject = document.getElementById('attSubject').value;
    const held = parseFloat(document.getElementById('attHeld').value);
    const attended = parseFloat(document.getElementById('attAttended').value);
    if (subject === '' || isNaN(held) || isNaN(attended)){
        alert('Please fill all the details');
        return;
    }
    fetch('/api/attendance', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({subject: subject, held: held, attended: attended})
    })
    .then(res => {
        if(res.status === 401) {
            alert("Please login first!");
            return;
        }
        return res.json();
})
    .then(() => {
    document.getElementById('attendanceList').innerHTML = '';
    document.getElementById('attSubject').value='';
    document.getElementById('attHeld').value='';
    document.getElementById('attAttended').value='';
    loadAttendance();  
});
}
function loadAttendance(){
    fetch('api/attendance')
    .then(res => {
        if(res.status === 401) {
            return [];
        }
        return res.json();
})
    .then(items => {
        items.forEach(function(item){
            const percent = ((item.attended / item.held)*100).toFixed(1);
            const row = document.createElement('tr');
            row.innerHTML = '<td>' + item.subject + '</td><td>' + item.held + '</td><td>' + item.attended + '</td><td>' + percent + '</td><td><button onclick="deleteAttendance(this)" data-id="' + item.id + '">x</button></td>';
            document.getElementById('attendanceList').appendChild(row);
        });
        updateDashboard();
    });
}
function deleteAttendance(btn){
    const id = btn.getAttribute('data-id');
    fetch('/api/attendance/' + id,{method: 'DELETE'})
    .then(res => res.json())
    .then(() => {
        document.getElementById('attendanceList').innerHTML = '';
        loadAttendance();
        updateDashboard();
});
}
function addSubject() {
  const name = document.getElementById('subjectName').value;
  const credit = parseFloat(document.getElementById('subjectCredit').value);
  const grade = parseFloat(document.getElementById('subjectGrade').value);
  if (name === '' || isNaN(credit) || isNaN(grade)) {
    alert('Please fill all fields correctly');
    return;
}
fetch('/api/subjects', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name, credit: credit, grade: grade })
    })
    .then(res => {
        if(res.status === 401) {
            alert("Please login first!");
            return;
        }
        return res.json();
})
    .then(() => {
document.getElementById('subjectList').innerHTML = '';
document.getElementById('subjectName').value = '';
document.getElementById('subjectCredit').value = '';
document.getElementById('subjectGrade').value = '';
loadSubjects();
calculateSGPA();
});
}
function deleteSubject(btn) {
    const id = btn.getAttribute('data-id');
    fetch('/api/subjects/' + id,{method: 'DELETE'})
    .then(res => res.json())
    .then(() => {
        document.getElementById('subjectList').innerHTML = '';
        loadSubjects();
        calculateSGPA();
});
}
function calculateSGPA() {
    const rows = document.querySelectorAll('#subjectList tr');
    let totalCredits = 0;
    let totalPoints = 0;
    rows.forEach(function(row) {
        const cells = row.querySelectorAll('td');
        const credit = parseFloat(cells[1].textContent);
        const grade = parseFloat(cells[2].textContent);
        totalCredits += credit;
        totalPoints += credit * grade;
    });
    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.getElementById('sgpaResult').textContent = 'SGPA: ' + sgpa;
}
function loadSubjects() {
    fetch('api/subjects')
    .then(res => {
        if(res.status === 401) {
            return [];
        }
        return res.json();
})
    .then(items => {
        items.forEach(function(item) {
            const row = document.createElement('tr');
            row.innerHTML = '<td>' + item.name + '</td><td>' + item.credit + '</td><td>' + item.grade + '</td><td><button onclick="deleteSubject(this)" data-id="' + item.id + '">x</button></td>';
            document.getElementById('subjectList').appendChild(row);
        });
        calculateSGPA();
        updateDashboard();
    });
}
function updateDashboard() {
    const assignmentRows = document.querySelectorAll('#assignmentList tr');
    let pendingCount = 0;
    let doneCount = 0;
    assignmentRows.forEach(function(row){
        const cells = row.querySelectorAll('td');
        if (cells.length>=3){
            if (cells[2].textContent === 'Pending') pendingCount++;
            if (cells[2].textContent === 'Done') doneCount++;
        }
    });
    const sgpaText = document.getElementById('sgpaResult') ? document.getElementById('sgpaResult').textContent : 'SGPA: N/A';
    const attRows = document.querySelectorAll('#attendanceList tr');
    let totalPercent = 0;
    let attCount = 0;
    let attendanceNeeds = '';
    attRows.forEach(function(row){
        const cells = row.querySelectorAll('td');
        if (cells.length>=4){
            const subject = cells[0].textContent;
            const held = parseFloat(cells[1].textContent);
            const attended = parseFloat(cells[2].textContent);
            const percent = parseFloat(cells[3].textContent);
            if (!isNaN(percent)){
                totalPercent += percent;
                attCount++;
            }
            if(!isNaN(held) && !isNaN(attended)){
                const target = 0.75;
                const needed = (target*held-attended)/(1-target);
                if (needed>0){
                    attendanceNeeds += '<p>' + subject + ': Attend ' + Math.ceil(needed) + ' consecutive classes to reach 75%</p>';
                }
                else{
                    attendanceNeeds += '<p>' + subject + ': already at/above 75%</p>';
                }
            }
        }
    });
    const avgAttendance = attCount > 0 ? (totalPercent/attCount).toFixed(1) + '%' : 'N/A';

    const expenseRows = document.querySelectorAll('#expenseList tr');
    let totalExpense = 0;
    expenseRows.forEach(function(row){
        const cells = row.querySelectorAll('td');
        if(cells.length>=2){
            const amt =parseFloat(cells[1].textContent.replace('Rs.',''));
            if(!isNaN(amt)) totalExpense += amt;
        }
    });
    document.getElementById('dashboardSummary').innerHTML = 
    '<p><strong>Assignments Pending: </strong>' + pendingCount + '</p>' + 
    '<p><strong>Assignments Done: </strong>' + doneCount + '</p>' +
    '<p><strong>' + sgpaText + '</strong></p>' +
    '<p><strong>Total Expenses: </strong>Rs.' + totalExpense + '</p>' +
    '<p><strong>Average Attendance: </strong>' + avgAttendance + '</p>' 
    + attendanceNeeds;
}
function signup() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch('/api/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('authMessage').textContent = data.message || data.error;
    });
}
function login(){
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password})
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            window.location.reload();
        } else
        {
            document.getElementById('authMessage').textContent = data.error;
        }
    });
}
async function logout(){
    await fetch('/api/logout', {
        method: 'POST'
    });
    alert('Logged out!');
}
loadClasses();
loadAssignments();
loadExpenses();
loadAttendance();
loadSubjects();
updateDashboard();
showSection('dashboard');