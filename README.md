# 🌿 Veganer Server

> 비건 식당 정보·리뷰·커뮤니티 플랫폼 **Veganer**의 백엔드 서버

Node.js(Express) + PostgreSQL 기반으로 식당·리뷰·게시글·인증·스크랩 등
6개 도메인의 RESTful API를 제공합니다.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render&logoColor=white)

---

## 🔗 링크

- **🌐 라이브 API**: https://veganerserver.onrender.com
- **📂 프론트엔드 레포**: https://github.com/ehddk/veganerweb

---

## 📚 목차

- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [API 명세](#-api-명세)
- [도메인 구조](#-도메인-구조)

---

## 🛠 기술 스택

### Core
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript

### Database & Auth
- **DB**: PostgreSQL (Supabase 호스팅)
- **DB Client**: `pg` (raw SQL)
- **Auth**: Supabase Auth (JWT 토큰 검증)
- **Storage**: Supabase Storage

### External APIs
- **Naver Search API**: 식당 이미지·블로그 후기 수집

### Deployment
- **Server**: Render
- **DB**: Supabase

---


### 도메인 구조

| 도메인 | 책임 |
|---|---|
| `auth` | 회원가입·로그인·토큰 발급 |
| `restaurant` | 식당 CRUD, 이미지 크롤링 연동 |
| `review` | 리뷰 CRUD (이미지 배열 포함) |
| `article` | 커뮤니티 게시글 CRUD |
| `comment` | 댓글 CRUD |
| `scrap` | 식당 스크랩 (북마크) |

---

## 📡 API 명세

### Auth — `/api/auth`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| POST | `/login` | 로그인, JWT 발급 | - |
| POST | `/register` | 회원가입 | - |
| POST | `/logout` | 로그아웃 | required |

### Restaurant — `/api/restaurant`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 식당 목록 조회 | - |
| GET | `/:id` | 식당 상세 (로그인 시 `scrapped_by_me` 포함) | optional |
| POST | `/` | 식당 등록 | required |

### Review — `/api/review`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/:restaurant_id` | 리뷰 목록 (페이지네이션) | - |
| POST | `/:restaurant_id` | 리뷰 작성 | required |
| PUT | `/:restaurant_id/:id` | 리뷰 수정 (본인만) | required |
| DELETE | `/:restaurant_id/:id` | 리뷰 삭제 (본인만) | required |

### Scrap — `/api/scrap`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 내 스크랩 식당 목록 | required |
| POST | `/:restaurant_id` | 스크랩 토글 | required |

### Article — `/api/articles`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/` | 게시글 목록 | - |
| GET | `/:id` | 게시글 상세 | - |
| POST | `/` | 게시글 작성 | required |
| PUT | `/:id` | 게시글 수정 | required |
| DELETE | `/:id` | 게시글 삭제 | required |

### Comment — `/api/comments`

| Method | Path | 설명 | 인증 |
|---|---|---|---|
| GET | `/:article_id` | 댓글 목록 | - |
| POST | `/:article_id` | 댓글 작성 | required |
| PUT | `/:article_id/:id` | 댓글 수정 | required |
| DELETE | `/:article_id/:id` | 댓글 삭제 | required |


