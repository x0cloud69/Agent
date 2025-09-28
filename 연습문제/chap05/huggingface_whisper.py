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
    # 전체 오디오 로드
    audio_array, sampling_rate = librosa.load(audio_path, sr=16000)
    print(f"오디오 파일 로드 성공: {audio_path}")
    print(f"오디오 길이: {len(audio_array)/sampling_rate:.2f}초")
except FileNotFoundError:
    print("오디오 파일을 찾을 수 없어 더미 데이터를 생성합니다.")
    audio_array = np.zeros(16000 * 5, dtype=np.float32)
    sampling_rate = 16000

# 긴 오디오 처리를 위한 청크 분할 함수
def process_long_audio(audio_array, sampling_rate, chunk_length_s=30, overlap_s=2):
    """
    긴 오디오를 청크로 나누어 처리하고 결과를 결합합니다.
    """
    chunk_length_samples = int(chunk_length_s * sampling_rate)
    overlap_samples = int(overlap_s * sampling_rate)
    audio_length_samples = len(audio_array)
    
    transcription_full = ""
    
    # 청크 단위로 처리
    for i in range(0, audio_length_samples, chunk_length_samples - overlap_samples):
        chunk_end = min(i + chunk_length_samples, audio_length_samples)
        audio_chunk = audio_array[i:chunk_end]
        
        # 너무 짧은 청크는 건너뛰기 (1초 미만)
        if len(audio_chunk) < sampling_rate:
            continue
            
        print(f"청크 처리 중: {i/sampling_rate:.2f}초 ~ {chunk_end/sampling_rate:.2f}초")
        
        inputs = processor(audio_chunk, sampling_rate=sampling_rate, return_tensors="pt")
        inputs = inputs.to(device)
        
        with torch.no_grad():
            # 한국어 음성인 경우 language="ko" 추가
            generated_ids = model.generate(
                inputs["input_features"],
                language="ko",  # 한국어인 경우, 다른 언어는 해당 코드로 변경
                task="transcribe",
                max_length=448,  # 충분한 길이 설정
                no_repeat_ngram_size=3
            )
        
        chunk_transcription = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        transcription_full += chunk_transcription + " "
    
    return transcription_full.strip()

print("음성 인식 실행 중...")
full_transcription = process_long_audio(audio_array, sampling_rate)

print("\n전체 결과:")
print(full_transcription)

# 결과를 파일로 저장 (선택사항)
with open("transcription_result.txt", "w", encoding="utf-8") as f:
    f.write(full_transcription)
