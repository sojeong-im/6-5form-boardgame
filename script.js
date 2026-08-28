import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// TODO: 파이어베이스 설정값을 여기에 붙여넣으세요! (Firebase Console > Project Settings)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 퀘스트 정답 확인 로직
function checkQuest() {
    const q1Options = document.getElementsByName('q1');
    let q1Answer = '';
    for (const option of q1Options) {
        if (option.checked) {
            q1Answer = option.value;
            break;
        }
    }

    const q2Answer = document.querySelector('input[name="q2"]').value.trim();
    const errorMsg = document.getElementById('quest-error');

    // 정답 체크 (Q1: 25, Q2: 10)
    if (q1Answer === '25' && q2Answer === '10') {
        errorMsg.style.display = 'none';
        
        document.getElementById('section-quest').style.display = 'none';
        document.querySelector('.header').style.marginBottom = '10px';
        document.querySelector('.poster-img').style.maxWidth = '50%';

        const sections = ['quest-success', 'section-basic', 'section-reg', 'section-avail', 'section-final'];
        sections.forEach((id, index) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                el.style.display = 'block';
            }, index * 200);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
        errorMsg.style.display = 'block';
        const questCard = document.getElementById('section-quest');
        questCard.animate([
            { transform: 'translateX(0px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(-10px)' },
            { transform: 'translateX(10px)' },
            { transform: 'translateX(0px)' }
        ], {
            duration: 400,
            iterations: 1
        });
    }
}

// 폼 제출 로직 (파이어베이스 연동)
async function submitForm(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지
    
    // 버튼 비활성화 (중복 제출 방지)
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerText = '제출 중... ⏳';

    try {
        const formData = new FormData(event.target);
        
        // 체크박스는 여러 개 선택될 수 있으므로 배열로 처리
        const interestedActivities = formData.getAll('q8');
        const availableDays = formData.getAll('q12');
        const availableTimes = formData.getAll('q13');

        // Firestore에 저장할 데이터 객체 생성
        const applicationData = {
            name: formData.get('q3'),
            age: formData.get('q4'),
            gender: formData.get('q5'),
            school_info: formData.get('q6'),
            status: formData.get('q7'),
            interested_activities: interestedActivities,
            boardgame_exp: formData.get('q9'),
            favorite_games: formData.get('q10'),
            escaperoom_exp: formData.get('q11'),
            available_days: availableDays,
            available_times: availableTimes,
            attendance_possible: formData.get('q14'),
            motivation: formData.get('q15'),
            submitted_at: new Date().toISOString()
        };

        // 데이터베이스에 추가
        // 주의: 파이어베이스 설정이 안 되어있으면 여기서 에러가 발생합니다.
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            alert('⚠️ 아직 파이어베이스 설정이 완료되지 않았습니다! (script.js의 firebaseConfig를 확인해주세요)');
            submitBtn.disabled = false;
            submitBtn.innerText = '지원서 제출하기 🚀';
            return;
        }

        await addDoc(collection(db, "applications"), applicationData);

        alert('🎉 보겜대학 3기 지원이 성공적으로 완료되었습니다!\n(데이터베이스 저장 완료)');
        
        // 제출 후 폼 초기화 및 상단으로 이동
        event.target.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error("Error adding document: ", error);
        alert('❌ 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = '지원서 제출하기 🚀';
    }
}

// 이벤트 리스너 등록
document.getElementById('btn-check-quest').addEventListener('click', checkQuest);
document.getElementById('application-form').addEventListener('submit', submitForm);
