import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  ToastAndroid,
} from "react-native";

const AIScreen = () => {
  const [userPrompt, setUserPrompt] = useState("");

  // post user prompt
  const handleUserPromptSubmit = () => {
    if (userPrompt.trim() === "") {
      ToastAndroid.show("내용을 입력해주세요.", ToastAndroid.SHORT);
      return;
    }
    /** 프롬프트 백엔드에 보내는 코드 */
    console.log(`prompt: ${userPrompt}`);
    setUserPrompt("");
    /** 여기서 바로 추천작 id를 받아올 수 있으면 해당 id로 TMDB에서 포스터, 제목, 연도 등 정보 fetch */
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.h1}>어떤 영화를 추천해드릴까요?</Text>
        <Text style={styles.h6}>
          생성형 AI가 입력하신 정보와 취향을 분석해, 꼭 맞는 영화를
          찾아드립니다.
        </Text>
        <View style={styles.userPromptForm}>
          <TextInput
            style={styles.userPromptInput}
            placeholder="(예) 입문하기 좋은 공포 영화를 추천해주세요."
            multiline
            value={userPrompt}
            onChangeText={setUserPrompt}
          />
          <Button
            title="등록"
            style={styles.userPromptButton}
            onPress={handleUserPromptSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AIScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  h6: {
    fontSize: 20,
    marginVertical: 5,
  },
  userPromptForm: {
    width: "100%",
    marginVertical: 5,
  },
  userPromptInput: {},
  userPromptButton: {},
});
