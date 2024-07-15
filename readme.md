# Model  Branch

This is Model Branch.

Happy Hack.

encoding된 이미지를 {"img" : "encoding_img"} 형식으로 POST요청 보내면 inference결과 object return

# Guide

테스트시에는 [가상환경](#virtual-machine-run) 만들어서 requirements.txt를 설치한 후 실행하는 것을 권장.

배포 테스트 시에는 도커로 로컬 테스트하고 image 배포 권장.


## Docker run

```
// Docker 이미지 가져와서 실행
sudo docker pull yonghune/cataract-app:0.1
sudo docker images
sudo docker run -d -p 8800:8800 yonghune/cataract-app:0.1
sudo docker ps
```

## Docker build

```
docker build -t <이미지_이름>:<태그> .
docker run -d -p 8800:8800 cataract-app:latest
docker tag cataract-app yonghune/cataract-app:0.2
docker push yonghune/cataract-app:0.2
```

## Virtual Machine run

```
python3 -m venv cataract
source cataract/bin/activate
pip install -r requirements.txt
```

추가로 설치한 라이브러리가 있다. 아래와 같이 requirements 업데이트
```
pip freeze > requirements.txt
```
(주의 : 가상환경이 아닌 로컬환경에서 requirements 업데이트하면 이상한게 덮어 쓰일 수 있으니, 가상환경에서 작업하길 권장)

## Model Test

아래 이미지를 /inference로 전송

```
{
"img":"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"
}

```


overripe_data shape: (2000, 224, 224, 3) : 0
no_data shape: (2000, 224, 224, 3) : 1
mature_data shape: (2000, 224, 224, 3) : 2
incipient_data shape: (2000, 224, 224, 3) : 3