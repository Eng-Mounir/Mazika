import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Fade,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import MiniPlayer, { MINIPLAYER_HEIGHT } from '../components/layout/MiniPlayer';
import MediaCard from '../components/layout/Mediacard';
import { usePlayer } from '../context/PlayerContext';

const sidebarWidth = 240;
const NAVBAR_HEIGHT = 64;

const trendingSongs = [
  { id: 1, title: 'Emshy', artist: 'Tommy Gun, Rally', img: 'images/emshy.jpeg', type: 'song', audio: '/audio/emshy.mp3' },
  { id: 2, title: 'Kadaba', artist: 'Karim Osama', img: 'images/kadaba.jpeg', type: 'song' },
  { id: 3, title: 'FAWATER EL 3ETAB', artist: 'Marwan Moussa', img: 'images/fawater.jpeg', type: 'song' },
];

const allSongs = [
  ...trendingSongs,
  { id: 4, title: 'Heart Shaped Box', artist: 'Nirvana', img: 'images/inutero.jpeg', type: 'song' },
  { id: 5, title: 'عالعموم', artist: 'Shehab', img: 'images/3al3mom.jpeg', type: 'song' },
  { id: 6, title: 'Strangers In The Night', artist: 'Frank Sinatra', img: 'images/strangers.jpeg', type: 'song' },
  { id: 7, title: 'Wicked Game', artist: 'Chris Isaak', img: 'images/wickedgame.jpeg', type: 'song' },
];

const artists = [
  { id: "nirvana", name: 'Nirvana', img: 'images/nirvana.jpeg', type: 'artist' },
  { id: "fayrouz", name: 'Fayrouz', img: 'images/fairouz.jpeg', type: 'artist' },
  { id: "amr-diab", name: 'Amr Diab', img: 'images/amrdiab.jpeg', type: 'artist' },
  { id: "bahaa-sultan", name: 'Bahaa Sultan', img: 'images/bahaasultan.jpeg', type: 'artist' },
  { id: "lege-cy", name: 'Lege-cy', img: 'images/legecy.jpeg', type: 'artist' },
  { id: "the-beatles", name: 'The Beatles', img: 'images/beatles.jpeg', type: 'artist' },
  { id: "marwan-pablo", name: 'Marwan Pablo', img: 'images/pablo.jpeg', type: 'artist' },
  { id: "the-weeknd", name: 'The Weeknd', img: 'images/theweeknd.jpeg', type: 'artist' },
];

const podcasts = [
  { id: "ma3-kamel-a7teramy", title: 'Ma3 Kamel A7teramy - مع كامل احترامي', host: 'Mohamed Abdelaty', img: 'images/abdelaty.jpeg', type: 'podcast' },
  { id: "daheeh", title: 'الدحيح', host: 'Ahmed El Ghandour', img: 'images/daheeh.jpeg', type: 'podcast' },
  { id: "the-joe-rogan-experience", title: 'The Joe Rogan Experience', host: 'Joe Rogan', img: 'images/joe.jpeg', type: 'podcast' },
  { id: "ted-daily-talks", title: 'TED Daily Talks', host: 'TED', img: 'images/ted.jpeg', type: 'podcast' },
  { id: "the-daily", title: 'The Daily', host: 'Michael Barbaro', img: 'images/daily.jpeg', type: 'podcast' },
];

const filterBySearch = (items, fields, searchQuery) => {
  if (!searchQuery) return items;
  const query = searchQuery.toLowerCase();

  return items.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toLowerCase().startsWith(query);
    })
  );
};

