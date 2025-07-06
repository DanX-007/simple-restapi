// API Data with descriptions
const apiData = {
    "Downloader": [
        {
            method: "GET",
            title: "YouTube Downloader",
            status: "online",
            description: "API untuk mendownload video atau shorts dari YouTube.",
            endpoint: "/api/ytdl?url=&format=&apikey="
        },
        {
            method: "GET",
            title: "Capcut Downloader",
            status: "online",
            description: "API untuk mendownload Capcut.",
            endpoint: "/api/capcut/download?url=&apikey="
        },
        {
            method: "GET",
            title: "MediaFire Downloader",
            status: "online",
            description: "API untuk mendapatkan link download dari MediaFire.",
            endpoint: "/api/mediafire/download?url=&apikey="
        },
        {
            method: "GET",
            title: "Spotify Downloader",
            status: "online",
            description: "API untuk mendownload lagu dari Spotify.",
            endpoint: "/api/spotify-dl/download?url=&apikey="
        },
        {
            method: "GET",
            title: "App Download",
            status: "online",
            description: "API untuk mendownload sebuah aplikasi.",
            endpoint: "/api/appsearch/app?url=&apikey="
        },
        {
            method: "GET",
            title: "Twitter Downloader",
            status: "online",
            description: "API untuk mendownload video atau gambar dari Twitter.",
            endpoint: "/api/twitterdl?url=&apikey="
        },
        {
            method: "GET",
            title: "Instagram Downloader",
            status: "online",
            description: "API untuk mendownload video atau gambar dari Instagram.",
            endpoint: "/api/igdl?url=&apikey="
        },
        {
            method: "GET",
            title: "Facebook Downloader",
            status: "online",
            description: "API untuk mendownload video dari Facebook.",
            endpoint: "/api/fbdl?url=&apikey="
        },
        {
            method: "GET",
            title: "TikTok Downloader",
            status: "online",
            description: "API untuk mendownload video dari TikTok.",
            endpoint: "/api/ttdl?url=&apikey="
        }
    ],
    "Anime": [
       { 
            method: "GET",
            title: "Anime Terbaru",
            status: "online",
            description: "API untuk mendapatkan daftar anime terbaru yang dirilis.",
             endpoint: "/api/anime-terbaru?apikey="
        }
    ],
    "Search": [
        {
            method: "GET",
            title: "GitHub Stalk",
            status: "online",
            description: "API untuk melihat profil GitHub pengguna.",
            endpoint: "/api/githubstalk?username=&apikey="
        },
        {
            method: "GET",
            title: "Instagram Stalk",
            status: "online",
            description: "API untuk melihat profil Instagram pengguna.",
            endpoint: "/api/igstalk/stalk?username=&apikey="
        },
        {
            method: "GET",
            title: "Pinterest Search",
            status: "online",
            description: "API untuk mencari gambar dari Pinterest.",
            endpoint: "/api/pinterest?query=&apikey="
        },
        {
            method: "GET",
            title: "App Search",
            status: "online",
            description: "API untuk mencari sebuah aplikasi.",
            endpoint: "/api/appsearch/search?q=&apikey="
        },
        {
            method: "GET",
            title: "Search Groups",
            status: "online",
            description: "API untuk mencari grup WhatsApp berdasarkan kata kunci.",
            endpoint: "/api/searchgroups?q=&apikey="
        },
        {
            method: "GET",
            title: "TikTok Search",
            status: "online",
            description: "API untuk mencari video dari TikTok berdasarkan query.",
            endpoint: "/api/ttsearch?q=&apikey="
        },
        {
            method: "GET",
            title: "YouTube Search",
            status: "online",
            description: "API untuk mencari video dari YouTube berdasarkan kata kunci atau query.",
            endpoint: "/api/ytsearch?q=&apikey="
        }    
    ],
    "AI": [
        {
            method: "GET",
            title: "LLaMA 3.3 70B Versatile",
            status: "online",
            description: "API untuk mengakses model LLaMA 3.3 70B yang serbaguna.",
            endpoint: "/api/llama-3.3-70b-versatile?content=&apikey="
        },
        {
            method: "GET",
            title: "Bing Image Creator",
            status: "online",
            description: "API untuk membuat gambar dengan AI dari Bing.",
            endpoint: "/api/bardimg/create?prompt=&apikey="
        },
        {
            method: "GET",
            title: "Google Bard",
            status: "online",
            description: "API untuk mengakses Google Bard AI.",
            endpoint: "/api/bardai?content=&apikey="
        },
        {
            method: "Get",
            title: "Claude AI",
            status: "online",
            description: "API untuk mengakses Claude AI.",
            endpoint: "/api/claudeai/chat?text=&apikey="
        },
        {
            method: "GET",
            title: "Gemini AI",
            status: "online",
            description: "API untuk mengakses Google Gemini AI.",
            endpoint: "/api/gemini/ask?text=&apikey="
        },
        {
            method: "POST",
            title: "Audio Transcription",
            status: "online",
            description: "API untuk mentranskrip audio ke text.",
            endpoint: "/api/transcribe?apikey=",
            note: "Kirim file audio sebagai form-data"
        },
        {
            method: "GET",
            title: "Deepseek AI 70B",
            status: "online",
            description: "API untuk mengakses model Deepseek 70B yang serbaguna.",
            endpoint: "/api/deepseek-70b?content=&apikey="
        },
        {
            method: "GET",
            title: "Qwen AI 32B",
            status: "online",
            description: "API untuk mengakses model Qwen AI 32B yang serbaguna.",
            endpoint: "/api/qwenai-32b?content=&apikey="
        },
        {
            method: "GET",
            title: "Txt2Img",
            status: "online",
            description: "API untuk membuat gambar dari AI dengan style yang banyak.",
            endpoint: "/api/txt2img?prompt=&style=&apikey="
        }
    ],
    "Tools": [
        {
            method: "GET",
            title: "Screenshot Web",
            status: "online",
            description: "API untuk screenshot website dengan mudah.",
            endpoint: "/api/ssweb?url=&apikey="
        },
        {
            method: "GET",
            title: "Image Anime Converter",
            status: "online",
            description: "API untuk mengubah gambar menjadi gaya anime.",
            endpoint: "/api/image/toanime?url=&apikey="
        },
        {
            method: "GET",
            title: "Translate",
            status: "online",
            description: "API untuk translate bahasa apapun menjadi yang kamu inginkan.",
            endpoint: "/api/translate?text=&to=&apikey="
        },
        {
            method: "GET",
            title: "Nulis",
            status: "online",
            description: "Membuat gambar buku beserta tulisan berdasarkan dari query text kamu.",
            endpoint: "/api/nulis?text=&apikey="
        }
    ],
    "Fun": [
        {
            method: "GET",
            title: "Cek Khodam",
            status: "online",
            description: "Permainan seru yang menunjukkan khodam seseorang berdasarkan nama.",
            endpoint: "/api/cekkhodam?nama=&apikey="
        },
        {
            method: "GET",
            title: "Tahu Kah Kamu?",
            status: "online",
            description: "Permainan seru yang menunjukkan fakta2 random yang mungkin belom kamu ketahui.",
            endpoint: "/api/tahukahkamu?apikey="
        }
    ],
    "Sticker": [
        {
            method: "GET",
            title: "Brat Image",
            status: "online",
            description: "Mengubah text kamu menjadi gambar brat.",
            endpoint: "/api/brat?text=&apikey="
        },
        {
            method: "POST",
            title: "Quoted Chat",
            status: "offline",
            description: "Membuat gambar dengan desain quoted chat yang bisa kamu custom nama, color, foto profile, dan lainnya.",
            endpoint: "/api/qc?apikey="
        }
    ],
    "Berita": [
        {
            method: "GET",
            title: "Detik News",
            status: "online",
            description: "Mendapatkan informasi berita terbaru dari Detik News.",
            endpoint: "/api/detiknews?apikey="
        }
    ]      
};

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const apiContainer = document.getElementById('api-categories');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const noResults = document.getElementById('noResults');

