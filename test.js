// START.배치 시작
// Schedule_META // 시작시간 종료시간 성공여부 Log
// 1. 시작시간 인서트
// 2. Schedule 조회 // CreateAt, UpdateAt 일자가 1월 1일인거
// 3.성공 : 데이터 조회 성공 -> Schedule_META // 종료시간 true log
// 3.실패 : 쿼리 실패 -> Schedule_META // 종료시간 false log(쿼리 error)
// 4.backup_META // 시작시간 인서트
// 5.데이터가 있다 -> backUp table -> 백업실행 // PK 시작일시 종료일시 캘린더id 예약명 위치 이름 id
// 5.데이터가 없다 -> backup_META // 종료시간 0건 false log(조회된 데이터가 없습니다)
// 6.백업성공 -> backup_META -> 종료시간 n건 true log(?년?월?일?시?분?초에 회의실예약 n건 백업)
// 6.백업실패 -> backup_META -> 종료시간 0건 false log(쿼리 error)

//롤백은 없고 META 테이블에 전체적으로 다 인서트는 해줘야함

/**
 * 시뮬레이션
 * 1월 2일 12시 00분
 * Schedule_META(테이블)에 순차증가값과 now()인서트
 * 스케줄 조회 try db.scheduler.findAll({createAt, updateAt}) ... catch (err)
 * 조회하는데 오류가났다? 캐치해서 Schedule_META(테이블)에 종료시간 false log(쿼리 error) 업데이트
 * 조회를 성공했다! -> backup_META // 순차증가값, 시작시간 now() 인서트
 * 조회한 데이터가 있다? if(data !== null) -> try 백업실행 catch{ err }
 * 조회한 데이터가 없다? else{    } -> backup_META에 종료시간 false log(0년0월0일에는 예약된 데이터가 없습니다)
 * 백업이 성공했다? backup_META에 종료시간 true log(?년?월?일?시?분?초에 회의실예약 n건 백업)
 * 백업이 실패했다? 백업테이블 롤백 후, backup_META에 종료시간 false log(쿼리 error) 인서트
 * 종료
 * /