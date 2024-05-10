
<h1 style='background-color: rgba(55, 55, 55, 0.4); text-align: center'>API 명세서 </h1>

해당 API 명세서는 '오피스텔 부동산 가격 서비스'의 REST API를 명세하고 있습니다.

- Domain : <http://localhost:4000>  

***
  
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Auth 모듈</h2>

인증 및 인가와 관련된 REST API 모듈  
로그인, 회원가입, 소셜 로그인, 소셜 회원가입 등의 API가 포함되어 있습니다.  
  
- url : /api/v1/auth  

***

#### - 로그인  
  
##### 설명

클라이언트로부터 사용자 아이디와 평문의 비밀번호를 입력받고 아이디와 비밀번호가 일치한다면 성공처리가되며 access_token과 해당 토큰의 만료 기간을 반환합니다. 만약 아이디 혹은 비밀번호가 하나라도 틀리다면 실패 처리됩니다. 서버 에러, 데이터베이스 에러, 토큰 생성 에러가 발생할 수 있습니다.

- method : **POST**  
- URL : **/sign-in**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 사용자의 아이디 | O |
| userPassword | String | 사용자의 비밀번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-in" \
 -d "userId=service123" \
 -d "userPassword=P!ssw0rd"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |
| accessToken | String | 사용자의 아이디 | O |
| expires | int | 사용자의 비밀번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "accessToken": "${ACCESS_TOKEN}",
  "expires": 3600
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Varidation Failed."
}
```

**응답 : 실패 (로그인 정보 불일치)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "SF",
  "message": "Sign in Failed."
}
```

**응답 : 실패 (토큰 생성 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "TF",
  "message": "Token creation Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

#### - 아이디 중복 확인  
  
##### 설명

클라이언트로부터 아이디를 입력받아 해당하는 아이디가 이미 사용중인 아이디인지 확인합니다. 중복되지 않은 아이디이면 성공처리를 합니다. 만약 중복되는 아이디라면 실패처리를 합니다. 데이터베이스 오류가 발생할 수 있습니다.

- method : **POST**  
- URL : **/id-check**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 중복확인 할 사용자의 아이디 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/id-check" \
 -d "userId=service123" 
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Varidation Failed."
}
```

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DI",
  "message": "Duplicatied Id."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

#### - 이메일 인증  
  
##### 설명

클라이언트로부터 이메일을 입력받아 해당하는 이메일이 이미 사용중인 이메일인지 확인하고 사용하고 있지 않은 이메일이라면 4자리의 인증코드를 해당 이메일로 전송합니다. 이메일 전송이 성공적으로 종료되었으면 성공처리를 합니다. 만약 중복된 이메일이거나 이메일 전송에 실패했으면 실패처리를 합니다. 데이터베이스 오류가 발생할 수 있습니다.

- method : **POST**  
- URL : **/email-auth**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userEmail | String | 인증 번호를 전송할 사용자 이메일</br>(이메일 형태의 데이터) | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/email-auth" \
 -d "userEmail=email@email.com"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Varidation Failed."
}
```

**응답 : 실패 (중복된 이메일)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DE",
  "message": "Duplicatied Email."
}
```

**응답 : 실패 (이메일 전송 실패)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "MF",
  "message": "Mail send Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

#### - 이메일 인증 확인
  
##### 설명

클라이언트로부터 이메일과 인증 번호를 입력받아 해당하는 이메일에 전송한 인증번호와 일치하는지 확인합니다. 일치한다면 성공처리를 합니다. 만약 일치하지 않는다면 실패처리를 합니다. 데이터베이스 오류가 발생할 수 있습니다.

- method : **POST**  
- URL : **/email-auth-check**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userEmail | String | 인증 번호를 확인할 사용자 이메일 | O |
| authNumber | String | 인증 확인할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/email-auth-check" \
 -d "userEmail=email@email.com" \
 -d "authNumber=0123"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Varidation Failed."
}
```

