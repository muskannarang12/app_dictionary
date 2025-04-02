const form = document.querySelector('form');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const word = searchInput.value.trim();
    if (word) {
        getWordInfo(word);
    }
});

const showLoader = () => {
    loader.style.display = 'block';
    resultDiv.innerHTML = '';
};

const hideLoader = () => {
    loader.style.display = 'none';
};

const getWordInfo = async (word) => {
    showLoader();
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found in dictionary');
        }
        const data = await response.json();
        console.log(data);
        
        const entry = data[0];
        const meaning = entry.meanings[0];
        const definition = meaning.definitions[0];
        
        let antonymsHTML = '';
        if (definition.antonyms && definition.antonyms.length > 0) {
            antonymsHTML = `
                <div class="antonyms">
                    <h3>Antonyms</h3>
                    <ul class="word-list">
                        ${definition.antonyms.map(antonym => `<li>${antonym}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            antonymsHTML = '';
        }

        let synonymsHTML = '';
        if (definition.synonyms && definition.synonyms.length > 0) {
            synonymsHTML = `
                <div class="synonyms">
                    <h3>Synonyms</h3>
                    <ul class="word-list">
                        ${definition.synonyms.map(synonym => `<li>${synonym}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            synonymsHTML = '';
        }

        resultDiv.innerHTML = `
            <div class="word-header">
                <h2 class="word-title">${entry.word}</h2>
                <div class="phonetic">${entry.phonetic || ''}</div>
            </div>
            
            <p class="part-of-speech">${meaning.partOfSpeech}</p>
            
            <div class="definition">
                <strong>Definition:</strong> ${definition.definition || 'Not available'}
            </div>
            
            ${definition.example ? `
                <div class="example">
                    ${definition.example}
                </div>
            ` : ''}
            
            ${synonymsHTML}
            ${antonymsHTML}
            
            ${entry.sourceUrls ? `
                <a href="${entry.sourceUrls[0]}" class="read-more" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Read more
                </a>
            ` : ''}
        `;
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>${error.message}</h2>
                <p>Please try another word</p>
            </div>
        `;
    } finally {
        hideLoader();
    }
};

// Focus search input on page load
window.addEventListener('DOMContentLoaded', () => {
    searchInput.focus();
});