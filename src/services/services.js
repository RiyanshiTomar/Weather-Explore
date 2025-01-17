import { City, Country, State } from 'country-state-city';

export class CityService {
    constructor() {
        this.cities = [];
        this.initialized = false;
        this.initializeData();
    }

    async initializeData() {
        if (this.initialized) return;

        const countries = Country.getAllCountries();
        
        const majorCountries = [
            'US', 'GB', 'CA', 'IN', 'AU', 'FR', 'DE', 'IT', 'ES', 'JP',
            'CN', 'BR', 'RU', 'ZA', 'KR', 'MX', 'AR', 'SA', 'NG', 'EG',
            'TR', 'ID', 'PK', 'BD', 'PL', 'NL', 'BE', 'CH', 'SE', 'NO'
          ];
                  
        for (const country of countries.filter(c => majorCountries.includes(c.isoCode))) {
            const states = State.getStatesOfCountry(country.isoCode);
            
            for (const state of states) {
                const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
                
                cities.forEach(city => {
                    this.cities.push({
                        id: `${city.name}-${state.isoCode}-${country.isoCode}`,
                        name: city.name,
                        state: state.name,
                        country: country.name,
                        searchString: `${city.name}, ${state.name}, ${country.name}`,
                        latitude: city.latitude,
                        longitude: city.longitude
                    });
                });
            }
        }
        
        this.initialized = true;
    }

    async searchCities(query) {
        if (!query || query.length < 2) return [];
        
        // Convert query to lowercase for case-insensitive search
        const lowercaseQuery = query.toLowerCase();
        
        return this.cities
            .filter(city => 
                city.searchString.toLowerCase().includes(lowercaseQuery)
            )
            .slice(0, 5); // Limit to 5 suggestions
    }
}

// Create a singleton instance
export const cityService = new CityService();