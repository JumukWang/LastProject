![스크린샷 2022-08-01 20 43 59](https://user-images.githubusercontent.com/96240712/182506934-208475f8-70c1-408e-819d-a25d5b425551.png)
# E-GLOO ⛄️
#### E-GLOO는 바쁜 일상 밖에 나가기 어렵거나 힘들때 집에서 간편하게 즐길 수 있는 온라인 스터디 카페입니다.

## E-GLOO 보러가기 🏃‍♂️ : https://www.egloo.link

## E-GLOO 아키텍처 🌈
![스크린샷 2022-08-01 14 24 02](https://user-images.githubusercontent.com/96240712/182083770-a15da7a1-6479-4107-adf0-c48557eacc0f.png)

## E-GLOO 핵심기능 🛠

#### 최대 4명의 유저간의 실시간 화상채팅 및 실시간 채팅 기능 👨‍👨‍👦‍👦

#### 일주일 단위의 공부시간 그래프 표기 📈

#### 스터디룸 공개방 비밀방 기능 🚪

#### 마이페이지 호스트 룸 참여 룸 찜한 룸 확인 가능 🍀

#### 화상 채팅방 내에서 TO-DO LIST 작성 📚

#### 채팅방 타이머로 오늘 공부한 시간 체크 ✔️


## E-GLOO 백엔드 기술스택 🧑‍💻
<div align = "center">
<p align = "center">
<img src="https://img.shields.io/badge/nodeJS-339933?style=for-the-badge&logo=nodeJS&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white">
<br>
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/JSONWebTokens-2496ED?style=for-the-badge&logo=JSONWebTokens&logoColor=white">
<img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
<br>
<img src="https://img.shields.io/badge/githubaction-2088FF?style=for-the-badge&logo=githubaction&logoColor=white">
<img src="https://img.shields.io/badge/socketio-010101?style=for-the-badge&logo=socketio&logoColor=white">
<img src="https://img.shields.io/badge/aws-232F3E?style=for-the-badge&logo=aws&logoColor=white">
<img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">
<br>
<img src="https://img.shields.io/badge/babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">

<p>
</div>


## E-GLOO 트러블슈팅 ❌
  - 문제상황

TimeStamp로 시간을 비교하여 타이머를 구현하는 과정에서 UTC와 KST의 시간차이로 인해 9시간의 갭이 발생하였습니다. 또한 로컬환경에서는 KST시간으로 자바스크립트에서 Day를 불러오지만 새로 개설한 AWS 인스턴스 환경에서는 UTC시간으로 읽혀서 시간 갭으로 인해 0시 기준으로 Day가 초기화되지 않는 오류가 발생하였습니다. 

- 해결방안
1. today start함수를 지정하여 UTC시간으로 날마다 갱신되는 오늘의 시작날짜와 시간을 정했습니다. 

[![Untitled](https://user-images.githubusercontent.com/102012411/182850308-95c6f355-3892-4b45-b02e-fe02dcd57ca1.png)](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7420419c-4337-41b5-841a-3b2c70715770/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220804%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220804T124738Z&X-Amz-Expires=86400&X-Amz-Signature=fcb7a8a61abd9d680bd7a83c03d17e513dffe05c3e33df6b56a131ed47a9f78a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

2. UTC기준으로 측정되어 있는 것이므로 KST시간으로 변경하기 위해 -9을 해준 후 오늘과 내일 TimeStamp의 차이에 있는 시간대를 불러왔습니다. 또한 todayStart함수를 조정하여 UTC시간 기준으로 매일이 바뀌게 설정하였습니다. 

https://s3.us-west-2.amazonaws.com/secure.notion-static.com/14bcc76d-ef19-4b18-80b0-ec075073d82e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220804%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220804T124928Z&X-Amz-Expires=86400&X-Amz-Signature=25d3f69db2d1eca879176cbf79ec127a808977ecd38abaf2e03bc568d1b81597&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject

3. 시간대 변경에 따른 로컬환경에서 new Date()의 변화를 확인 할 수 있었습니다.  AWS 인스턴스  환경에서의 시간대는 UTC기준이고 자바스크립트 내의 함수에서는 KST기준으로 작동하기 때문에 결국 0시에 Day가 초기화 되는 것이 아닌 오전9시에 Day가 초기화 되는 것을 확인 할 수 있었습니다.  

https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a795b7b6-009c-4253-bc5f-e42ebbe28f27/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220804%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220804T125028Z&X-Amz-Expires=86400&X-Amz-Signature=65d68a17412d7fcb09545f8a495c26afe61dd9cd8f8885bec65cf7d222148abc&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject

https://s3.us-west-2.amazonaws.com/secure.notion-static.com/fe8109d1-cf37-472a-9462-36ab6048b969/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220804%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220804T125046Z&X-Amz-Expires=86400&X-Amz-Signature=a64422180b63b88a73a5e3c5bc9f5665c8e79e6bfc72994ef083819d963fa073&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject

4. 결국 자바스크립트내에서는 todaystart을 통해 KST시간대로 고정한 상태에서 AWS인스턴스 시간대를 KST로 변경하는 방법을 찾아보았습니다. 그리고 —root 계정으로 접속 후 시간대를 KST시간대로 변경하니 오전9시에 초기화되었던 문제를 해결 할 수 있었습니다.  또한 이를 통해 그래프에서 시간조회 시 12시가 지나도 Day가 넘어가지 않았던 문제까지 같이 해결 할 수 있었습니다.  

- 개선사항

AWS 인스턴스 환경에서의 시간대 역시 자연스럽게 KST라고 생각하는 바람에 왜 자꾸 시간차이 오류가 발생하는 지 파악하기가 어려웠습니다. 그래서 혼자 PostMan으로 실험하였을 때랑 배포하였을 때 차이가 생기는 것에 대해 이해하지 못했습니다. 이번 트러블슈팅을 통해 local 환경과 인스턴스환경의 차이에 대해서 항상 염두해 두어야 겠다고 생각했습니다.
## E-GLOO 백엔드 팀원소개 👨‍👨‍👦

|이미지|![4ffcfac596ce78b6359f6703e5ffe57e](https://user-images.githubusercontent.com/107375500/182104419-9c0bc974-77b0-48d8-beeb-98574f881577.jpg)|![014f6bf2dccf97d1cfc97dff79b028e182f3bd8c9735553d03f6f982e10ebe70](https://user-images.githubusercontent.com/107375500/182104497-2989dd73-d46a-4e31-ab60-1e1ed72f9244.png)|![a2a82850f6db5ee6033c48f55d5e15a7113e2bd2b7407c8202a97d2241a96625](https://user-images.githubusercontent.com/107375500/182104592-a256a2fc-c249-4b90-bee3-ad5c8ad21920.png)|
|:---:|:---:|:---:|:---:|
|포지션|Back-end|Back-end|Back-end|
|이름|정오현|채예찬|이호욱|
