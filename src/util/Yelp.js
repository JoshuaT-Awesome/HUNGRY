const clientID = '_BWFu-THV70H9cdrcAB5Ag';
const secret = 'TuBxAN2NrmS5x7v2qAU1pahup2OuVmphPx3etUkLC2vtaClyG0pEhpC6z20LsXEt';
let accessToken = '';

const Yelp = {
    getAccessToken: function() {
        if (accessToken) {
            return new Promise(resolve => resolve(accessToken));
        }
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientID}&client_secret=${secret}`, {
            method: 'POST'
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }).then(jsonResponse => {
            accessToken = jsonResponse.access_token;
        });
    },
    search: function (term, location, sortBy) {
        return Yelp.getAccessToken().then( () => {
            return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }).then(jsonResponse => {
            if (jsonResponse.businesses) {
                return jsonResponse.businesses.map(business => (
                    {
                        id: business.id,
                        imageSrc: business.image_url,
                        name: business.name,
                        address: business.location.address1,
                        city: business.location.city,
                        state: business.location.state,
                        zipCode: business.location.zip_code,
                        category: business.categories[0].title,
                        rating: business.rating,
                        reviewCount: business.review_count
                    }
                ));
            }
        });
    },
};

export default Yelp;