// Create API Item with details (vertical layout)
function createApiItem(api) {
    const apiItem = document.createElement('div');
    apiItem.className = 'api-item';
    
    const apiHeader = document.createElement('div');
    apiHeader.className = 'api-header';
    
    const method = document.createElement('span');
    method.className = `api-method ${api.method.toLowerCase()}`;
    method.textContent = api.method;
    
    const title = document.createElement('span');
    title.className = 'api-title';
    title.textContent = api.title;
    
    const status = document.createElement('span');
    status.className = `api-status ${api.status}`;
    status.textContent = api.status;
    
    apiHeader.appendChild(method);
    apiHeader.appendChild(title);
    apiHeader.appendChild(status);
    
    const apiDetails = document.createElement('div');
    apiDetails.className = 'api-details';
    
    const description = document.createElement('p');
    description.className = 'api-description';
    description.textContent = api.description;
    
    const endpoint = document.createElement('div');
    endpoint.className = 'api-endpoint';
    endpoint.textContent = api.endpoint;
    
    const button = document.createElement('a');
    button.className = 'api-button';
    button.innerHTML = '<i class="fas fa-external-link-alt"></i> Akses Endpoint';
    button.href = api.endpoint;
    button.target = '_blank';
    
    button.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    apiDetails.appendChild(description);
    apiDetails.appendChild(endpoint);
    apiDetails.appendChild(button);
    
    apiItem.appendChild(apiHeader);
    apiItem.appendChild(apiDetails);
    
    apiHeader.addEventListener('click', () => {
        const wasActive = apiItem.classList.contains('active');
        
        document.querySelectorAll('.api-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (!wasActive) {
            apiItem.classList.add('active');
        }
    });
    
    return apiItem;
}

