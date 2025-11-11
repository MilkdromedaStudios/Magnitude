(function(){
  if(document.getElementById('futuristic-sidebar')) return;

  // ---------- Sidebar Container ----------
  const sidebar = document.createElement('div');
  sidebar.id = 'futuristic-sidebar';
  sidebar.innerHTML = `
    <div class="header">
      <span id="sidebar-title">🌌 My Links</span>
      <button id="collapseBtn">⯇</button>
    </div>
    <div id="homeMenu">
      <div id="linksList"></div>
      <button id="addLinkBtn">➕ Add Link</button>
    </div>
    <div id="addLinkFormContainer" style="display:none;">
      <form id="addForm">
        <input id="title" placeholder="Title ✨" required>
        <input id="url" placeholder="https://example.com 🌐" required>
        <button type="submit">Add</button>
        <button type="button" id="cancelAdd">❌</button>
      </form>
    </div>
    <div id="iframeContainer" style="display:none;">
      <button id="backBtn">⬅ Back</button>
      <iframe id="viewerFrame" src="about:blank"></iframe>
      <div id="resizer"></div>
    </div>
  `;
  document.body.appendChild(sidebar);

  // ---------- Data ----------
  let links = JSON.parse(localStorage.getItem('sidebar_links')||'[]');
  let iframeSizes = JSON.parse(localStorage.getItem('iframe_sizes')||'{}');

  // ---------- DOM Elements ----------
  const linksList = sidebar.querySelector('#linksList');
  const addFormContainer = sidebar.querySelector('#addLinkFormContainer');
  const addForm = sidebar.querySelector('#addForm');
  const titleInput = addForm.querySelector('#title');
  const urlInput = addForm.querySelector('#url');
  const addLinkBtn = sidebar.querySelector('#addLinkBtn');
  const cancelAdd = addForm.querySelector('#cancelAdd');
  const homeMenu = sidebar.querySelector('#homeMenu');
  const iframeContainer = sidebar.querySelector('#iframeContainer');
  const viewer = sidebar.querySelector('#viewerFrame');
  const backBtn = sidebar.querySelector('#backBtn');
  const resizer = sidebar.querySelector('#resizer');
  const collapseBtn = sidebar.querySelector('#collapseBtn');

  // ---------- Render Links ----------
  function render() {
    linksList.innerHTML='';
    links.forEach(l=>{
      const btn = document.createElement('button');
      btn.innerHTML = `${l.icon||'🌐'} ${l.title}`;
      btn.onclick = ()=>{
        homeMenu.style.display = 'none';
        addFormContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        viewer.src = l.url;
        viewer.style.width = (iframeSizes[l.url]?.width || '100%');
        viewer.style.height = (iframeSizes[l.url]?.height || '50%');
      }
      linksList.appendChild(btn);
    });
  }

  render();

  // ---------- Add Link ----------
  addLinkBtn.onclick = ()=>{
    addFormContainer.style.display='block';
    homeMenu.style.display='none';
  }
  cancelAdd.onclick = ()=>{
    addFormContainer.style.display='none';
    homeMenu.style.display='flex';
  }
  addForm.onsubmit = e=>{
    e.preventDefault();
    let title = titleInput.value.trim();
    let url = urlInput.value.trim();
    if(!url.startsWith('http')) url='https://'+url;
    links.unshift({title,url,icon:'🌐'});
    localStorage.setItem('sidebar_links', JSON.stringify(links));
    render();
    addForm.reset();
    addFormContainer.style.display='none';
    homeMenu.style.display='flex';
  }

  // ---------- Back Button ----------
  backBtn.onclick = ()=>{
    iframeContainer.style.display='none';
    homeMenu.style.display='flex';
  }

  // ---------- Collapse / Edge Hover ----------
  collapseBtn.onclick = ()=> sidebar.classList.toggle('collapsed');
  sidebar.addEventListener('mouseleave', ()=>{
    if(!iframeContainer.style.display || iframeContainer.style.display=='none') sidebar.classList.add('collapsed');
  });
  sidebar.addEventListener('mouseenter', ()=> sidebar.classList.remove('collapsed'));
  
  // Edge hover detection: create invisible hover zone
  const hoverZone = document.createElement('div');
  hoverZone.style.position='fixed';
  hoverZone.style.top='0';
  hoverZone.style.left='0';
  hoverZone.style.width='10px'; // bigger hover zone
  hoverZone.style.height='100%';
  hoverZone.style.zIndex='999998';
  hoverZone.style.background='transparent';
  document.body.appendChild(hoverZone);
  hoverZone.addEventListener('mouseenter', ()=> sidebar.classList.remove('collapsed'));

  // ---------- Resizable Iframe ----------
  let isResizing = false;
  resizer.style.width='100%';
  resizer.style.height='10px';
  resizer.style.cursor='ns-resize';
  resizer.style.background='transparent';
  resizer.style.position='absolute';
  resizer.style.bottom='0';
  resizer.addEventListener('mousedown', e=>{
    isResizing=true;
    document.body.style.userSelect='none';
  });
  document.addEventListener('mousemove', e=>{
    if(!isResizing) return;
    let rect = viewer.getBoundingClientRect();
    let newHeight = e.clientY - rect.top;
    viewer.style.height = newHeight + 'px';
  });
  document.addEventListener('mouseup', e=>{
    if(isResizing){
      isResizing=false;
      document.body.style.userSelect='';
      if(viewer.src) iframeSizes[viewer.src] = {width: viewer.style.width, height: viewer.style.height};
      localStorage.setItem('iframe_sizes', JSON.stringify(iframeSizes));
    }
  });

})();
