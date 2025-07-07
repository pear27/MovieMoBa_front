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
import { TMDB_API_KEY, TUNNEL_BACKEND_URL } from "@env";

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = TMDB_API_KEY;
const BACKEND_URL = TUNNEL_BACKEND_URL;

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
      const response = await fetch(`${BACKEND_URL}reviews/${movieDetail.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`리뷰 불러오기 실패: ${response.status}`);
      }

      setReviewList(await response.json());
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
    /** 사용자가 내용을 입력하지 않은 경우 */
    if (review.trim() === "") {
      ToastAndroid.show("내용을 입력해주세요.", ToastAndroid.SHORT);
      return;
    }

    const reviewData = {
      movieID: id,
      comment: review,
      rating: starRating,
    };

    /** 리뷰 백엔드에 보내는 코드 */
    try {
      const response = await fetch(`${BACKEND_URL}reviews`, {
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
      fetchReviewList();
    } catch (error) {
      console.error("리뷰 등록에 실패하였습니다.", error.message);
      ToastAndroid.show("리뷰 등록에 실패하였습니다.", ToastAndroid.SHORT);
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
              <View key={review.createdAt} style={styles.review}>
                <View style={{ flexDirection: "row" }}>
                  {reviewStar(review.rating)}
                </View>
                <Text>{review.comment}</Text>
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
