import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [searchHits, setSearchHits] = useState(-1);

  const fetchResult = async (query) => {
    if (query === "") {
      setSearchHits(-1);
      setResult([]);
      return;
    }

    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srlimit: 20,
      srsearch: query,
      format: "json",
      origin: "*",
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    setSearchHits(data.query.searchinfo.totalhits);
    setResult(data.query.search);
  };

  function handleChange(eve) {
    const newValue = eve.target.value;
    setSearch(newValue);
    debouncedFetch(newValue);
  }

  let timeout;
  function debounce(cb, delay = 1000) {
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  }

  const debouncedFetch = debounce(fetchResult, 100);

  return (
    <div className="app">
      <header>
        <h1 className="twiliopedia">Twiliopedia</h1>
        <form className="searchbox" onSubmit={(eve) => eve.preventDefault()}>
          <input
            type="searchbar"
            placeholder="Ahoy Twilion! What are you looking for?"
            value={search}
            onChange={handleChange}
          />
        </form>
        {searchHits !== -1 ? <p>Search Results: {searchHits}</p> : ""}
      </header>
      <div className="results">
        {result.map((resultTile, i) => {
          const pageUrl = `https://en.wikipedia.org/?curid=${resultTile.pageid}`;
          return (
            <div className="resulttile" key={i}>
              <h3>{resultTile.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: resultTile.snippet + "..." }} />
              <div className="readlink">
                <a href={pageUrl} target="_blank">Read More</a>
                <h7>A <span style={{ color: 'red' }}>{Math.ceil(resultTile.wordcount / 200)}</span> min read.</h7>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
