const codeBlocks = [
  {
    title: "Async Case",
    code: `async function fetchData(){
        try {
            let response = await fetch();
            let data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }`,
    locked: false,
  },
  {
    title: "Event Listener",
    code: `document.getElementById('myButton').addEventListener('click', function() {
            alert('Button was clicked!');
          })`,
    locked: false,
  },
];
export default codeBlocks;
