import Promise from 'bluebird';
import _ from 'lodash';
import Trakt from 'trakt.tv'
import config from '../../../config.json';
import moment from 'moment';

const trakt = new Trakt({
  client_id: config.traktApiKey
})

module.exports = {
  commands: [{
    alias: ['movie'],
    command: 'searchMovies'
  }, {
    alias: ['show', 'tvshow'],
    command: 'searchShows'
  }, {
    alias: ['imdb', 'trakt'],
    command: 'redirect'
  }],
  help: [{
    command: ['movie'],
    usage: 'movie <name> - fetches info for a movie'
  }, {
    command: ['show', 'tvshow'],
    usage: 'players <appid or game name> - returns players for steam app'
  }],
  searchMovies(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: movie <query> - Returns movie information for query'
        });

      return reject("Not implemented");
    });
  },
  searchShows(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: movie <query> - Returns movie information for query'
        });

      trakt.search({ type: 'show', query: input }).then(shows => {
        Promise.join(trakt.shows.summary({ id: shows[0].show.ids.trakt, extended: 'full,images' }), trakt.seasons.summary({ id: shows[0].show.ids.trakt })).then(([show, seasons]) => {
          if (!show) return reject("Couldn't find a show with that name");
          return resolve({
            type: 'channel',
            message: generateShowRsesponse(show, seasons)
          });
        }).catch(reject);
      }).catch(reject);
    });
  },
  redirect() {
    return new Promise(resolve => {
      return resolve({
        type: 'dm',
        message: `You can use the ${config.prefix}movie or ${config.prefix}tvshow commands to fetch movie/show information`
      });
    });
  }
};

const imgResize = 'https://images.weserv.nl/?w=175&url=';

const generateMovieResponse = (movieDetails => {})

const generateShowRsesponse = ((showDetails, seasons) => {
  let out = {
    attachments: [{
      "title": `${showDetails.title} (${showDetails.year || 'Unknown'})`,
      "title_link": `https://trakt.tv/shows/${showDetails.ids.slug}`,
      "fallback": `${showDetails.title} (${showDetails.year})`,
      "image_url": showDetails.images.poster.thumb ? imgResize + showDetails.images.poster.thumb.replace('https://', '') : null,
      "mrkdwn_in": ["text", "pretext", "fields"],
      "color": "#c61017"
    }]
  };
  // Filter the shit to remove nulls
  out.attachments[0].fields = _.filter([{
    "title": "Overview",
    "value": _.trunc(showDetails.overview, 400) || null,
    "short": false
  }, {
    "title": "First Aired",
    "value": showDetails.first_aired ? moment(showDetails.first_aired).format('MMMM Do YYYY') : null,
    "short": true
  }, {
    "title": "Status",
    "value": showDetails.status.split(' ').map(s => _.capitalize(s)).join(' ') || null,
    "short": true
  }, {
    "title": "Episodes",
    "value": `${showDetails.aired_episodes} Episodes | ${seasons.length} ${seasons.length == 1 ? 'Season' : 'Seasons'}`,
    "short": true
  }, {
    "title": "Genres",
    "value": showDetails.genres.slice(0, 3).map(g => _.capitalize(g)).join(', ') || null,
    "short": true
  }, {
    "title": "Rating",
    "value": _.floor(showDetails.rating, 1) || null,
    "short": true
  }, {
    "title": "Network",
    "value": showDetails.network || null,
    "short": true
  }, {
    "title": "Homepage",
    "value": showDetails.homepage ? showDetails.homepage.replace(/^(https?):\/\//, '') : null,
    "short": true
  }, {
    "title": "Trailer",
    "value": showDetails.trailer ? showDetails.trailer.replace(/^(https?):\/\//, '') : null,
    "short": true
  }], 'value')
  return out;
})
