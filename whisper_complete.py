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
    audio_array = np.zeros(16000 * 5, dtype=np.float32)
    sampling_rate = 16000

# 긴 오디오를 청크로 분할하여 처리
def transcribe_long_audio(audio_array, sampling_rate, chunk_length_s=30, overlap_s=2):
    """긴 오디오를 청크로 나누어 전체 내용을 변환"""
    chunk_samples = int(chunk_length_s * sampling_rate)
    overlap_samples = int(overlap_s * sampling_rate)
    
    transcriptions = []
    start = 0
    
    print(f"총 {len(audio_array)/sampling_rate:.1f}초 오디오를 {chunk_length_s}초 청크로 분할 처리...")
    
    chunk_num = 1
    while start < len(audio_array):
        # 청크 추출
        end = min(start + chunk_samples, len(audio_array))
        chunk = audio_array[start:end]
        
        # 너무 짧은 청크는 건너뛰기
        if len(chunk) < sampling_rate * 1:  # 1초 미만
            break
            
        print(f"청크 {chunk_num} 처리 중... ({start/sampling_rate:.1f}s - {end/sampling_rate:.1f}s)")
        
        # 전처리
        inputs = processor(chunk, sampling_rate=sampling_rate, return_tensors="pt")
        inputs = inputs.to(device)
        
        # 음성 인식
        with torch.no_grad():
            predicted_ids = model.generate(
                inputs["input_features"],
                max_length=448,  # 최대 길이 설정
                num_beams=5,     # 빔 서치로 품질 향상
                do_sample=False,
                temperature=0.0,
            )
        
        # 디코딩
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        if transcription.strip():  # 빈 결과가 아닌 경우만 추가
            transcriptions.append(transcription.strip())
            print(f"청크 {chunk_num} 결과: {transcription[:100]}...")
        
        # 다음 청크로 이동 (오버랩 고려)
        start = end - overlap_samples
        chunk_num += 1
        
        # 무한 루프 방지
        if chunk_num > 100:  # 최대 100개 청크
            print("최대 청크 수에 도달했습니다.")
            break
    
    return transcriptions

# 전체 오디오 변환 실행
print("전체 오디오 변환 시작...")
all_transcriptions = transcribe_long_audio(audio_array, sampling_rate)

# 결과 출력
print("\n" + "="*50)
print("전체 변환 결과:")
print("="*50)

full_text = " ".join(all_transcriptions)
print(full_text)

print(f"\n총 {len(all_transcriptions)}개 청크에서 변환 완료")
print(f"전체 텍스트 길이: {len(full_text)} 문자")

