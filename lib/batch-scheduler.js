const bat = require('node-schedule');
const logger = require('../config/logger');
const db = require('../models/');
const sequelize = require('sequelize');
const moment = require('moment');
const Op = sequelize.Op;

module.exports = {
    scheduleBackup: async () => {
        bat.scheduleJob('* * * * * *', async () => {
            const yesterdayStart =
                moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 00:00:00';
            const yesterdayEnd =
                moment().subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59';
            let nowDateTime = moment().format('YYYY-MM-DD hh:mm:ss');
            let jobNum;
            try {
                var jobData = await db.backup_job.create({
                    jobStartDateTime: nowDateTime,
                });
                jobNum = jobData.jobNum;

                var scheduleData = await db.scheduler.findAll({
                    where: {
                        createdAt: {
                            [Op.gte]: yesterdayStart,
                            [Op.lte]: yesterdayEnd,
                        },
                        updatedAt: {
                            [Op.gte]: yesterdayStart,
                            [Op.lte]: yesterdayEnd,
                        },
                    },
                });
                console.dir('scheduleData' + Object.keys(scheduleData));
                console.log([scheduleData[0].dataValues]);
                var aa = [scheduleData[0].dataValues];
                if (scheduleData !== null) {
                    var backupData = await db.backup.bulkCreate(aa);
                    logger.info('backupData' + backupData);

                    // nowDateTime = moment().format('YYYY-MM-DD hh:mm:ss');
                    // const logText = ``
                    // db.backup_job.update({
                    //     jobEndDateTime: nowDateTime,
                    //     backupCount: backupData.length, // 콘솔 찍어보기
                    //     isSuccess: 1,
                    //     log: 
                    // },
                    // where:
                    //     {
                    //         {
                    //             jobNum: jobNum,
                    //         },
                    //     },
                    // );
                } else {
                    logger.info('scheduleData id null');
                }
            } catch (error) {
                logger.error('여기에요' + error);
            }
        });
    },
};
