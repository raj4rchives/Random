let syllabusData = {
    Physics: [],
    Chemistry: [],
    Mathematics: []
};

function init() {
    const saved = localStorage.getItem('jee_master_syllabus_tracker_empty_v1');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                syllabusData.Physics = parsed.Physics || [];
                syllabusData.Chemistry = parsed.Chemistry || [];
                syllabusData.Mathematics = parsed.Mathematics || [];
            }
        } catch (e) {
            console.error("Error loading local storage data", e);
        }
    }
    renderAllTables();
}

function saveToLocalStorage() {
    localStorage.setItem('jee_master_syllabus_tracker_empty_v1', JSON.stringify(syllabusData));
}

function renderTableFor(subjectKey, tbodyId) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
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
    saveToLocalStorage();
}

function addChapter() {
    const subject = document.getElementById('subjectSelect').value;
    const nameInput = document.getElementById('chapNameInput');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Kripya Chapter Name fill karein!');
        return;
    }

    if (!syllabusData[subject]) {
        syllabusData[subject] = [];
    }
    
    syllabusData[subject].push({ name: name });
    nameInput.value = '';
    renderAllTables();
}

function deleteChapter(subject, index) {
    if (syllabusData[subject]) {
        syllabusData[subject].splice(index, 1);
        renderAllTables();
    }
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
                syllabusData.Physics = parsed.Physics || [];
                syllabusData.Chemistry = parsed.Chemistry || [];
                syllabusData.Mathematics = parsed.Mathematics || [];
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

    const tables = element.querySelectorAll('table.tracker-table');
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        if (rows.length > 20) {
            const theadHTML = table.querySelector('thead').outerHTML;
            const colgroupHTML = table.querySelector('colgroup').outerHTML;
            const parentPage = table.closest('.subject-page');
            const headerRowHTML = parentPage.querySelector('.pdf-header-row').outerHTML;
            
            parentPage.innerHTML = '';

            const chunkSize = 20;
            for (let i = 0; i < rows.length; i += chunkSize) {
                const chunkRows = rows.slice(i, i + chunkSize);
                
                const pageSection = document.createElement('div');
                pageSection.className = 'subject-page';
                if (i > 0) pageSection.style.pageBreakBefore = 'always';

                let chunkHtml = headerRowHTML + `
                    <table class="tracker-table">
                        ${colgroupHTML}
                        ${theadHTML}
                        <tbody>
                `;
                chunkRows.forEach(row => {
                    chunkHtml += row.outerHTML;
                });
                chunkHtml += `</tbody></table>`;
                
                pageSection.innerHTML = chunkHtml;
                parentPage.appendChild(pageSection);
            }
        }
    });

    const opt = {
        margin:       [0.2, 0.2, 0.2, 0.2],
        filename:     'JEE_Complete_Syllabus_Tracker.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        deleteBtns.forEach(btn => btn.style.display = '');
        renderAllTables();
    });
}

window.onload = init;
