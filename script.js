const defaultPhysics = [
    { name: "Basic Maths", total: 7 }, { name: "Motion in straight line", total: 8 },
    { name: "Motion in plane", total: 7 }, { name: "Newton Law's of Motion", total: 11 },
    { name: "Circular motion", total: 5 }, { name: "Work energy power", total: 6 },
    { name: "Centre of mass", total: 11 }, { name: "Rotational motion", total: 15 },
    { name: "Mechanical properties of solid", total: 1 }, { name: "Mechanical properties of fluids", total: 7 },
    { name: "Thermal properties of matter", total: 5 }, { name: "Ktg and thermodynamics", total: 6 },
    { name: "Simple harmonic motion", total: 5 }, { name: "Waves", total: 8 },
    { name: "Electric charges and field", total: 9 }, { name: "Electrostatic potential capacitance", total: 8 },
    { name: "Current Electricity", total: 7 }, { name: "Moving charges and Magnetism", total: 7 },
    { name: "Electromagnetic induction", total: 6 }, { name: "Gravitation", total: 5 },
    { name: "Alt current", total: 4 }, { name: "Ray OPTICS", total: 10 },
    { name: "Electromagnetic waves", total: 2 }, { name: "Wave optics", total: 5 },
    { name: "Modern phy", total: 10 }, { name: "Unit and measurement", total: 2 }, { name: "Semiconductor", total: 5 }
];

let syllabusData = {
    Physics: [...defaultPhysics],
    Chemistry: [],
    Mathematics: []
};

function init() {
    const saved = localStorage.getItem('jee_all_subjects_tracker_v6');
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
                <td><strong>${item.total}</strong></td>
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
    localStorage.setItem('jee_all_subjects_tracker_v6', JSON.stringify(syllabusData));
}

function addChapter() {
    const subject = document.getElementById('subjectSelect').value;
    const name = document.getElementById('chapNameInput').value.trim();
    const total = document.getElementById('totLecInput').value.trim();

    if (!name || !total) {
        alert('Kripya Chapter Name aur Total Lectures dono fill karein!');
        return;
    }

    if (!syllabusData[subject]) syllabusData[subject] = [];
    syllabusData[subject].push({ name: name, total: total });

    document.getElementById('chapNameInput').value = '';
    document.getElementById('totLecInput').value = '';
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
                syllabusData.Physics = parsed;
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