**응답 : 실패 (이메일 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

#### - 회원가입
  
##### 설명

클라이언트로부터 아이디, 비밀번호, 이메일, 인증번호를 입력받아 회원가입 처리를 합니다. 정상적으로 회원가입이 완료되면 성공처리를 합니다. 만약 중복된 아이디, 중복된 이메일, 인증번호 불일치가 발생하면 실패처리를 합니다. 데이터베이스 오류가 발생할 수 있습니다.

- method : **POST**  
- URL : **/sign-up**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| userId | String | 사용자 아이디 | O |
| userPassword | String | 사용자 비밀번호 (영문+숫자 8~13자) | O |
| userEmail | String | 사용자 이메일 (이메일 형태의 데이터) | O |
| authNumber | String | 인증 확인할 인증 번호 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/auth/sign-up" \
 -d "userId=service123" \
 -d "userPassword=Pa55w0rd" \
 -d "userEmail=email@email.com" \
 -d "authNumber=0123"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success."
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Varidation Failed."
}
```

**응답 : 실패 (중복된 아이디)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DI",
  "message": "Duplicatied Id."
}
```

**응답 : 실패 (중복된 이메일)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "DE",
  "message": "Duplicatied Email."
}
```

**응답 : 실패 (이메일 인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>User 모듈</h2>

사용자 정보와 관련된 REST API 모듈
  
- url : /api/v1/user  

***

#### - 로그인 유저 정보 반환  
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 요청을 받으면 해당 토큰의 작성자(subject)에 해당하는 사용자 정보를 반환합니다. 성공시에는 사용자의 아이디와 권한을 반환합니다. 인증 실패 및 데이터베이스 에러가 발생할 수 있습니다.

client가 header에 bearer 토큰을 포함하여 요청

0. 해당 요청의 메서드와 URL을 보고 인증 인가가 필요한 요청인지 확인 
1. header의 Authorization 필드에 값이 있는지 확인
2. 해당 요청의 인증 방식이 Bearer 인증 방식인지 확인
3. Authorization 필드 값에서 토큰 추출
4. 토큰의 유효성 판단
5. 토큰에서 userId 추출
6. userId로 데이터베이스에서 조회
7. 조회 결과로부터 사용자의 권한을 추출
8. context에 request의 정보와 접근주체의 정보를 추가
9. 접근주체가 해당 요청을 사용할 권한이 있는지 확인
0.1 만약 인증 및 인가 작업에 실패하면 'AF' 응답 처리 
10. 컨트롤러의 메서드에서 인증 접근 주체의 정보를 가져옴
(userId)
11. 데이터베이스의 user테이블에서 userId에 해당하는 레코드를 조회
11-1. 데이터베이스 오류 발생시 'DBE' 응답 처리
12. 존재하는 user인지 확인
12-1. 존재하지 않으면 'NU' 응답 처리

- method : **GET**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Example

```bash
curl -v -X GET "http://localhost:4000/api/v1/user/" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 사용자의 아이디 | O |
| message | String | 사용자의 비밀번호 | O |
| userId | String | 사용자의 아이디 | O |
| userRole | String | 사용자의 권한 | O |

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "userId": "${userId}",
  "userRole": "${userRole}"
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

***

***

<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Board 모듈</h2>

Q&A 게시물과 관련된 REST API 모듈
  
- url : /api/v1/board  

***

#### - Q&A 게시물 작성 
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 제목, 내용을 입력받고 작성에 성공하면 성공처리를 합니다. 만약 작성에 실패하면 실패처리 됩니다. 인가 실패, 데이터베이스 에러, 데이터 유효성 검사 실패가 발생할 수 있습니다. 

0. 클라이언트로부터 Authorization 헤더와 Request Body를 포함하여 요청

0.1 권한이 없는 사용자이면 'AF' 응답 처리 (403)
0.2 유효하지 않은 데이터이면 'VF' 응답 처리

(title, contents), userId

