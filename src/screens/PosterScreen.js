import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { TMDB_API_KEY, BACKEND_URL } from "@env";
import genresData from "../constants/genres.json"; // 경로는 프로젝트 구조에 따라 다름

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;

const genres = genresData.genres;

const PosterScreen = () => {
  const [likeMovies, setLikeMovies] = useState([]);
  const [likeMoviesDetail, setLikeMoviesDetail] = useState([]);
  const [surveyCompleted, setSurveyCompleted] = useState(null);

  const navigation = useNavigation();

  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [howAboutMovies, setHowAboutMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topReviewedMovies, setTopReviewedMovies] = useState([]);

  // 영화 취향 설문 참여 여부 반환 함수 (boolean)
  const loadSurveyStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("likeMovies");
      setLikeMovies(value);
      return value !== null;
    } catch (error) {
      console.error("❌ 설문 상태 불러오기 실패:", error);
      return false;
    }
  };

  // 사용자가 선호한 영화의 Detail Fetching (영문 ver)
  // 결과값 likeMoviesDetails에 저장함
  const getLikeMoviesDetail = async () => {
    try {
      const detailedMovies = [];
      const parsedMovies =
        typeof likeMovies === "string" ? JSON.parse(likeMovies) : likeMovies;

      for (const movie of parsedMovies) {
        // console.log(`movie id: ${movie.id}`);
        try {
          const response = await fetch(
            `${baseURL}movie/${movie.id}?api_key=${API_KEY}&language=en`
          );
          const result = await response.json();
          detailedMovies.push(result);
        } catch (error) {
          console.error(`❌ Fetch 실패 (${movie.id}):`, error);
        }
      }

      setLikeMoviesDetail(detailedMovies);
      return detailedMovies;
    } catch (error) {
      console.error("⚠️ 전체 상세 정보 로딩 실패:", error);
    }
  };

  // 좋아하는 영화와 비슷한 영화
  const getRecommendedMovies = async (likeMoviesDetail) => {
    try {
      if (!likeMoviesDetail || likeMoviesDetail.length === 0) {
        console.warn("likeMoviesDetail이 없습니다.");
        return;
      }
      const response = await fetch(`${BACKEND_URL}/movies/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movies: likeMoviesDetail }),
      });

      const result = await response.json();

      // yourTop3Movies와 유사한 영화 불러오기
      const allSimilars = [];

      await Promise.all(
        result.map(async (movie) => {
          try {
            const response = await fetch(
              `${baseURL}movie/${movie.movie.id}/similar?api_key=${API_KEY}&language=ko-KR`
            );

            const similars = (await response.json()).results;
            allSimilars.push(...similars.slice(0, 2));
          } catch (error) {
            console.error("Fail to fetch similar movies", error);
          }
        })
      );

      setRecommendedMovies(allSimilars);
    } catch (error) {
      console.error("❌ Recommended Movies Fetching 실패", error);
    }
  };

  // 도전해 볼 만한 영화
  const getHowAboutMovies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/movies/howabout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      const genres_like = result.like;
      const genres_soso = result.soso;

      const moviesWithGenres = [];

      let like_id_list = [];
      let soso_id_list = [];

      for (const soso of genres_soso) {
        for (const like of genres_like) {
          let like_id, soso_id;

          for (const genreJson of genres) {
            if (genreJson.name === like[0]) {
              like_id = genreJson.id;
              like_id_list.push(like_id);
            }
            if (genreJson.name === soso[0]) {
              soso_id = genreJson.id;
              soso_id_list.push(soso_id);
            }
          }
          if (like_id && soso_id) {
            try {
              const response = await fetch(
                `${baseURL}discover/movie?api_key=${API_KEY}&with_genres=${like_id},${soso_id}&language=ko-KR&sort_by=popularity.desc`
              );
              const result = await response.json();
              moviesWithGenres.push(result.results[0]);
            } catch (error) {
              console.error("장르 기반 fetching 실패: ", error);
            }
          } else {
            console.warn(
              "유효한 장르 ID가 없습니다. like_id:",
              like_id,
              "soso_id:",
              soso_id
            );
          }
        }
      }

      if (like_id_list.length > 0 && soso_id_list.length > 0) {
        try {
          const response = await fetch(
            `${baseURL}discover/movie?api_key=${API_KEY}&with_genres=${soso_id_list[0]},${soso_id_list[1]}&without_genres=${like_id_list[0]},${like_id_list[1]}&language=ko-KR&sort_by=popularity.desc`
          );
          const result = await response.json();
          moviesWithGenres.push(result.results[0]);
          moviesWithGenres.push(result.results[1]);
        } catch (error) {
          console.error("장르 기반 fetching 실패: ", error);
        }
      } else {
        console.warn(
          "유효한 장르 ID가 없습니다. like_id:",
          like_id_list[0],
          like_id_list[1],
          "soso_id:",
          soso_id_list[0],
          soso_id_list[1]
        );
      }

      setHowAboutMovies((prev) => [...prev, ...moviesWithGenres]);
    } catch (error) {
      console.error("howabout genres fetching 실패", error);
    }
  };

  // 평점 가장 높은 영화 fetching 함수 (완료)
  const fetchTopRatedMovies = async () => {
    try {
      const response = await fetch(
        `${baseURL}movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=1`
      );

      const result = await response.json();
      setTopRatedMovies(result.results);
    } catch (error) {
      console.error("❌ Top 6 평점 영화 가져오기 실패:", error);
    }
  };

  // 리뷰 많은 순 (완료)
  const fetchTopReviewedMovies = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/top6`, {
        method: "GET",
      });

      const result = await response.json();

      result.map(async (movie) => {
        try {
          const response = await fetch(
            `${baseURL}movie/${movie._id}?api_key=${API_KEY}&language=ko-KR`
          );

          const result = await response.json();
          setTopReviewedMovies((prev) => [...prev, result]);
        } catch (error) {
          console.error(
            `리뷰 많은 영화 상세 정보 fetching 실패(${movie._id}): `,
            error
          );
        }
      });
    } catch (error) {
      console.error("❌ Top 6 리뷰 영화 가져오기 실패:", error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      const value = await loadSurveyStatus();
      setSurveyCompleted(value);

      // 이후 setLikeMovies()가 끝나야 아래 실행됨
      const parsedMovies =
        typeof value === "string" ? JSON.parse(value) : likeMovies;

      if (parsedMovies.length > 0) {
        const detailed = await getLikeMoviesDetail();
        await getRecommendedMovies(detailed);
        getHowAboutMovies();
        fetchTopRatedMovies();
        fetchTopReviewedMovies();
      }
    };

    init();
  }, [likeMovies]);

  const navigateToSurvey = async () => {
    try {
      await AsyncStorage.removeItem("likeMovies");
      setSurveyCompleted(false);
      console.log("영화 목록 삭제 완료");
      navigation.navigate("Survey");
    } catch (error) {
      console.error("영화 목록 삭제를 실패하였습니다.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {surveyCompleted === null ? (
        <Text>LOADING</Text>
      ) : surveyCompleted ? (
        <View style={styles.container}>
          <View>
            <Text>좋아하실 만한 영화</Text>
            <View style={styles.posterContainer}>
              {recommendedMovies.length !== 0 &&
                recommendedMovies.map((movie) => (
                  <View style={styles.movie} key={`1_${movie.id}`}>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
                      }}
                      style={styles.poster}
                    />
                    <Text>{movie.title}</Text>
                  </View>
                ))}
            </View>
          </View>
          <View>
            <Text>도전해 볼 만한 영화</Text>
            <View style={styles.posterContainer}>
              {howAboutMovies.length !== 0 &&
                howAboutMovies.slice(0, 6).map((movie) => (
                  <View style={styles.movie} key={`1_${movie.id}`}>
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
                      }}
                      style={styles.poster}
                    />
                    <Text>{movie.title}</Text>
                  </View>
                ))}
            </View>
          </View>
          <View>
            <Text>평점 높은 영화</Text>
            <View style={styles.posterContainer}>
              {topRatedMovies.length !== 0 &&
                topRatedMovies.slice(0, 6).map((movie) => (
                  <TouchableOpacity
                    key={`3_${movie.id}`}
                    style={styles.movie}
                    onPress={() =>
                      navigation.navigate("Detail", { id: movie.id })
                    }
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
                      }}
                      style={styles.poster}
                    />
                    <Text>{movie.title}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          <View>
            <Text>리뷰 많은 영화</Text>
            <View style={styles.posterContainer}>
              {topReviewedMovies.length !== 0 &&
                topReviewedMovies.slice(0, 6).map((movie) => (
                  <TouchableOpacity
                    key={`4_${movie.id}`}
                    style={styles.movie}
                    onPress={() =>
                      navigation.navigate("Detail", { id: movie.id })
                    }
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
                      }}
                      style={styles.poster}
                    />
                    <Text>{movie.title}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      ) : (
        <View>
          <Text>좋아하실 만한 영화를 추천해 드릴게요!</Text>
        </View>
      )}
      <Button
        title="영화 취향 찾기"
        style={styles.surveyButton}
        onPress={navigateToSurvey}
      />
    </ScrollView>
  );
};

export default PosterScreen;

const styles = StyleSheet.create({
  container: {},
  posterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  movie: {
    width: "32%",
    paddingVertical: 5,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    resizeMode: "cover",
    borderRadius: 8,
  },
});
