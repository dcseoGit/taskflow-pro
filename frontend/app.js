const API_BASE = 'http://localhost:8000';

// 단일 진실 공급원
let tasks = [];
let editingId = null;

// ── API ────────────────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: '서버 오류' }));
    throw new Error(body.detail ?? '요청 실패');
  }
  return res.json();
}

async function loadTasks() {
  try {
    tasks = await apiFetch('/tasks');
    renderList();
  } catch {
    // 폴링 중 네트워크 오류는 무시 (서버 재기동 대기)
  }
}

async function createTask(payload) {
  await apiFetch('/tasks', { method: 'POST', body: JSON.stringify(payload) });
  await loadTasks();
}

async function fetchDetail(id) {
  return apiFetch(`/tasks/${id}`);
}

async function saveTask(id, payload) {
  await apiFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  await loadTasks();
}

async function removeTask(id) {
  await apiFetch(`/tasks/${id}`, { method: 'DELETE' });
  tasks = tasks.filter(t => t.id !== id);
  renderList();
}

// ── 날짜 유틸 ──────────────────────────────────────────────────────────────

function formatDue(dueAt) {
  if (!dueAt) return null;
  const due = new Date(dueAt);
  const now = new Date();
  const diffDays = Math.ceil((due - now) / 86400000);
  const hhmm = due.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (diffDays > 0) return `D-${diffDays} ${hhmm}`;
  if (diffDays === 0) return `D-0 ${hhmm}`;
  return `D+${Math.abs(diffDays)} ${hhmm}`;
}

function dueColorClass(dueAt) {
  if (!dueAt) return '';
  const diffDays = Math.ceil((new Date(dueAt) - new Date()) / 86400000);
  if (diffDays < 0)  return 'text-red-500 font-medium';
  if (diffDays <= 1) return 'text-orange-500 font-medium';
  return 'text-gray-400 dark:text-gray-500';
}

// datetime-local 입력값 ↔ ISO 문자열 변환
function toDatetimeLocal(iso) {
  return iso ? iso.slice(0, 16) : '';
}
function fromDatetimeLocal(val) {
  return val ? `${val}:00` : null;
}

// ── 상태 배지 ──────────────────────────────────────────────────────────────

const STATUS_LABEL = { todo: '할 일', in_progress: '진행 중', done: '완료' };
const STATUS_CLASS = {
  todo:        'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  done:        'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

// ── 렌더링 ─────────────────────────────────────────────────────────────────

function renderList() {
  const list  = document.getElementById('task-list');
  const empty = document.getElementById('empty-msg');

  if (tasks.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = '';
  tasks.forEach(task => list.appendChild(createCard(task)));
}

function createCard(task) {
  const due      = formatDue(task.due_at);
  const dueClass = dueColorClass(task.due_at);

  const card = document.createElement('div');
  card.className =
    'rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md ' +
    'border border-gray-200/50 dark:border-gray-700/50 p-4 ' +
    'transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5';

  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">

      <!-- 제목 + 배지 (클릭 → 모달) -->
      <div class="card-info flex-1 min-w-0 cursor-pointer">
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
          ${escHtml(task.title)}
        </p>
        <div class="flex flex-wrap items-center gap-2 mt-1.5">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                       ${STATUS_CLASS[task.status] ?? STATUS_CLASS.todo}">
            ${STATUS_LABEL[task.status] ?? task.status}
          </span>
          ${due ? `<span class="text-xs ${dueClass}">${escHtml(due)}</span>` : ''}
        </div>
      </div>

      <!-- 삭제 버튼 영역 -->
      <div class="shrink-0">
        <!-- 휴지통 아이콘 -->
        <div class="del-normal">
          <button class="btn-trash min-h-[44px] min-w-[44px] flex items-center justify-center
                         rounded-xl text-gray-300 dark:text-gray-600
                         hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20
                         transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 pointer-events-none"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7
                   m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <!-- 삭제 확인 (기본 숨김) -->
        <div class="del-confirm" style="display:none">
          <div class="flex items-center gap-1">
            <button class="btn-confirm-del min-h-[44px] px-3 rounded-xl
                           text-xs font-medium text-white
                           bg-red-500 hover:bg-red-600
                           transition-all duration-200">삭제</button>
            <button class="btn-cancel-del min-h-[44px] px-3 rounded-xl
                           text-xs font-medium text-gray-600 dark:text-gray-300
                           bg-gray-100 dark:bg-gray-700
                           hover:bg-gray-200 dark:hover:bg-gray-600
                           transition-all duration-200">취소</button>
          </div>
        </div>
      </div>

    </div>
  `;

  // 카드 클릭 → 수정 모달
  card.querySelector('.card-info').addEventListener('click', () => openModal(task.id));

  // 휴지통 → 확인 상태로 전환
  card.querySelector('.btn-trash').addEventListener('click', (e) => {
    e.stopPropagation();
    card.querySelector('.del-normal').style.display = 'none';
    card.querySelector('.del-confirm').style.display = 'block';
  });

  // 삭제 확인
  card.querySelector('.btn-confirm-del').addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await removeTask(task.id);
    } catch (err) {
      showToast(
        err.message.includes('not found') ? '이미 삭제된 태스크입니다.' : err.message,
        'error'
      );
      await loadTasks();
    }
  });

  // 취소 → 원래 상태 복귀
  card.querySelector('.btn-cancel-del').addEventListener('click', (e) => {
    e.stopPropagation();
    card.querySelector('.del-normal').style.display = 'block';
    card.querySelector('.del-confirm').style.display = 'none';
  });

  return card;
}

// ── 모달 ───────────────────────────────────────────────────────────────────

async function openModal(id) {
  try {
    const task = await fetchDetail(id);
    editingId = id;
    document.getElementById('m-title').value  = task.title;
    document.getElementById('m-desc').value   = task.description;
    document.getElementById('m-due').value    = toDatetimeLocal(task.due_at);
    document.getElementById('m-status').value = task.status;
    document.getElementById('modal-overlay').style.display = 'flex';
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  editingId = null;
}

// ── 토스트 ─────────────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.backgroundColor = type === 'error' ? '#ef4444' : '#1f2937';
  el.style.color = '#ffffff';
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

// ── 유틸 ───────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 이벤트 바인딩 ──────────────────────────────────────────────────────────

// 테마 토글
const themeIcon = document.getElementById('theme-icon');
themeIcon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';

document.getElementById('theme-toggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
});

// 추가 폼 제출
document.getElementById('add-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('f-title').value.trim();
  const titleError = document.getElementById('title-error');

  if (!title) {
    titleError.classList.remove('hidden');
    return;
  }
  titleError.classList.add('hidden');

  const payload = {
    title,
    status: document.getElementById('f-status').value,
    due_at: fromDatetimeLocal(document.getElementById('f-due').value),
  };

  try {
    await createTask(payload);
    document.getElementById('add-form').reset();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// 모달 저장
document.getElementById('modal-save').addEventListener('click', async () => {
  if (!editingId) return;
  const payload = {
    title:       document.getElementById('m-title').value.trim(),
    description: document.getElementById('m-desc').value,
    status:      document.getElementById('m-status').value,
    due_at:      fromDatetimeLocal(document.getElementById('m-due').value),
  };
  try {
    await saveTask(editingId, payload);
    closeModal();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// 모달 닫기: 닫기 버튼 / 오버레이 클릭 / ESC
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── 초기화 + 폴링 ──────────────────────────────────────────────────────────

loadTasks();
setInterval(loadTasks, 3000);
