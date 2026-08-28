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

    // 정답 체크 (Q1: 25, Q2: 9)
    if (q1Answer === '25' && q2Answer === '9') {
        // 정답일 경우
        errorMsg.style.display = 'none';
        
        // 퀘스트 섹션 숨기기 및 헤더 이미지 축소
        document.getElementById('section-quest').style.display = 'none';
        document.querySelector('.header').style.marginBottom = '10px';
        document.querySelector('.poster-img').style.maxWidth = '50%';

        // 성공 메시지 및 나머지 폼 섹션 보여주기
        const sections = ['quest-success', 'section-basic', 'section-reg', 'section-avail', 'section-final'];
        sections.forEach((id, index) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                el.style.display = 'block';
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, index * 200); // 순차적으로 나타나는 효과
        });

    } else {
        // 오답일 경우
        errorMsg.style.display = 'block';
        // 흔들림 효과 추가
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

function submitForm(event) {
    event.preventDefault();
    alert('🎉 보겜대학 3기 지원이 완료되었습니다! 결과는 추후 개별 안내됩니다.');
    // 실제 폼 전송 로직은 여기에 추가
    // document.getElementById('application-form').submit();
    return false;
}