// Create Skeleton Loading (vertical layout)
function createSkeletonLoading() {
    loadingSkeleton.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const category = document.createElement('div');
        category.className = 'skeleton-category';
        
        const title = document.createElement('div');
        title.className = 'skeleton-title';
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'skeleton-items';
        
        for (let j = 0; j < 4; j++) {
            const item = document.createElement('div');
            item.className = 'skeleton-item';
            itemsContainer.appendChild(item);
        }
        
        category.appendChild(title);
        category.appendChild(itemsContainer);
        loadingSkeleton.appendChild(category);
    }
}

// Load API Data into the page (vertical layout)
function loadApiData() {
    apiContainer.innerHTML = '';
    noResults.style.display = 'none';
    
    for (const [category, apis] of Object.entries(apiData)) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'api-category';
        
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category;
        categoryElement.appendChild(categoryTitle);
        
        const apiList = document.createElement('div');
        apiList.className = 'api-list-vertical';
        
        apis.forEach(api => {
            apiList.appendChild(createApiItem(api));
        });
        
        categoryElement.appendChild(apiList);
        apiContainer.appendChild(categoryElement);
    }
}

// API Key Checker Functionality
document.getElementById('checkKeyBtn').addEventListener('click', async function() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const resultDiv = document.getElementById('keyCheckResult');
    
    if (!apiKey) {
        resultDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter an API key';
        resultDiv.className = 'key-check-result invalid';
        return;
    }

    try {
        // You'll need to create an endpoint in your backend to check API keys
        const response = await fetch(`/api/check-key?apikey=${encodeURIComponent(apiKey)}`);
        const data = await response.json();
        
        if (data.valid) {
            resultDiv.innerHTML = `<i class="fas fa-check-circle"></i> Key terdaftar atas nama: ${data.email}<br>
                                  Limit: ${data.limit} | Digunakan: ${data.usage} | Sisa: ${data.remaining}`;
            resultDiv.className = 'key-check-result valid';
        } else {
            resultDiv.innerHTML = '<i class="fas fa-times-circle"></i> Key tidak terdaftar';
            resultDiv.className = 'key-check-result invalid';
        }
    } catch (error) {
        resultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error checking key';
        resultDiv.className = 'key-check-result invalid';
        console.error('Error checking API key:', error);
    }
});

// Theme Toggle
function setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Search Functionality (vertical layout)
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            clearSearch.classList.add('visible');
        } else {
            clearSearch.classList.remove('visible');
        }
        
        let hasResults = false;
        
        document.querySelectorAll('.api-item').forEach(item => {
            const title = item.querySelector('.api-title').textContent.toLowerCase();
            const description = item.querySelector('.api-description').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            item.style.display = isVisible ? 'block' : 'none';
            
            if (isVisible) {
                hasResults = true;
                item.closest('.api-category').style.display = 'block';
            } else {
                const category = item.closest('.api-category');
                const visibleItems = category.querySelectorAll('.api-item[style="display: block"]');
                if (visibleItems.length === 0) {
                    category.style.display = 'none';
                }
            }
        });
        
        if (!hasResults && searchTerm.length > 0) {
            noResults.style.display = 'block';
            apiContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            apiContainer.style.display = 'block';
        }
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.classList.remove('visible');
        document.querySelectorAll('.api-item, .api-category').forEach(item => {
            item.style.display = 'block';
        });
        noResults.style.display = 'none';
        apiContainer.style.display = 'block';
        searchInput.focus();
    });
    
    searchInput.addEventListener('focus', () => {
        document.querySelectorAll('.api-item').forEach(item => {
            item.classList.remove('active');
        });
    });
}

// Initialize the app
function initApp() {
    createSkeletonLoading();
    
    setTimeout(() => {
        loadingSkeleton.style.display = 'none';
        loadApiData();
    }, 800);
    
    setupThemeToggle();
    setupSearch();
}

document.addEventListener('DOMContentLoaded', initApp);