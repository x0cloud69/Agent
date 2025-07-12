from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
import auth
import uuid
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """새 사용자 생성"""
    # 복합키 중복 확인
    existing_user = db.query(models.User).filter(
        models.User.company_id == user.company_id,
        models.User.talency_id == user.talency_id,
        models.User.user_id == user.user_id
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="User already exists with this company_id, talency_id, and user_id"
        )
    
    # 비밀번호 해싱
    hashed_password = auth.get_password_hash(user.password)
    
    # 새 사용자 생성
    db_user = models.User(
        user_id=user.user_id,
        talency_id=user.talency_id,
        company_id=user.company_id,
        employee_no=user.employee_no,
        password=hashed_password,
        user_name=user.user_name,
        email=user.email,
        mobile=user.mobile,
        description=user.description,
        user_level=user.user_level or "USER",
        is_admin="N",
        use_yn="Y",
        account_lock_yn="N",
        login_fail_cnt=0,
        login_fail_max=5,
        password_change_cycle=90,
        temp_password=False,
        created_at=datetime.now(),
        created_by=user.user_id
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    """현재 사용자 정보 조회"""
    return current_user

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """사용자 목록 조회"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{company_id}/{talency_id}/{user_id}", response_model=schemas.User)
def read_user(company_id: str, talency_id: str, user_id: str, db: Session = Depends(get_db)):
    """특정 사용자 조회 (복합키 사용)"""
    user = db.query(models.User).filter(
        models.User.company_id == company_id,
        models.User.talency_id == talency_id,
        models.User.user_id == user_id
    ).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{company_id}/{talency_id}/{user_id}", response_model=schemas.User)
def update_user(
    company_id: str, 
    talency_id: str, 
    user_id: str, 
    user_update: schemas.UserUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """사용자 정보 수정"""
    user = db.query(models.User).filter(
        models.User.company_id == company_id,
        models.User.talency_id == talency_id,
        models.User.user_id == user_id
    ).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 업데이트할 필드들
    update_data = user_update.dict(exclude_unset=True)
    
    # 비밀번호가 변경되는 경우 해싱
    if "password" in update_data:
        update_data["password"] = auth.get_password_hash(update_data["password"])
        update_data["password_upd_dt"] = datetime.now()
    
    # 수정 정보 추가
    update_data["updated_at"] = datetime.now()
    update_data["updated_by"] = current_user.user_id
    
    # 필드 업데이트
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user 