FROM --platform=linux/amd64 python:3.10.0

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN apt-get update && apt-get install -y python3-opencv
RUN pip install opencv-python
RUN pip install lime
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8001

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]