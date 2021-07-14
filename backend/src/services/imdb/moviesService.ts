import axios  from 'axios';
import dotenv from 'dotenv';

const config = dotenv.config();
const rapidApiKeyIMDB = process.env.IMDB_KEY;
const rapidApiHost = process.env.IMDB_HOST;

console.log(`The api key : ${config}`, config);
async function retrieveMovieDetails(movieId: string): Promise<MovieDetails> {
    console.log(`Retrieving details for movie id ${movieId}`);
    const movieDetails = await axios.request({
        method: 'GET',
        url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
        params: {i: movieId, r: 'json'},
        headers: {
            'x-rapidapi-key': rapidApiKeyIMDB,
            'x-rapidapi-host': rapidApiHost
        }
    });
    const {Plot, Title} = movieDetails.data;
    return {plot: Plot, title: Title};
}


export interface MovieDetails {
    plot: string;
    title: string;
}

export const MovieStream = {
    from: 60800,
    to: 60820,
    [Symbol.asyncIterator]() {
        return {
            current: this.from,
            last: this.to,
            async next() {
                let movieDetails =
                new Promise((resolve, reject ) => {
                    let details = retrieveMovieDetails(`tt00${this.current}`);
                    setTimeout(() =>
                    resolve(details), 4000);
                });
                if (this.current <= this.last) {
                    this.current++;
                    return { done: false, value: movieDetails };
                  } else {
                    return { done: true };
                  }
            }

        }
    }
}




