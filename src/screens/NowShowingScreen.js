import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { TMDB_API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;

const NowShowingScreen = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [jsonnowPlaying, setjsonNowPlaying] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Now Playing Movie List
        const nowPlayingResponse = await fetch(
          `${baseURL}movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=KR&page=1`
        );
        setNowPlaying((await nowPlayingResponse.json()).results);
        setjsonNowPlaying(true);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {jsonnowPlaying &&
          nowPlaying.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.showingMovie}
              onPress={() => navigation.navigate("Detail", { id: movie.id })}
            >
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
                }}
                style={styles.poster}
              />
              <View style={styles.movieInfo}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.originalTitle}>{movie.original_title}</Text>
                <Text style={styles.rating}>
                  {`★ ${movie.vote_average.toFixed(1)} `}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default NowShowingScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 12,
    backgroundColor: "#141414", // 넷플릭스 다크 배경
  },
  container: {
    flexDirection: "column",
    backgroundColor: "#141414",
  },
  showingMovie: {
    width: "100%",
    height: 140,
    backgroundColor: "#222", // 카드 느낌의 다크 그레이
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    height: "100%",
    aspectRatio: 2 / 3,
    resizeMode: "cover",
    marginRight: 14,
    borderRadius: 6,
    borderWidth: 2,
  },
  movieInfo: {
    flex: 1,
    flexShrink: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
    marginBottom: 4,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  originalTitle: {
    fontSize: 14,
    color: "#b3b3b3",
    marginBottom: 2,
  },
  rating: {
    fontSize: 16,
    color: "#ffd700",
    fontWeight: "bold",
    marginTop: 6,
  },
});

