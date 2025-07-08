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
import { BACKEND_URL } from "@env";

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
      // setAIanswer(data);
      setAIanswer(data.results);
      setLoading(false);
    } catch (error) {
      console.error("질문 보내기를 실패하였습니다.", error.message);
      ToastAndroid.show("질문 보내기를 실패하였습니다.", ToastAndroid.SHORT);
      setLoading(false);
      return null;
    }
    /*
    setAIanswer({
      answer:
        "최근 5년 안에 나온 공포 영화 중에서 좋아하실 만한 작품들을 추천해 드릴게요. 이미 언급하신 영화들은 피해서 추천해 드리겠습니다.\r\n\r\n*   **유전 (Hereditary, 2018):** 가족의 숨겨진 비밀과 광기로 가득 찬 분위기가 압도적인 영화입니다. 초자연적인 공포와 심리적인 공포가 결합되어 깊은 인상을 남길 것입니다.\r\n*   **미드소마 (Midsommar, 2019):** 밝은 대낮을 배경으로 펼쳐지는 컬트적인 분위기의 영화입니다. 독특한 비주얼과 불안감을 조성하는 스토리텔링이 인상적입니다.\r\n*   **맨 (Men, 2022):** 알렉스 가랜드 감독의 작품으로, 심리적인 공포와 사회적인 메시지를 담고 있습니다. 독특한 연출과 배우들의 연기가 돋보입니다.\r\n*   **스마일 (Smile, 2022):** 미스터리한 미소와 연관된 연쇄적인 죽음을 다룬 영화입니다. 긴장감 넘치는 스토리와 예측 불가능한 전개가 매력적입니다.\r\n*   **톡 투 미 (Talk to Me, 2022):** 호주 공포 영화로, 젊은이들이 영혼과 접촉하는 게임을 통해 벌어지는 끔찍한 사건들을 다룹니다. 신선한 설정과 강렬한 비주얼이 돋보입니다.\r\n\r\n이 영화들이 마음에 드셨으면 좋겠습니다. 즐거운 영화 감상 되세요!\r\n",
    });
    */
    console.log(AIanswer);
    setLoading(false);
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
          AIanswer !== "" && (
            <Text>{AIanswer}</Text>
          )
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
    // justifyContent: "center",
    // alignItems: "center",
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
