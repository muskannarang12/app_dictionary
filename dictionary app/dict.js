const form = document.querySelector('form');
const resultdiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    getwordInfo(form.elements[0].value);
});

const getwordInfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found in dictionary');
        }
        const data = await response.json();
        console.log(data);
      
            const meaning = data[0].meanings[0];
            const definition = meaning.definitions[0];
          
           
            resultdiv.innerHTML = `
                <h2><strong>Word:</strong> ${data[0].word}</h2>
                <p class= "partsofspeech"> ${meaning.partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${definition.definition=== undefined ? "NOT FOUND" :definition.definition}</p>
                <p><strong>Example:</strong> ${definition.example=== undefined ? "NOT FOUND" :definition.example}</p>
                <p><strong>Antonyms:</strong></p>`;
                if(definition.antonyms.length === 0){
                    resultdiv.innerHTML+= `<span>not found</span>`
                }
                else{ for (let i = 0; i < definition.antonyms.length; i++) {
                    resultdiv.innerHTML+= `<li>${definition.antonyms[i]}</li>`
                     
                 }}

                 resultdiv.innerHTML+=  `<div><a href= "${data[0].sourceUrls}" target="_blank" style= "background-color: rgb(37, 37, 126); color: white; padding:5px; border:none; border-radius: 5px; text-decoration: none; " >Read more</a></div>`
        
    } catch (error) {
        resultdiv.innerHTML = `<h2>Error: ${error.message}</h2>`;
    }
};
