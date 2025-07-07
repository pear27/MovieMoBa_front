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
import { TUNNEL_BACKEND_URL } from "@env";

const BACKEND_URL = "https://icy-things-cross.loca.lt";

const AIScreen = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [AIanswer, setAIanswer] = useState("");

  const [loading, setLoading] = useState(false);

  // post user prompt
  const handleUserPromptSubmit = async () => {
    setLoading(true);
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
      const data = await response.json();
      setAIanswer(data);
      setLoading(false);
    } catch (error) {
      console.error("질문 보내기를 실패하였습니다.", error.message);
      ToastAndroid.show("질문 보내기를 실패하였습니다.", ToastAndroid.SHORT);
      setLoading(false);
      return null;
    }
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
        {loading ? (
          <Text>LOADING</Text>
        ) : (
          AIanswer !== "" && <Text>{AIanswer.answer}</Text>
        )}
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