export default function Home({ searchQuery }) {
  const theme = useTheme();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentSong, isPlaying, handlePlaySong, handlePlayPause } = usePlayer();

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);

  };
  const handlePodcastClick = (PodcastId) => {
    console.log(PodcastId)
    navigate(`/podcast/${PodcastId}`);
  };
  

  const handleFilterChange = (newFilter) => {
    if (newFilter !== filter) {
      setLoading(true);
      setTimeout(() => {
        setFilter(newFilter);
        setLoading(false);
      }, 500);
    }
  };

  const filteredSongs =
    (filter === 'songs' || filter === 'all')
      ? filterBySearch(allSongs, ['title', 'artist'], searchQuery)
      : [];

  const filteredPodcasts =
    (filter === 'podcasts' || filter === 'all')
      ? filterBySearch(podcasts, ['title', 'host'], searchQuery)
      : [];

  const filteredArtists =
    filter === 'all'
      ? filterBySearch(artists, ['name'], searchQuery)
      : [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar width={sidebarWidth} topOffset={NAVBAR_HEIGHT} />

        <Box
          component="main"
          sx={{
            ml: `${sidebarWidth}px`,
            mt: `${NAVBAR_HEIGHT}px`,
            p: 3,
            color: 'white',
            background: 'linear-gradient(180deg, rgba(3,26,68,1) 0%, rgba(18,18,18,1) 100%)',
            flexGrow: 1,
            paddingBottom: `${MINIPLAYER_HEIGHT + 16}px`,
            minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 4 }}>
            {['all', 'songs', 'podcasts'].map((option) => (
              <Box
                key={option}
                role="button"
                tabIndex={0}
                onClick={() => handleFilterChange(option)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleFilterChange(option);
                }}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  backgroundColor: (theme) =>
                    filter === option ? theme.palette.primary.light : theme.palette.background.card,
                  color: (theme) =>
                    filter === option ? theme.palette.common.white : theme.palette.text.secondary,
                  transition: theme.transitions.create(['background-color', 'color', 'transform'], {
                    duration: theme.transitions.duration.shorter,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  userSelect: 'none',
                }}
                aria-pressed={filter === option}
                aria-label={`Filter by ${option}`}
              >
                {option}
              </Box>
            ))}
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress color="primary" size={60} thickness={4.5} />
            </Box>
          ) : (
            <Fade in timeout={400}>
              <Box>
                {filter === 'all' && !searchQuery && (
                  <>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{
                        transition: theme.transitions.create('opacity'),
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      Trending Songs
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {trendingSongs.map((song) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={song.id}>
                          <MediaCard item={song} type="song" onPlay={handlePlaySong} isPlaying={isPlaying} isCurrentSong={currentSong?.id === song.id} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {filteredSongs.length > 0 && (
                  <>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{
                        transition: theme.transitions.create('opacity'),
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      All Songs
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {filteredSongs.map((song) => (
                        <Grid item xs={12} sm={6} md={3} lg={2} xl={1.5} key={song.id}>
                          <MediaCard item={song} type="song" onPlay={handlePlaySong} isPlaying={isPlaying} isCurrentSong={currentSong?.id === song.id} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {filter === 'all' && filteredArtists.length > 0 && (
                  <>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{
                        transition: theme.transitions.create('opacity'),
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      Artists
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {filteredArtists.map((artist) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5} key={artist.id}>
                          <Box onClick={() => handleArtistClick(artist.id)} sx={{ cursor: 'pointer' }}>
                            <MediaCard item={artist} type="artist" isPlaying={isPlaying} isCurrentSong={currentSong?.id === artist.id} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

                {filteredPodcasts.length > 0 && (
                  <>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{
                        transition: theme.transitions.create('opacity'),
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      Podcasts
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      {filteredPodcasts.map((podcast) => (
                        <Grid item xs={12} sm={6} md={3} lg={2} xl={1.5} key={podcast.id}>
                           <Box onClick={()=>handlePodcastClick(podcast.id)} sx={{ cursor: 'pointer' }}>
                          <MediaCard item={podcast} type="podcast" onPlay={handlePlaySong} isPlaying={isPlaying} isCurrentSong={currentSong?.id === podcast.id} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Box>
            </Fade>
          )}
        </Box>
      </Box>

      <MiniPlayer 
        song={currentSong} 
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
      />
      <Footer />
    </Box>
  );
}
