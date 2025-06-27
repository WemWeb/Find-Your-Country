document.addEventListener('DOMContentLoaded', () => {
    const countryList = document.getElementById('country-list');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const sortPopulation = document.getElementById('sort-population');
    const loadMoreButton = document.getElementById('load-more');
    const useMockDataButton = document.getElementById('use-mock-data'); // Button to toggle mock data

    let countries = [];
    let currentPage = 0;
    const countriesPerPage = 10;
    let populationSortOrder = 'asc'; // Track population sort order
    let regionSortOrder = 'asc'; // Track region sort order

    // Function to generate mock country data
    function generateMockData(numCountries) {
        const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
        const mockCountries = [];

        for (let i = 0; i < numCountries; i++) {
            const country = {
                name: { common: `Country ${i + 1}` },
                capital: [`Capital ${i + 1}`],
                region: regions[Math.floor(Math.random() * regions.length)],
                flags: { png: `https://via.placeholder.com/50?text=Flag+${i + 1}` },
                population: Math.floor(Math.random() * 100000000) // Random population up to 100 million
            };
            mockCountries.push(country);
        }
        return mockCountries;
    }

    // Function to fetch country data from the API
    function fetchCountryData() {
        fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population')
            .then(response => response.json())
            .then(data => {
                countries = data;
                displayCountries();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Toggle between API data and mock data
    function toggleDataSource() {
        if (countries.length === 0 || countries[0].name.common.startsWith('Country')) {
            countries = generateMockData(100); // Generate 100 mock countries
        } else {
            fetchCountryData(); // Fetch from API
        }
        currentPage = 0; // Reset pagination
        displayCountries();
    }

    // Initial data fetch
    fetchCountryData();

    // Display countries
    function displayCountries() {
        const start = currentPage * countriesPerPage;
        const end = start + countriesPerPage;
        const paginatedCountries = countries.slice(start, end);

        countryList.innerHTML = ''; // Clear previous results

        paginatedCountries.forEach(country => {
            const countryDiv = document.createElement('div');
            countryDiv.classList.add('country');
            countryDiv.innerHTML = `
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                <div>
                    <h2>${country.name.common}</h2>
                    <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p>Region: ${country.region}</p>
                    <p>Population: ${country.population.toLocaleString()}</p>
                </div>
            `;
            countryList.appendChild(countryDiv);
        });

        currentPage++;
        if (currentPage * countriesPerPage >= countries.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        filterCountries();
    });

    // Region filter functionality
    regionFilter.addEventListener('change', () => {
        filterCountries();
    });

    // Sort by population functionality
    sortPopulation.addEventListener('change', () => {
        sortCountriesByPopulation(); // Automatically sort by population when changed
    });

    // Filter countries based on search and region
    function filterCountries() {
        const filterText = searchInput.value.toLowerCase();
        const selectedRegion = regionFilter.value;

        const filteredCountries = countries.filter(country => {
            const matchesName = country.name.common.toLowerCase().includes(filterText);
            const matchesRegion = selectedRegion ? country.region === selectedRegion : true;
            return matchesName && matchesRegion;
        });

        countries = filteredCountries;
        currentPage = 0; // Reset pagination
        displayCountries(); // Display filtered countries
    }

    // Sort countries by region
    function sortCountriesByRegion() {
        countries.sort((a, b) => {
            return a.region.localeCompare(b.region);
        });
        currentPage = 0; // Reset pagination
        displayCountries(); // Display sorted countries
    }

    // Sort countries by population
    function sortCountriesByPopulation() {
        const sortOrder = sortPopulation.value;

        if (sortOrder === 'asc') {
            countries.sort((a, b) => a.population - b.population);
        } else if (sortOrder === 'desc') {
            countries.sort((a, b) => b.population - a.population);
        }

        currentPage = 0; // Reset pagination
        displayCountries(); // Display sorted countries
    }

    // Load more countries
    loadMoreButton.addEventListener('click', () => {
        displayCountries();
    });

    // Button to toggle between API and mock data
    useMockDataButton.addEventListener('click', toggleDataSource);
});
