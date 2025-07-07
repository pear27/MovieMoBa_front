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

  const navigation = useNavigation();

  useEffect(() => {
    const fetchNowShowingMovies = async () => {
      try {
        // Now Playing Movie List
        const nowPlayingResponse = await fetch(
          `${baseURL}movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=KR&page=1`
        );
        setNowPlaying((await nowPlayingResponse.json()).results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchNowShowingMovies();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {nowPlaying.length !== 0 &&
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
                  {`★ ${movie.vote_average.toFixed(1)} (${movie.vote_count}명)`}
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
  },
  container: {
    flexDirection: "column",
  },
  showingMovie: {
    width: "100%",
    height: 120,
    // backgroundColor: "#f0f0f0",
    marginBottom: 5,
    flexDirection: "row", // 가로 정렬
  },
  poster: {
    height: "100%",
    aspectRatio: 2 / 3, // TMDb 포스터 일반 비율
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 4,
  },
  movieInfo: {
    flex: 1, // 가로 공간 제한
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  originalTitle: {},
  rating: {},
});
