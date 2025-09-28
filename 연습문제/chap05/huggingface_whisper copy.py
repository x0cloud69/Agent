import os
# FFmpeg 경로 설정
os.environ["PATH"] = "C:/Agent/ffmpeg-2025-09-25-git-9970dc32bf-full_build/bin;" + os.environ.get("PATH", "")
os.environ["FFMPEG_BINARY"] = "C:/Agent/ffmpeg-2025-09-25-git-9970dc32bf-full_build/bin/ffmpeg.exe"

import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor
import librosa
import numpy as np

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model_id = "openai/whisper-large-v3-turbo"

print("모델 로딩 중...")
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

# 오디오 파일을 librosa로 로드
audio_path = "C:/Agent/연습문제/chap05/audio.mp3"
try:
    audio_array, sampling_rate = librosa.load(audio_path, sr=16000)
    print(f"오디오 파일 로드 성공: {audio_path}")
    print(f"오디오 길이: {len(audio_array)/sampling_rate:.2f}초")
except FileNotFoundError:
    print("오디오 파일을 찾을 수 없어 더미 데이터를 생성합니다.")
    # 5초간의 더미 오디오 데이터 (무음)
    audio_array = np.zeros(16000 * 5, dtype=np.float32)
    sampling_rate = 16000

# 직접 모델 사용 (pipeline 우회하여 TorchCodec 의존성 회피)
print("오디오 전처리 중...")
inputs = processor(audio_array, sampling_rate=sampling_rate, return_tensors="pt")
inputs = inputs.to(device)

print("음성 인식 실행 중...")
with torch.no_grad():
    predicted_ids = model.generate(inputs["input_features"])

# 결과 디코딩
transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)

print("결과:")
print(transcription[0])