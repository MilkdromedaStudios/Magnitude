(function() {
  // Prevent double injection
  if (document.getElementById('futuristic-sidebar')) return;

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'futuristic-sidebar';
  sidebar.innerHTML = `
    <div class="header">
      <span>🌌 My Links</span>
      <button id="collapseBtn">⯇</button>
    </div>
    <div id="linksList"></div>
    <form id="addForm">
      <input id="title" placeholder="Title ✨" required>
      <input id="url" placeholder="https://example.com 🌐" required>
      <button type="submit">➕</button>
    </form>
    <iframe id="viewerFrame" src="about:blank"></iframe>
  `;
  document.body.appendChild(sidebar);

  // Load links
  let links = JSON.parse(localStorage.getItem('sidebar_links')||'[]');

  const linksList = sidebar.querySelector('#linksList');
  const addForm = sidebar.querySelector('#addForm');
  const titleInput = sidebar.querySelector('#title');
  const urlInput = sidebar.querySelector('#url');
  const viewer = sidebar.querySelector('#viewerFrame');
  const collapseBtn = sidebar.querySelector('#collapseBtn');

  function render() {
    linksList.innerHTML='';
    links.forEach((l,i)=>{
      const btn = document.createElement('button');
      btn.innerHTML = `${l.icon||'🌐'} ${l.title}`;
      btn.onclick=()=> viewer.src=l.url;
      linksList.appendChild(btn);
    });
  }

  addForm.onsubmit = e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    if(!title || !url) return;
    if(!url.startsWith('http')) url='https://'+url;
    links.unshift({title,url,icon:'🌐'});
    localStorage.setItem('sidebar_links', JSON.stringify(links));
    render();
    titleInput.value=''; urlInput.value='';
  }

  collapseBtn.onclick = () => sidebar.classList.toggle('collapsed');
  sidebar.addEventListener('mouseleave', () => sidebar.classList.add('collapsed'));
  sidebar.addEventListener('mouseenter', () => sidebar.classList.remove('collapsed'));

  render();
})();
