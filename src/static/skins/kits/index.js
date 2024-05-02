'use strict';

async function queryTTL(padId) {
  const ttlResponse = await fetch(`/ttl/${padId}`);
  return (await ttlResponse.json())?.ttl;
}

async function addTTL(pads) {
  return Promise.all(pads.map(async (pad) => {
    const ttl = await queryTTL(pad.name);
    pad['ttl'] = ttl;
    return pad;
  }))
}

function createTimeStringDE(createdAt) {
  return `Pad vom ${createdAt.getDate()}.${createdAt.getMonth() + 1 }.${createdAt.getFullYear()} um ${createdAt.getHours()}:${('0'+createdAt.getMinutes()).slice(-2)} Uhr`;
}

window.customStart = async () => {
  // define your javascript here
  // jquery is available - except index.js
  // you can load extra scripts with $.getScript http://api.jquery.com/jQuery.getScript/

  // configure link list - on iOS, the navigation bar is dynamic. when it's expanded, 
  // the link list would be below the fold or very close to the edge. 
  // to handle this, we adjust the size of the column to the inner height of the window
  const leftColumn = document.getElementById('left-column');

  function setLeftColumnHeight(){
      leftColumn?.setAttribute("style", `height: ${window.innerHeight}px !important`);
  }
  // change the left column size whenever the window is resized
  window.addEventListener("resize", setLeftColumnHeight);

  // call initially:
  setLeftColumnHeight();

  const lastPadsList = document.getElementById('pad-list');
  const json = window.localStorage.getItem('pads');

  const pads = (json && json !== '') ? JSON.parse(json) : [];
  
  const padsWithTTL = (await addTTL(pads)).filter((pad) => pad?.ttl && pad?.ttl > 0);
  window.localStorage.setItem('pads', JSON.stringify(padsWithTTL));

  pads
    .slice(Math.max(pads.length - 3, 0))
    .reverse()
    .forEach(pad => {
      const createdAt = new Date(pad.createdAt);
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute("class", "text-decoration-none text-break");
      link.setAttribute("href", `/p/${pad.name}`);
      link.textContent = createTimeStringDE(createdAt);
      li.appendChild(link);
      lastPadsList.appendChild(li);
  });

  if(pads.length === 0) {
    const emptyText = document.createElement('span')
    emptyText.textContent = '-'
    lastPadsList.appendChild(emptyText);
  }
};

