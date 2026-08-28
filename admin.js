import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLuoBvGkURALl_MbKIyGBFNsYyMikz3KQ",
  authDomain: "boardgame-form.firebaseapp.com",
  projectId: "boardgame-form",
  storageBucket: "boardgame-form.firebasestorage.app",
  messagingSenderId: "345074018243",
  appId: "1:345074018243:web:051075a9b7e06c798a3f76",
  measurementId: "G-6ZKEZB36VR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 글로벌 데이터 저장용
let applicantsData = [];

// 로그인 확인
document.getElementById('btn-login').addEventListener('click', async () => {
    const pw = document.getElementById('admin-pw').value;
    const errorMsg = document.getElementById('login-error');
    const loginBtn = document.getElementById('btn-login');

    if (pw === '00347') {
        errorMsg.style.display = 'none';
        loginBtn.innerText = '데이터 불러오는 중... ⏳';
        loginBtn.disabled = true;

        try {
            await fetchData();
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-dashboard').style.display = 'block';
        } catch (e) {
            loginBtn.innerText = '접속하기';
            loginBtn.disabled = false;
        }
    } else {
        errorMsg.style.display = 'block';
    }
});

// 엔터키로 로그인
document.getElementById('admin-pw').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('btn-login').click();
    }
});

// Firestore에서 데이터 불러오기
async function fetchData() {
    try {
        const q = query(collection(db, "applications"), orderBy("submitted_at", "desc"));
        const querySnapshot = await getDocs(q);
        
        applicantsData = [];
        querySnapshot.forEach((doc) => {
            applicantsData.push({ id: doc.id, ...doc.data() });
        });

        renderTable();
    } catch (error) {
        console.error("Error getting documents: ", error);
        alert('데이터를 불러오는데 실패했습니다. (파이어베이스 권한 설정 등을 확인해주세요.)');
        throw error;
    }
}

// 테이블에 데이터 렌더링
function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    document.getElementById('total-count').innerText = `(총 ${applicantsData.length}명)`;

    applicantsData.forEach((data, index) => {
        const tr = document.createElement('tr');
        
        // 날짜 포맷 (예: 2024-05-12 14:30)
        const dateObj = new Date(data.submitted_at);
        const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td style="font-weight: bold;">${data.name}</td>
            <td>${data.age} / ${data.gender}</td>
            <td>${data.school_info}<br><span style="font-size: 0.9em; color: gray;">(${data.status})</span></td>
            <td>${Array.isArray(data.interested_activities) ? data.interested_activities.join(', ') : data.interested_activities}</td>
            <td>${data.boardgame_exp}</td>
            <td>${Array.isArray(data.available_days) ? data.available_days.join(', ') : data.available_days}</td>
            <td><button class="btn-small" data-index="${index}">보기</button></td>
        `;
        tbody.appendChild(tr);
    });

    // 상세보기 버튼 이벤트 리스너 추가
    document.querySelectorAll('.btn-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            openModal(applicantsData[index]);
        });
    });
}

// 모달 열기
function openModal(data) {
    document.getElementById('modal-name').innerText = `${data.name} 님의 상세정보`;
    document.getElementById('modal-escaperoom').innerText = data.escaperoom_exp;
    document.getElementById('modal-favorite').innerText = data.favorite_games;
    document.getElementById('modal-attendance').innerText = data.attendance_possible;
    document.getElementById('modal-times').innerText = Array.isArray(data.available_times) ? data.available_times.join(', ') : data.available_times;
    document.getElementById('modal-motivation').innerText = data.motivation;

    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('detail-modal').style.display = 'block';
}

// 모달 닫기
document.querySelector('.btn-close-modal').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('detail-modal').style.display = 'none';
}