1. 데이터베이스의 user 테이블에서 해당 유저가 존재하는지 확인
1.1 존재하지 않는 유저라면 'AF' 응답 처리 (401)
1.2 데이터베이스 오류가 발생하면 'DBE" 응답 처리

2. Board 테이블에 데이터 삽입
2.1 데이터베이스 오류가 발생하면 'DBE' 응답 처리

3.'SU' 응답 처리


- method : **POST**  
- URL : **/**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Request Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| title | String | Q&A 제목 | O |
| contents | String | Q&A 내용 | O |

###### Example

```bash
curl -v -X POST "http://localhost:4000/api/v1/board/" \
 -H "Authorization: Bearer {JWT}"
 -d "title={title}"\
 -d "contents={contents}
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "userId": "${userId}",
  "userRole": "${userRole}"
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "Validation Failed."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 전제 게시물 리스트 불러오기
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 요청을 보내면 작성일 기준 내림차순 게시물 리스트를 반환합니다. 만약 불러오기에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.

데이터베이스에서 전체 리스트 조회 -> List<BoardEntity> -> List<BoardListItem>

SELECT *
FROM board
ORDER BY reception_number DESC;

findByOrderByReceptionNumberDesc();


- method : **GET**  
- URL : **/list**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |


###### Example

```bash
curl -v -X GET "http://localhost:4000/api/v1/board/list" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |
| boardList | BoardListItem[] | Q&A 게시물 리스트 | 0 | 

**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디</br> (첫글자를 제외한 나머지 문자는 *) | 0 |
| writerDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0|


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "boardList" : [
    {
      "receptionNumber" : 1,
      "status" : false,
      "title" : "테스트1",
      "writerId": "j*****",
      "writeDatetime": "24.05.02",
      "viewCount": 0 
    }
  ]
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

*** 

#### - Q&A 검색 게시물 리스트 불러오기
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 검색어를 입력받고 요청을 보내면 작성일 기준 내림차순으로 제목에 해당 검색어가 포함된 게시물 리스트를 반환합니다. 만약 불러오기에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.

SELECT *
FROM board
WHERE title LIKE '%searchWord%'
ORDER BY reception_number DESC;

findByTitleContainsOrderByReceptionNumberDesc();

한페이지당 10
힌 섹션당 10

총 게시물 수 : 316
총 페이지 수 : 32 (총 게시물수 - 1) // 한페이지당 게시물 수  + 1
총 섹션 수: 4 ((총 페이지 수 - 1) // 한섹션당 페이지 수) + 1


페이지 - 시작 인덱스 ~ 종료 인덱스
결과 전체 게시물 리스트
1 - 0 ~ 9 (페이지 - 1) * 10 ~ [페이지 * 10 - 1 / 맨 마지막 인덱스]
2 - 10 ~ 19
3 - 20 ~ 29
... 
31 - 300 ~ 309
32 - 310 ~ 315

섹션 -  시작 페이지 ~ 종료 페이지
1 - 1 ~ 10 (섹션 * 섹션당 페이지 수 - 섹션당 페이지 수 - 1) ~ [(섹션 * 섹션당 페이지수) * 10]
2 - 11 ~ 20 
3 - 21 ~ 30
4 - 31 ~ 32


- method : **GET**  
- URL : **/list/{searchWord}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Path Variable (get과 delete는 Response Body 받을 수 없음)

| name | type | description | required |
|---|:---:|:---:|:---:|
| searchWord | String | 검색어 | O |




###### Example

```bash
curl -v -X GET "http://localhost:4000/api/v1/board/list/${searchWord}" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |
| boardList | BoardListItem[] | Q&A 게시물 리스트 | 0 | 

**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디</br> (첫글자를 제외한 나머지 문자는 *) | 0 |
| writerDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0|


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "boardList" : [
    {
      "receptionNumber" : 1,
      "status" : false,
      "title" : "테스트1",
      "writerId": "j*****",
      "writeDatetime": "24.05.02",
      "viewCount": 0 
    }
  ]
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 검색 게시물 불러오기
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 접수번호를 입력받고 요청을 보내면 해당하는 Q&A 게시물 데이터를 반환합니다. 만약 불러오기에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.

