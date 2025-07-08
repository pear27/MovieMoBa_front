import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { TMDB_API_KEY, BACKEND_URL } from "@env";
import { useNavigation } from "@react-navigation/native";

const axios = require("axios");

var usedMovies = [];
var AI_recommend = [];
var movieComponents = [];

async function fetchMovieJsonList(titles) {
  const results = [];
  for (const movie of titles) {
    const title = movie.title;
    const year = movie.release_date;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${title}&language=ko-KR&year=${year}`;
    try {
      const resp = await axios.get(url);
      if (resp.data.results && resp.data.results.length > 0) {
        if (resp.data.results[0].title === title) {
          results.push(resp.data.results[0]);
          usedMovies.push(movie);
        }
      }
    } catch (err) {
      console.error(`error while finding ${title}`, err);
    }
  }
  return results;
}

function makeMovieComponents(AI_recommend, usedMovies, navigation) {
  for (let i = 0; i < AI_recommend.length; i++) {
    const movie = AI_recommend[i];
    const description = usedMovies[i].description;
    movieComponents.push(
      <TouchableOpacity
        key={movie.id}
        style={styles.showingMovie}
        onPress={() => navigation.navigate("Detail", { id: movie.id })}
      >
        <View style={styles.topContainer}>
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
        </View>
        <View style={styles.AiInfo}>
          <Text style={styles.aiInfoText}>
            모바의 한줄평 :{"\n"} {description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const AIScreen = () => {
  const navigation = useNavigation();

  const [userPrompt, setUserPrompt] = useState("");
  const [AIanswer, setAIanswer] = useState("");
  const [loading, setLoading] = useState(false);

  // post user prompt
  const handleUserPromptSubmit = async () => {
    setLoading(true);
    usedMovies = [];
    AI_recommend = [];
    movieComponents = [];
    if (userPrompt.trim() === "") {
      ToastAndroid.show("내용을 입력해주세요.", ToastAndroid.SHORT);
      return;
    }
    /** 프롬프트 백엔드에 보내는 코드 */
    try {
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userPrompt }),
      });
      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }
      console.log(`prompt: ${userPrompt}`);
      setUserPrompt("");

      /** 추천작은 텍스트로 나옴 */
      const resData = await response.json();
      console.log(resData);
      const data = resData.answer;
      //const data = response.answer;
      AI_recommend = await fetchMovieJsonList(data);
      if (AI_recommend.length > 0) {
        setAIanswer(AI_recommend[0]);
      } else {
        setAIanswer("다시 한번만 물어바!");
      }
      makeMovieComponents(AI_recommend, usedMovies, navigation);
      setLoading(false);
    } catch (error) {
      console.error("질문 보내기를 실패하였습니다.", error.message);
      ToastAndroid.show("질문 좀 잘해바,,", ToastAndroid.SHORT);

      setLoading(false);
      return null;
    }
    /** 여기서 바로 추천작 id를 받아올 수 있으면 해당 id로 TMDB에서 포스터, 제목, 연도 등 정보 fetch */
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.h1}>모바야, 나 오늘 무비 모바??</Text>
          <Text style={styles.h6}>
            모바에게 어떤 영화를 보고 싶은지 알려주세요!
          </Text>
          <View style={styles.userPromptForm}>
            <TextInput
              style={styles.userPromptInput}
              placeholder="(예) 몰입캠프에서 팀메이트 몰래 볼 영화를 추천해줘"
              placeholderTextColor="#b3b3b3"
              multiline
              value={userPrompt}
              onChangeText={setUserPrompt}
            />
            <Button
              title="모바한테 물어바"
              color="#e50914"
              style={styles.userPromptButton}
              onPress={handleUserPromptSubmit}
            />
          </View>
          {loading ? (
            <Text style={styles.h1}>LOADING....</Text>
          ) : (
            AIanswer !== "" && (
              <View style={styles.container}>
                <Text style={styles.h3}>모바픽 영화를 감상해보세요!</Text>
                {movieComponents}
              </View>
            )
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    backgroundColor: "#141414",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  h1: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 1,
  },
  h6: {
    fontSize: 20,
    color: "#b3b3b3", // 연한 회색
    marginVertical: 5,
    fontWeight: "500",
  },
  overview: {
    color: "#e5e5e5",
    textAlign: "justify",
    fontSize: 16,
    lineHeight: 24,
  },
  userPromptForm: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#222", // 다크 그레이
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userPromptInput: {
    backgroundColor: "#181818",
    color: "#fff",
    borderRadius: 6,
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  userPromptButton: {
    backgroundColor: "#e50914", // 레드
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  userPromptButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  showingMovie: {
    width: "100%",
    height: 440, // AiInfo 공간 포함
    backgroundColor: "#222",
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
    flexDirection: "column", // 세로 배치
  },
  topContainer: {
    flexDirection: "row",
    flex: 1,
  },
  poster: {
    height: 240,
    aspectRatio: 2 / 3,
    resizeMode: "cover",
    marginRight: 14,
    borderRadius: 6,
    borderWidth: 2,
  },
  movieInfo: {
    flex: 1,
    justifyContent: "center",
  },
  AiInfo: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "rgba(34, 34, 34, 0.92)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  aiInfoText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
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
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 2,
  },
  rating: {
    fontSize: 16,
    color: "#ffd700",
    fontWeight: "bold",
    marginTop: 6,
  },
});
