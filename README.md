# MovieMoBa_front

몰입캠프 개발 1주차

무비뭐봐
|ㅁㅂ|
|ㅁㅂ|


탭1
-> 현재 상영중인 영화 리스트
리뷰 기능(평점)
영화 리스트가 쭉 나오고, 리스트의 개체를 눌렀을 때 한줄평과 평점이 함께 보이도록

탭2
-> 포스터 게시
포스터 밑에 간단히 제목과 평점만?

탭3(홈화면 가운데 배치)
영화 추천
(리뷰 많은 순/평점 높은 순)
탑 3를 게시


## 프로젝트 실행 방법

1. **Node.js 설치 확인** (`2025-06-24` 기준)
    
    설치된 **Node.js** 버전이 `v18` 미만인 경우, `ReadableStream`을 기본적으로 제공하지 않아 프로젝트가 실행되지 않습니다.

    원활한 사용을 위해 `v22.16.0`의 **Node.js**를 설치합니다. CMD를 **관리자 모드**로 실행한 뒤, 아래 명령어를 입력합니다.
    ```bash
    nvm install 22.16.0
    nvm use 22.16.0
    ```
    정상적으로 설정이 완료되면 아래 명령어로 버전을 확인할 수 있습니다.
    ```bash
    node -v
     # v22.16.0
    npm -v
     # 10.2.4
    ```

2. **Expo 설치하기**

    **Expo**는 React Native로 개발한 모바일 어플리케이션을 미리 실행하고 테스트할 수 있는 오픈 소스 플랫폼입니다. JavaScript 코드와 Markup/Styling 작성 후 바로 앱을 테스트해 볼 수 있습니다. 

    CMD에서 아래 명령어를 입력하여 **Expo**를 설치합니다. 
   ```bash
   npm install --global expo-cli         
        # Install the command line tools
    ```

    MAC 사용자의 경우: **watchman** 설치
    ```bash
    $ brew update
    $ brew install watchman
    ``` 

    테스트할 모바일 기기(Android/IOS)에 **Expo**(혹은 **Expo Go**)를 설치하고, 계정을 생성합니다. 

---

프로젝트 clone 후 아래 명령어를 입력하여 필요한 파일을 설치합니다. 

* 의존성 설치:

```
npm install
```

* Expo 로그인:
Expo 모바일 어플리케이션에서 생성한 계정으로 로그인합니다.

```
expo login
```


* 프로젝트 실행:

```
npx expo start
```

* 실제 기기에서 Expo Go 실행 후 QR 코드 스캔 혹은 현재 실행 중인 프로젝트 열기

