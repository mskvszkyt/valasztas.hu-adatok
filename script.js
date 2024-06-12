const url = "https://vtr.valasztas.hu/ep2024/data/06120800/szavossz/";

let filePaths;

fetch('https://vtr.valasztas.hu/ep2024/data/06091753/ver/Telepulesek.json')
  .then(response => response.json())
  .then(data => {
    filePaths = data.list.map(item => {
      const maz = item.leiro.maz;
      const taz = item.leiro.taz;
      return `${maz}/TelepEredm-${maz}-${taz}.json`;
    });

    const delay = 200;
    let csvData = "maz;taz;szavazott_osszesen;szl_ervenytelen;tetelek[0];tetelek[1];tetelek[2];tetelek[3];tetelek[4];tetelek[5];tetelek[6];tetelek[7];tetelek[8];tetelek[9];tetelek[10]\n";

    function fetchNext(index) {
      if (index < filePaths.length) {
        const element = filePaths[index];
        fetch(url + element)
          .then(response => response.json())
          .then(data => {
            const { maz, taz, szavazott_osszesen, szl_ervenytelen, tetelek } = data.data; 
            if (tetelek) {
              const sortedTetelek = tetelek.sort((a, b) => a.szavlap_sorsz - b.szavlap_sorsz);
              const csvRow = `${maz};${taz};${szavazott_osszesen};${szl_ervenytelen};${sortedTetelek.map(item => item.szavazat).join(";")}\n`; 
              csvData += csvRow;
            }
            setTimeout(() => fetchNext(index + 1), delay); 
          })
          .catch(err => {
            console.log(err);
            setTimeout(() => fetchNext(index + 1), delay); 
          });
      } else {
        console.log("CSV data:", csvData);
      }
    }

    fetchNext(0); 
  })
  .catch(error => console.error('Error fetching the JSON:', error));
