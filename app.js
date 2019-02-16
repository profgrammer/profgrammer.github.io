const key = '0d383115fa814c959ada88c9360eb5f8';
const main = document.querySelector('main');
const sources = document.querySelector('.sourceSelector');
const defaultSource = 'the-hindu';

window.addEventListener('load', async(e) => {
  updateNews();
  await updateSources();
  sources.value = defaultSource;

  sources.addEventListener('change', (e) => {
    updateNews(e.target.value);
  })

  if('serviceWorker' in navigator){
    try{
      navigator.serviceWorker.register('sw.js');
      console.log('sw registered');
    }catch(e){
      console.log('reg failed');
    }
  }
});


async function updateSources(){
  const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${key}
`);
  const json = await res.json();

  sources.innerHTML = json.sources
  .map(src => `<option value="${src.id}">${src.name}</option>`)
  .join('\n');
}

async function updateNews(source = defaultSource){
  const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${key}`);
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article){
  return `
  <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
