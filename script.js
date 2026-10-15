const defaultPhysics = [
    "Basic Maths", "Motion in straight line", "Motion in plane", "Newton Law's of Motion",
    "Circular motion", "Work energy power", "Centre of mass", "Rotational motion",
    "Mechanical properties of solid", "Mechanical properties of fluids", "Thermal properties of matter",
    "Ktg and thermodynamics", "Simple harmonic motion", "Waves", "Electric charges and field",
    "Electrostatic potential capacitance", "Current Electricity", "Moving charges and Magnetism",
    "Electromagnetic induction", "Gravitation", "Alt current", "Ray OPTICS", "Electromagnetic waves",
    "Wave optics", "Modern phy", "Unit and measurement", "Semiconductor"
];

let syllabusData = {
    Physics: defaultPhysics.map(name => ({ name })),
    Chemistry: [],
    Mathematics: []
};

function init() {
    const saved = localStorage.getItem('jee_all_subjects_tracker_v7');
    if (saved) {
        try {
            syllabusData = JSON.parse(saved);
        } catch (e) {}
    }
    renderAllTables();
}

function renderTableFor(subjectKey, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    const list = syllabusData[subjectKey] || [];
    let html = '';
    list.forEach((item, index) => {
        html += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td class="chap-cell">${item.name}</td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td><span class="box-tick"></span></td>
                <td class="btn-delete-row"><button type="button" class="btn-delete-row" onclick="deleteChapter('${subjectKey}', ${index})">✕</button></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderAllTables() {
    renderTableFor('Physics', 'physicsTableBody');
    renderTableFor('Chemistry', 'chemistryTableBody');
    renderTableFor('Mathematics', 'mathematicsTableBody');
    localStorage.setItem('jee_all_subjects_tracker_v7', JSON.stringify(syllabusData));
}

function addChapter() {
    const subject = document.getElementById('subjectSelect').value;
    const name = document.getElementById('chapNameInput').value.trim();

    if (!name) {
        alert('Kripya Chapter Name fill karein!');
        return;
    }

    if (!syllabusData[subject]) syllabusData[subject] = [];
    syllabusData[subject].push({ name: name });

    document.getElementById('chapNameInput').value = '';
    renderAllTables();
}

function deleteChapter(subject, index) {
    syllabusData[subject].splice(index, 1);
    renderAllTables();
}

function clearAll() {
    if (confirm('Kya aap saare subjects ka data clear karna chahte hain?')) {
        syllabusData = { Physics: [], Chemistry: [], Mathematics: [] };
        renderAllTables();
    }
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(syllabusData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "jee_all_subjects_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed.Physics || parsed.Chemistry || parsed.Mathematics) {
                syllabusData = parsed;
            } else if (Array.isArray(parsed)) {
                syllabusData.Physics = parsed.map(i => ({ name: i.name || i }));
            }
            renderAllTables();
            alert('Data successfully import ho gaya hai!');
        } catch (err) {
            alert('File read karne mein error aayi hai.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function downloadPDF() {
    const element = document.getElementById('pdf-render-area');
    const deleteBtns = document.querySelectorAll('.btn-delete-row');
    deleteBtns.forEach(btn => btn.style.display = 'none');

    const opt = {
        margin:       [0.2, 0.2, 0.2, 0.2],
        filename:     'JEE_Complete_Syllabus_Tracker.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        deleteBtns.forEach(btn => btn.style.display = '');
    });
}

window.onload = init;
