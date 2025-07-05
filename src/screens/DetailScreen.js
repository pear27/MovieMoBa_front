import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { TMDB_API_KEY } from "@env";

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;
const BACKEND_URL = "realBACKENDurl"; // backend url 입력하기

const DetailScreen = ({ route }) => {
  const { id } = route.params;

  const [movieDetail, setMovieDetail] = useState([]);
  const [jsonMovieDetail, setjsonMovieDetail] = useState(false);

  const [starRating, setStarRating] = useState(0); // 0 ~ 10
  const stars = [];

  const [review, setReview] = useState("");

  const [reviewList, setReviewList] = useState([]);
  // backend server에서 불러온 reviews

  // fetch review list
  const fetchReviewList = async () => {
    try {
      /*
      const response = await axios.get(`${BACKEND_URL}/posts/list`, {
        params: { type: sortOption },
      });*/

      // setPosts(response.data); // 성공적으로 데이터를 받으면 반환
      setReviewList([
        // 예시 자료
        {
          content: "스토리가 탄탄해서 몰입감 최고!",
          rating: 9,
          time: 1720080000,
        },
        {
          content: "배우들의 연기가 인상적이었어요.",
          rating: 8,
          time: 1720076400,
        },
        {
          content: "생각보다 별로였음.. 기대 이하",
          rating: 5,
          time: 1720072800,
        },
        {
          content: "마지막 반전이 정말 소름 돋았어요",
          rating: 10,
          time: 1720069200,
        },
        {
          content: "잔잔하지만 여운이 남는 영화였어요.",
          rating: 8,
          time: 1720065600,
        },
        {
          content: "전개가 너무 느려서 좀 지루했어요",
          rating: 6,
          time: 1720062000,
        },
        { content: "CG랑 음악이 환상적이에요!", rating: 9, time: 1720058400 },
        {
          content: "아이들과 함께 보기 좋은 영화",
          rating: 7,
          time: 1720054800,
        },
        {
          content: "너무 감동적이어서 눈물 났어요ㅠ",
          rating: 10,
          time: 1720051200,
        },
        { content: "평범한 스토리, 무난한 연출", rating: 6, time: 1720047600 },
      ]);
    } catch (error) {
      console.error("Error fetching review list:", error);
      setReviewList([]);
    }
  };

  const StarRating = () => {
    for (let i = 1; i <= 10; i++) {
      const isLeft = i % 2 === 1;
      const isActive = i <= starRating;

      const source = isActive
        ? isLeft
          ? require("../icons/left-star-icon.png")
          : require("../icons/right-star-icon.png")
        : isLeft
        ? require("../icons/left-star-gray-icon.png")
        : require("../icons/right-star-gray-icon.png");

      stars.push(
        <TouchableOpacity
          style={styles.view}
          key={i}
          onPress={() => setStarRating(i)}
        >
          <Image source={source} style={styles.star} />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const reviewStar = (rating) => {
    const stars = [];

    for (let i = 1; i <= 10; i++) {
      const isLeft = i % 2 === 1;
      const isActive = i <= rating;

      const source = isActive
        ? isLeft
          ? require("../icons/left-star-icon.png")
          : require("../icons/right-star-icon.png")
        : isLeft
        ? require("../icons/left-star-gray-icon.png")
        : require("../icons/right-star-gray-icon.png");

      stars.push(<Image key={i} source={source} style={styles.reviewStar} />);
    }
    return stars;
  };

  // post review
  const handleReviewSubmit = () => {
    /** 사용자가 내용을 입력하지 않은 경우 */
    if (review.trim() === "") {
      ToastAndroid.show("내용을 입력해주세요.", ToastAndroid.SHORT);
      return;
    }
    /** 리뷰 백엔드에 보내는 코드 */
    console.log(`star:${starRating}, review:${review}, movieID:${id}`);
    ToastAndroid.show("리뷰가 등록되었습니다.", ToastAndroid.SHORT);
    setReview("");
    setStarRating(0);
    fetchReviewList();
  };

  // fetch movie detail
  const fetchMovie = async () => {
    try {
      // Selected Movie Detail
      const movieResponse = await fetch(
        `${baseURL}movie/${id}?api_key=${API_KEY}&language=ko-KR`
      );
      setMovieDetail(await movieResponse.json());
      setjsonMovieDetail(true);
    } catch (error) {
      console.error("Error fetching a movie:", error);
    }
  };

  useEffect(() => {
    fetchReviewList();
    fetchMovie();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {jsonMovieDetail && (
          <View>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movieDetail.backdrop_path}`,
              }}
              style={styles.backdrop}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movieDetail.title}</Text>
              <Text>{movieDetail.original_title}</Text>
              <Text
                style={styles.voteAverage}
              >{`★ ${movieDetail.vote_average.toFixed(1)} (${
                movieDetail.vote_count
              }명)`}</Text>
              <View style={styles.description}>
                {movieDetail.tagline.trim() !== "" && (
                  <Text style={styles.tagline}>{movieDetail.tagline}</Text>
                )}
                {movieDetail.overview.trim() !== "" && (
                  <Text style={styles.overview}>{movieDetail.overview}</Text>
                )}
              </View>
            </View>
          </View>
        )}
        <View style={styles.reviewForm}>
          <View style={styles.starRating}>
            <View style={styles.starContainer}>{StarRating()}</View>
            <Text>{`별점: ${starRating}점`}</Text>
          </View>
          <TextInput
            className="review-input"
            style={styles.reviewInput}
            placeholder="리뷰를 작성해주세요"
            multiline
            value={review}
            onChangeText={setReview}
          />
          <Button
            title="등록"
            style={styles.reviewButton}
            onPress={handleReviewSubmit}
          />
        </View>
        {reviewList.length !== 0 && (
          <View style={styles.reviewList}>
            {reviewList.map((review) => (
              <View key={review.time} style={styles.review}>
                <View style={{ flexDirection: "row" }}>
                  {reviewStar(review.rating)}
                </View>
                <Text>{review.content}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 90 },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  backdrop: {
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
  },
  movieInfo: {
    padding: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  voteAverage: {
    fontSize: 16,
  },
  description: {
    paddingTop: 12,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
  },
  overview: {
    textAlign: "justify",
  },
  starRating: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  star: {
    width: 20,
    height: 40,
    resizeMode: "contain",
    margin: 0,
  },
  reviewForm: {
    padding: 12,
  },
  reviewInput: {},
  reviewButton: {},
  reviewList: {
    padding: 12,
  },
  reviewStar: {
    width: 10,
    height: 20,
    resizeMode: "contain",
    margin: 0,
  },
  review: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
});
