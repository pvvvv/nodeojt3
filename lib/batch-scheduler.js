const bat = require('node-schedule');
const logger = require('../config/logger');
const db = require('../models/');
const sequelize = require('sequelize');
const moment = require('moment');
const Op = sequelize.Op;
//const _ = require('lodash');

module.exports = {
    scheduleBackup: async () => {
        bat.scheduleJob('0 0 12 * * ?', async () => {
            const t = await db.sequelize.transaction();
            const yesterdayStart = moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 00:00:00';
            const yesterdayEnd = moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59';
            let nowDateTime = moment().format('YYYY-MM-DD hh:mm:ss');
            let scheduleCount;
            let jobNum;
            let isSuccess;
            let log;
            try {
                var jobData = await db.backup_job.create(
                    {
                        jobStartDateTime: nowDateTime,
                    },
                    {
                        transaction: t,
                    },
                );
                jobNum = jobData.jobNum;

                var scheduleData = await db.scheduler.findAll({
                    where: {
                        [Op.or]: [
                            {
                                createdAt: {
                                    [Op.gte]: yesterdayStart,
                                    [Op.lte]: yesterdayEnd,
                                },
                            },
                            {
                                updatedAt: {
                                    [Op.gte]: yesterdayStart,
                                    [Op.lte]: yesterdayEnd,
                                },
                            },
                        ],
                    },
                });

                if (scheduleData.length > 0) {
                    scheduleCount = scheduleData.length;
                    var backupData = [];
                    for (var i = 0; i < scheduleCount; i++) {
                        backupData.push(scheduleData[i].dataValues);
                    }
                    /*
                    * lodash 문법 확인하기
                    let t = _.map(scheduleData, s => {
                        return s.dataValues;
                    });
                    */
                    await db.backup.bulkCreate(backupData, { transaction: t });
                    isSuccess = 1;
                    log = '백업완료';
                } else {
                    scheduleCount = 0;
                    isSuccess = 1;
                    log = '백업완료(해당 날짜엔 데이터가 없습니다.)';
                }
            } catch (error) {
                logger.error('error : ' + error);
                scheduleCount = 0;
                isSuccess = 0;
                log = '오류가 발생했습니다 오류내용 : ' + error.message + '';
            } finally {
                nowDateTime = moment().format('YYYY-MM-DD hh:mm:ss');
                db.backup_job.update(
                    {
                        jobEndDateTime: nowDateTime,
                        backupCount: scheduleCount,
                        isSuccess: isSuccess,
                        log: log,
                    },
                    {
                        where: {
                            jobNum: jobNum,
                        },
                    },
                    { transaction: t },
                );
                await t.commit();
            }
        });
    },
};
