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
      <div id="greeting">✨ Welcome! Tip: Hover edge to open sidebar.</div>
      <div id="tip">💡 Tip of the day: You can resize iframes!</div>
      <div id="linksList"></div>
      <button id="addLinkBtn">➕ Add Link</button>
    </div>

    <div id="addLinkFormContainer" style="display:none;">
      <form id="addForm">
        <input id="title" placeholder="Title ✨" required>
        <input id="url" placeholder="https://example.com 🌐" required>
        <div style="display:flex;gap:4px;">
          <button type="submit">Add</button>
          <button type="button" id="cancelAdd">❌</button>
        </div>
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
  let sidebarWidth = localStorage.getItem('sidebar_width') || '280px';

  sidebar.style.width = sidebarWidth;

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
  const collapseBtn = sidebar.querySelector('#collapseBtn');

  // ---------- Render Links ----------
  function render() {
    linksList.innerHTML='';
    links.forEach((l, i)=>{
      const btnContainer = document.createElement('div');
      btnContainer.style.display = 'flex';
      btnContainer.style.justifyContent = 'space-between';
      btnContainer.style.alignItems = 'center';

      const btn = document.createElement('button');
      btn.innerHTML = `${l.icon||'🌐'} ${l.title}`;
      btn.style.flex='1';
      btn.onclick = ()=>{
        homeMenu.style.display = 'none';
        addFormContainer.style.display = 'none';
        iframeContainer.style.display = 'flex';
        viewer.src = l.url;

        if(iframeSizes[l.url]){
          viewer.style.width = iframeSizes[l.url].width;
          viewer.style.height = iframeSizes[l.url].height;
        } else {
          viewer.style.width = '100%';
          viewer.style.height = '50%';
        }
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML='🗑️';
      deleteBtn.style.marginLeft='6px';
      deleteBtn.style.background='rgba(255,0,0,0.2)';
      deleteBtn.style.border='none';
      deleteBtn.style.borderRadius='8px';
      deleteBtn.style.cursor='pointer';
      deleteBtn.onclick = (e)=>{
        e.stopPropagation();
        links.splice(i,1);
        localStorage.setItem('sidebar_links', JSON.stringify(links));
        render();
      }

      btnContainer.appendChild(btn);
      btnContainer.appendChild(deleteBtn);
      linksList.appendChild(btnContainer);
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

  // ---------- Collapse / Auto-hide ----------
  collapseBtn.onclick = ()=> sidebar.classList.toggle('collapsed');

  sidebar.addEventListener('mouseleave', ()=>{
    if(!iframeContainer.style.display || iframeContainer.style.display=='none') sidebar.classList.add('collapsed');
  });
  sidebar.addEventListener('mouseenter', ()=> sidebar.classList.remove('collapsed'));

  // ---------- Edge hover zone ----------
  const hoverZone = document.createElement('div');
  hoverZone.style.position='fixed';
  hoverZone.style.top='0';
  hoverZone.style.left='0';
  hoverZone.style.width='15px';
  hoverZone.style.height='100%';
  hoverZone.style.zIndex='999998';
  hoverZone.style.background='transparent';
  document.body.appendChild(hoverZone);
  hoverZone.addEventListener('mouseenter', ()=> sidebar.classList.remove('collapsed'));

  // ---------- Resizable Sidebar Width ----------
  let isResizingSidebar = false;
  const sidebarResizer = document.createElement('div');
  sidebarResizer.style.width='6px';
  sidebarResizer.style.top='0';
  sidebarResizer.style.right='0';
  sidebarResizer.style.bottom='0';
  sidebarResizer.style.position='absolute';
  sidebarResizer.style.cursor='ew-resize';
  sidebarResizer.style.background='transparent';
  sidebar.appendChild(sidebarResizer);

  sidebarResizer.addEventListener('mousedown', e=>{
    isResizingSidebar=true;
    document.body.style.userSelect='none';
  });
  document.addEventListener('mousemove', e=>{
    if(!isResizingSidebar) return;
    let newWidth = e.clientX;
    if(newWidth<200) newWidth=200;
    if(newWidth>window.innerWidth*0.9) newWidth=window.innerWidth*0.9;
    sidebar.style.width = newWidth+'px';
  });
  document.addEventListener('mouseup', e=>{
    if(isResizingSidebar){
      isResizingSidebar=false;
      document.body.style.userSelect='';
      localStorage.setItem('sidebar_width', sidebar.style.width);
    }
  });

  // ---------- Resizable Iframe ----------
  let isResizing = false;
  const resizer = sidebar.querySelector('#resizer');
  const minWidth = 200;
  const minHeight = 150;
  resizer.addEventListener('mousedown', e=>{
    isResizing=true;
    document.body.style.userSelect='none';
  });
  document.addEventListener('mousemove', e=>{
    if(!isResizing) return;
    let rect = viewer.getBoundingClientRect();
    let newWidth = e.clientX - rect.left;
    let newHeight = e.clientY - rect.top;
    if(newWidth<minWidth) newWidth=minWidth;
    if(newHeight<minHeight) newHeight=minHeight;
    viewer.style.width = newWidth+'px';
    viewer.style.height = newHeight+'px';
  });
  document.addEventListener('mouseup', e=>{
    if(isResizing){
      isResizing=false;
      document.body.style.userSelect='';
      if(viewer.src) {
        iframeSizes[viewer.src] = {width: viewer.style.width, height: viewer.style.height};
        localStorage.setItem('iframe_sizes', JSON.stringify(iframeSizes));
      }
    }
  });

})();
