import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  ToastAndroid,
} from "react-native";
import { TMDB_API_KEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;

const SurveyScreen = () => {
  const [movieGroups, setMovieGroups] = useState([]);

  const [step, setStep] = useState(0); // 0: movies1, 1: movies2, 2: movies3
  const scrollRef = useRef(null);

  const [likeMovies, setLikeMovies] = useState([]);

  const navigation = useNavigation();

  // fetch movies for survey
  const getMoviesForSurvey = async () => {
    let page = 1;
    const moviesForSurvey = [];

    // 5년 전 날짜
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);
    const formattedDate = fiveYearsAgo.toISOString().split("T")[0]; // yyyy-mm-dd 형식으로 포맷

    while (moviesForSurvey.length < 30) {
      // discover API 호출: 최근 10년간 인기 영화 (sort_by=popularity)
      const discoverResponse = await fetch(
        `${baseURL}discover/movie?api_key=${API_KEY}&language=en&sort_by=popularity.desc&vote_count.gte=100&primary_release_date.gte=${formattedDate}&page=${page}`
      );

      // 영화 리스트 추출
      const data = await discoverResponse.json();
      const movieList = data.results;

      // 각 영화에 대해 release_dates 확인
      for (const movie of movieList) {
        if (movie.overview && movie.overview.trim() !== "") {
          moviesForSurvey.push(movie);
        }

        // 30편이 모이면 종료
        if (moviesForSurvey.length >= 30) break;
      }
      page++;
      if (page > data.total_pages) break;
    }
    devideMovies(moviesForSurvey);
  };

  // devide movies into three groups
  const devideMovies = (moviesArray) => {
    setMovieGroups([]);
    if (moviesArray.length > 0) {
      const chunked = [];
      for (let i = 0; i < moviesArray.length; i += 10) {
        chunked.push(moviesArray.slice(i, i + 10));
      }
      setMovieGroups(chunked);
    }
  };

  // post "like movies"
  const handleLikeMoviesSave = async () => {
    try {
      await AsyncStorage.setItem("likeMovies", JSON.stringify(likeMovies));
      ToastAndroid.show("영화 목록이 등록되었습니다.", ToastAndroid.SHORT);
      console.log("설문 완료 상태 저장됨");
      navigation.navigate("Tabs", { screen: "추천작" });
    } catch (error) {
      console.error("영화 목록 저장에 실패하였습니다.", error.message);
      ToastAndroid.show("영화 목록 저장에 실패하였습니다.", ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    getMoviesForSurvey();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} ref={scrollRef}>
      <View style={styles.container}>
        <Text style={styles.h6}>
          최근 10년간의 인기 영화 중 마음에 들었던 작품을 3~4편 선택해주세요.
        </Text>
        <View style={styles.posterContainer}>
          {movieGroups[step] &&
            movieGroups[step].map((movie) => {
              const isLiked = likeMovies.some((liked) => liked.id === movie.id);
              const currentStepLikes = likeMovies.filter((liked) =>
                movieGroups[step].some(
                  (groupMovie) => groupMovie.id === liked.id
                )
              );
              const isDisabled = !isLiked && currentStepLikes.length >= 4;
              return (
                <TouchableOpacity
                  key={movie.id}
                  style={styles.movie}
                  onPress={() => {
                    if (isLiked) {
                      // 배열에서 제거
                      setLikeMovies((prev) =>
                        prev.filter((m) => m.id !== movie.id)
                      );
                    } else if (currentStepLikes.length < 4) {
                      // 배열에 추가
                      setLikeMovies((prev) => [...prev, movie]);
                    }
                  }}
                  disabled={isDisabled}
                >
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
                    }}
                    style={{
                      width: "100%",
                      aspectRatio: 2 / 3,
                      resizeMode: "cover",
                      borderRadius: 8,
                      opacity: isLiked ? 0.3 : 1,
                    }}
                  />
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                </TouchableOpacity>
              );
            })}
          {movieGroups[step] &&
            likeMovies.filter((m) =>
              movieGroups[step].some((groupMovie) => groupMovie.id === m.id)
            ).length >= 3 &&
            step < movieGroups.length - 1 && (
              <Button
                title="다음"
                color="#e50914"
                onPress={() => {
                  setStep((prev) => prev + 1);
                  scrollRef.current?.scrollTo({ y: 0, animated: true });
                }}
              />
            )}

          {movieGroups[step] &&
            likeMovies.filter((m) =>
              movieGroups[step].some((groupMovie) => groupMovie.id === m.id)
            ).length >= 3 &&
            step === movieGroups.length - 1 && (
              <Button
                title="완료"
                color="#e50914"
                onPress={handleLikeMoviesSave}
              />
            )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SurveyScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    backgroundColor: "#141414", // 넷플릭스 다크 배경
    minHeight: "100%",
  },
  container: {
    backgroundColor: "#141414",
    borderRadius: 12,
    paddingBottom: 32,
    paddingHorizontal: 4,
  },
  posterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  movie: {
    width: "47%",
    marginBottom: 18,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#232323", // 카드 느낌의 다크 그레이
    // 그림자 효과 (iOS/Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 5,
    alignItems: "center",
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    resizeMode: "cover",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#444",
  },
  movieTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 2,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  selectedPoster: {
    opacity: 0.3,
  },
  h6: {
    fontSize: 20,
    color: "#fff", // 연한 회색
    marginVertical: 5,
    fontWeight: "500",
  },
});
