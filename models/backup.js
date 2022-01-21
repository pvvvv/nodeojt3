'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class backup extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    backup.init(
        {
            backupId: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
                comment: '백업ID',
            },
            calendarId: {
                allowNull: false,
                type: DataTypes.INTEGER(8),
                comment: '캘린더 아이디',
            },
            title: {
                allowNull: false,
                type: DataTypes.STRING(50),
                comment: '회의내용',
            },
            category: {
                allowNull: false,
                type: DataTypes.STRING(10),
                comment: '시간, 하루종일 구분',
            },
            startDate: {
                allowNull: false,
                type: DataTypes.DATE,
                comment: '일정시작일시',
            },
            endDate: {
                allowNull: false,
                type: DataTypes.DATE,
                comment: '일정종료일시',
            },
            location: {
                allowNull: false,
                type: DataTypes.ENUM('301호', '302호', '303호', '402호'),
                validate: {
                    isIn: {
                        args: [['301호', '302호', '303호', '402호']],
                        msg: '비정상적인 location value 접근',
                    },
                },
                comment: '회의실이름',
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(20),
                comment: '회원이름',
            },
            id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                comment: '유저아이디',
            },
        },
        {
            sequelize,
            modelName: 'backup',
            freezeTableName: true, // 테이블명 복수형으로 만들지않기
        },
    );
    return backup;
};