- 유효성 검사
(receptionNumber)

- 데이터베이스의 Board 테이블에서 receptionNumber에 해당하는 레코드 조회
SELECT * 
FROM board
WHERE reception_number = :receptionNumber;




- method : **GET**  
- URL : **/{receptionNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Path Variable (get과 delete는 Response Body 받을 수 없음)

| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |




###### Example

```bash
curl -v -X GET "http://localhost:4000/api/v1/board/${receptionNumber}" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | String | 제목 | 0 | 
| writerId | String | 작성자 아이디 | 0 | 
| writeDatetime | String | 작성일 | 0 | 
| viewCount | int | 조회수 | 0 | 
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디| 0 |
| writeDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0 |
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "receptionNUmber" : ${receptionNumber},
  "status": ${status},
  "title": ${title},
  "writerId": ${writerId},
  "writerDatetime": ${writeDatetime},
  "viewCount": ${viewCount},
  "contents": ${contents},
  "comment": ${comment}
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (인증 실패)**
```bash
HTTP/1.1 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authentication Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 게시물 조회수 증가
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 접수번호를 입력받고 요청을 보내면 해당하는 Q&A 게시물의 조회수를 증가시킵니다. 만약 증가에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.


- method : **PATCH**  
- URL : **/{receptionNumber}/increase-view-count**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Path Variable (get과 delete는 Response Body 받을 수 없음)

| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |




###### Example

```bash
curl -v -X PATCH "http://localhost:4000/api/v1/board/${receptionNumber}/increase-view-count" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |


**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디| 0 |
| writeDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0 |
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "receptionNUmber" : ${receptionNumber},
  "status": ${status},
  "title": ${title},
  "writerId": ${writerId},
  "writerDatetime": ${writeDatetime},
  "viewCount": ${viewCount},
  "contents": ${contents},
  "comment": ${comment}
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 게시물 답글 작성
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 접수번호와 답글 내용을 입력받고 요청을 보내면 해당하는 Q&A 게시물의 답글이 작성됩니다. 만약 증가에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.


- method : **POST**  
- URL : **/{receptionNumber}/comment**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| comment | 인증에 사용될 Bearer 토큰 | O |

###### Request Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| comment | String | 답글 내용 | O |

###### Example

```bash
curl -v -X POST"http://localhost:4000/api/v1/board/${receptionNumber}/comment" \
 -H "Authorization: Bearer {JWT}"
 -d "comment={comment}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |


**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디| 0 |
| writeDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0 |
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "receptionNUmber" : ${receptionNumber},
  "status": ${status},
  "title": ${title},
  "writerId": ${writerId},
  "writerDatetime": ${writeDatetime},
  "viewCount": ${viewCount},
  "contents": ${contents},
  "comment": ${comment}
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (이미 작성된 답글)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "WC",
  "message": "Written comment."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```


**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 게시물 삭제
  
##### 설명

클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 접수번호를 입력받고 요청을 보내면 해당하는 Q&A 게시물이 삭제됩니다. 만약 삭제에 실패하면 실패처리를 합니다. 인가 실패, 데이터베이스 에러가 발생할 수 있습니다.


- method : **DELETE**  
- URL : **/{receptionNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Request Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| contents | String | Q&A 내용 | O |

###### Example

```bash
curl -v -X POST"http://localhost:4000/api/v1/board/${receptionNumber}" \
 -H "Authorization: Bearer {JWT}"
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |


**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디| 0 |
| writeDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0 |
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "receptionNUmber" : ${receptionNumber},
  "status": ${status},
  "title": ${title},
  "writerId": ${writerId},
  "writerDatetime": ${writeDatetime},
  "viewCount": ${viewCount},
  "contents": ${contents},
  "comment": ${comment}
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```


**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - Q&A 게시물 수정
  
##### 설명


클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 접수 번호, 제목, 내용을 입력받고 수정에 성공하면 성공처리를 합니다. 만약 수정에 실패하면 실패처리 됩니다. 인가 실패, 데이터베이스 에러, 데이터 유효성 검사 실패가 발생할 수 있습니다.


- method : **PUT**  
- URL : **/{receptionNumber}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Request Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 수정할 접수 번호 | O |

###### Request Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| title | String | Q&A 제목 | O |
| contents | String | Q&A 내용 | O |

###### Example

```bash
curl -v -X PUT "http://localhost:4000/api/v1/board/${receptionNumber}" \
 -H "Authorization: Bearer {JWT}"
 -d "title={title}" \
 -d "contents={contents}
```

##### Response

###### Header

| name | description | required |
|---|:---:|:---:|
| Content-Type | 반환하는 Response Body의 Content Type (application/json) | O |

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |


**BoardListItem**
| name | type | description | required |
|---|:---:|:---:|:---:|
| receptionNumber | int | 접수 번호 | O |
| status | boolean | 상태 | O |
| title | string | 제목 | 0 |
| writerId | string | 작성자 아이디| 0 |
| writeDatetime | string | 작성일</br>(yy.mm.dd 형태) | 0 |
| viewCount | int | 조회수 | 0 |
| contents | String | 내용 | 0 | 
| comment | String | 내용 | X | 

###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "receptionNUmber" : ${receptionNumber},
  "status": ${status},
  "title": ${title},
  "writerId": ${writerId},
  "writerDatetime": ${writeDatetime},
  "viewCount": ${viewCount},
  "contents": ${contents},
  "comment": ${comment}
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (답변 완료된 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "WC",
  "message": "Written Comment."
}
```

**응답 : 실패 (권한 없음)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```


**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```
<h2 style='background-color: rgba(55, 55, 55, 0.2); text-align: center'>Estate 모듈</h2>

오피스텔 부동산 가격 정보와 관련된 REST API 모듈  
지역 평균 데이터, 비율 관련 데이터 API가 포함되어 있습니다.  
  
- url : /api/v1/auth  

*** 

#### -지역 평균 데이터 불러오기
  
##### 설명


클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 지역을 입력받고 불러오기에 성공하면 성공처리를 합니다. (매매가, 전세가, 월세 보증금 데이터의 단위는 천원 단위) 만약 불러오기에 실패하면 실패처리 됩니다. 인가 실패, 데이터베이스 에러, 데이터 유효성 검사 실패가 발생할 수 있습니다.

- method : **GET**  
- URL : **/local{local}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Path Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| local | string | 조회할 지역 | O |


###### Example

```bash
curl -v -X PUT "http://localhost:4000/api/v1/estate/local/{local}" \
 -H "Authorization: Bearer {JWT}"
```

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |
| yearMonth | String | 결과 메세지 | O |
| sale | int[] | 매매가 리스트 | O |
| lease | int[] | 전세가 리스트 | O |
| monthRent | int[] | 월세 보증금 리스트 | O |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "yearMonth": ['23-01','23-02','23-03', ... , '23-12'],
  "sale": [4525, 4855, 4755, ... ,4621],
  "lease": [4525, 4855, 4755, ... ,4621],
  "monthRent": [4525, 4855, 4755, ... ,4621],
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (답변 완료된 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "WC",
  "message": "Written Comment."
}
```

**응답 : 실패 (권한 없음)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```


**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 

#### - 비율 데이터 불러오기
  
##### 설명


클라이언트로부터 Request Header의 Authorization 필드로 Bearer 토큰을 포함하여 지역을 입력받고 불러오기에 성공하면 성공처리를 합니다. (날짜 데이터를 제외한 모든 단위는 백분율 단위) 만약 불러오기에 실패하면 실패처리 됩니다. 인가 실패, 데이터베이스 에러, 데이터 유효성 검사 실패가 발생할 수 있습니다.

- method : **GET**  
- URL : **/ratio{local}**  

##### Request

###### Header

| name | description | required |
|---|:---:|:---:|
| Authorization | 인증에 사용될 Bearer 토큰 | O |

###### Path Body 

| name | type | description | required |
|---|:---:|:---:|:---:|
| local | string | 조회할 지역 | O |


###### Example

```bash
curl -v -X PUT "http://localhost:4000/api/v1/estate/local/{local}" \
 -H "Authorization: Bearer {JWT}"
```

###### Response Body

| name | type | description | required |
|---|:---:|:---:|:---:|
| code | String | 결과 코드 | O |
| message | String | 결과 메세지 | O |
| yearMonth | String | 연월 리스트 | O |
| return40 | double[] | 40m2 이하 수익률 리스트 | O |
| return4060 | double[] | 40m2 초과 60m2 이하 수익률 리스트 | O |
| return6085 | double[] | 60m2 초과 85m2 이하 수익률 리스트 | O |
| return85 | double[] | 85m2 초과 수익률 리스트 | O |

| leaseRatio40 | double[] | 40m2 이하 매매가 대비 전세가 비율 리스트 | O |
| leaseRatio4060 | double[] | 40m2 초과 60m2 이하 매매가 대비 전세가 비율 리스트 | O |
| leaseRatio6085 | double[] | 60m2 초과 85m2 이하 매매가 대비 전세가 비율 리스트 | O |
| leaseRatio85 | double[] | 85m2 초과 매매가 대비 전세가 비율 리스트 | O |

| monthRentRatio40 | double[] | 40m2 이하 전세가 대비 월세 보증금 비율 리스트 | O |
| monthRentRatio4060 | double[] | 40m2 초과 60m2 이하 전세가 대비 월세 보증금 비율 리스트 | O |
| monthRentRatio6085 | double[] | 60m2 초과 85m2 이하 전세가 대비 월세 보증금 비율 리스트 | O |
| monthRentRatio85 | double[] | 85m2 초과 전세가 대비 월세 보증금 비율 리스트 | O |


###### Example

**응답 성공**
```bash
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
  "code": "SU",
  "message": "Success.",
  "yearMonth": ['23-01','23-02','23-03', ... , '23-12'],
  "return40" : [10.4, 11.1 ,10.0, ..., 9.8],
  "return4060" : [10.4, 11.1 ,10.0, ..., 9.8],
  "return6085" : [10.4, 11.1 ,10.0, ..., 9.8],
  "return85" : [10.4, 11.1 ,10.0, ..., 9.8],

  "leaseRatio40" : [10.4, 11.1 ,10.0, ..., 9.8],
  "leaseRatio4060" : [10.4, 11.1 ,10.0, ..., 9.8],
  "leaseRatio6085" : [10.4, 11.1 ,10.0, ..., 9.8],
  "leaseRatio85" : [10.4, 11.1 ,10.0, ..., 9.8],

  "monthRentRatio40" : [10.4, 11.1 ,10.0, ..., 9.8],
  "monthRentRatio4060" : [10.4, 11.1 ,10.0, ..., 9.8],
  "monthRentRatio6085" : [10.4, 11.1 ,10.0, ..., 9.8],
  "monthRentRatio85" : [10.4, 11.1 ,10.0, ..., 9.8],
}
```

**응답 : 실패 (데이터 유효성 검사 실패)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "VF",
  "message": "validation Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (인가 실패)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```

**응답 : 실패 (존재하지 않는 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "NB",
  "message": "No Exist Board."
}
```

**응답 : 실패 (답변 완료된 게시물)**
```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json;charset=UTF-8
{
  "code": "WC",
  "message": "Written Comment."
}
```

**응답 : 실패 (권한 없음)**
```bash
HTTP/1.1 403 Forbidden
Content-Type: application/json;charset=UTF-8
{
  "code": "AF",
  "message": "Authorization Failed."
}
```


**응답 : 실패 (데이터베이스 오류)**
```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json;charset=UTF-8
{
  "code": "DBE",
  "message": "Database Error."
}
```

*** 