'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class backup_job extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    backup_job.init(
        {
            jobNum: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER(8),
                comment: '업무고유번호',
            },
            jobStartDateTime: {
                allowNull: false,
                type: DataTypes.DATE,
                comment: '업무시작일시',
            },
            jobEndDateTime: {
                type: DataTypes.DATE,
                comment: '업무종료일시',
            },
            backupCount: {
                type: DataTypes.INTEGER,
                comment: '백업개수',
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                comment: '성공여부',
            },
            log: {
                type: DataTypes.TEXT,
                comment: '기록',
            },
        },
        {
            sequelize,
            modelName: 'backup_job',
            freezeTableName: true, // 테이블명 복수형으로 만들지않기
        },
    );
    return backup_job;
};
