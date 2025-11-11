(function(){
  let links = JSON.parse(localStorage.getItem('sidebar_links')||'[]');

  const sidebar = document.getElementById('sidebar');
  const linksList = document.getElementById('linksList');
  const addForm = document.getElementById('addForm');
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const viewer = document.getElementById('viewerFrame');
  const collapseBtn = document.getElementById('collapseBtn');

  function render() {
    linksList.innerHTML='';
    links.forEach((l,i)=>{
      const btn = document.createElement('button');
      btn.innerHTML = `${l.icon||'🔗'} ${l.title}`;
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

  // Auto-hide on mouse leave
  sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.add('collapsed');
  });
  sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.remove('collapsed');
  });

  render();
})();
