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
import { TMDB_API_KEY, BACKEND_URL } from "@env";
import LoadingAnimation from "../components/LoadingAnimation";

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;

const DetailScreen = ({ route }) => {
  const { id } = route.params;

  const [movieDetail, setMovieDetail] = useState([]);
  const [jsonMovieDetail, setjsonMovieDetail] = useState(false);

  const [starRating, setStarRating] = useState(0); // 0 ~ 10
  const stars = [];

  const [review, setReview] = useState("");
  const [reviewUploading, setReviewUploading] = useState(false);

  const [reviewList, setReviewList] = useState([]);
  const [jsonReviewList, setjsonReviewList] = useState(false);
  // backend server에서 불러온 reviews

  // fetch review list
  const fetchReviewList = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/reviews/${movieDetail.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`리뷰 불러오기 실패: ${response.status}`);
      }

      setReviewList(await response.json());
      setjsonReviewList(true);
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
  const handleReviewSubmit = async () => {
    setReviewUploading(true);

    /** 사용자가 내용을 입력하지 않은 경우 */
    if (review.trim() === "") {
      ToastAndroid.show("내용을 입력해주세요.", ToastAndroid.SHORT);
      setReviewUploading(false);
      return;
    }

    const reviewData = {
      movieID: id,
      comment: review,
      rating: starRating,
    };

    try {
      const response = await fetch(`${BACKEND_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) {
        throw new Error(`리뷰 등록 실패: ${response.status}`);
      }

      console.log(`star:${starRating}, review:${review}, movieID:${id}`);
      ToastAndroid.show("리뷰가 등록되었습니다.", ToastAndroid.SHORT);
      setReview("");
      setStarRating(0);
      setReviewUploading(false);
      fetchReviewList();
    } catch (error) {
      console.error("리뷰 등록에 실패하였습니다.", error.message);
      ToastAndroid.show("리뷰 등록에 실패하였습니다.", ToastAndroid.SHORT);
      setReviewUploading(false);
      return null;
    }
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
    fetchMovie();
    if (movieDetail.id) {
      fetchReviewList();
    }
  }, [movieDetail]);

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
              <Text style={styles.originalTitle}>
                {movieDetail.original_title}
              </Text>
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
            <Text style={styles.overview}>{`별점: ${starRating}점`}</Text>
          </View>
          <TextInput
            className="review-input"
            style={styles.reviewInput}
            placeholder="리뷰를 작성해주세요"
            placeholderTextColor="#fff"
            multiline
            value={review}
            onChangeText={setReview}
          />
          <Button
            title={reviewUploading ? "LOADING" : "등록"}
            color="#e50914"
            style={styles.reviewButton}
            onPress={handleReviewSubmit}
            disabled={reviewUploading}
          />
        </View>
        <View style={styles.reviewList}>
          {jsonReviewList ? (
            reviewList.map((review) => (
              <View key={review.createdAt} style={styles.review}>
                <View style={{ flexDirection: "row" }}>
                  {reviewStar(review.rating)}
                </View>
                <Text style={styles.overview}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingAnimation
                text="리뷰 불러오는 중"
                style={styles.loading}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 90,
    backgroundColor: "#141414",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#141414",
  },
  loading: {
    color: "#ddd",
    fontSize: 18,
  },
  backdrop: {
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "cover",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 0,
  },
  movieInfo: {
    padding: 20,
    backgroundColor: "#222", // 카드 느낌의 다크 그레이
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: -32, // 백드롭과 자연스럽게 겹치게
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 4,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  originalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 4,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  voteAverage: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 6,
  },
  description: {
    paddingTop: 12,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingBottom: 5,
  },
  overview: {
    color: "#e5e5e5",
    textAlign: "justify",
    fontSize: 16,
    lineHeight: 24,
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
    padding: 16,
    backgroundColor: "#222",
    borderRadius: 10,
    margin: 12,
  },
  reviewInput: {
    backgroundColor: "#181818",
    color: "#fff",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  reviewButton: {
    backgroundColor: "#e50914",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
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
    borderBottomColor: "#333",
  },
});
