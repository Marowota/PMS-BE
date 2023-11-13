npx sequelize-cli model:generate --name Account --attributes username:string,password:string,role:string,status:string,userID:integer

npx sequelize-cli model:generate --name User --attributes email:string,name:string,dateOfBirth:string

npx sequelize-cli model:generate --name AcademicAffair --attributes academicAffairCode:string,faculty:string,position:string,userID:integer

npx sequelize-cli model:generate --name Student --attributes studentCode:string,class:string,major:string,status:string,userID:integer

npx sequelize-cli model:generate --name Teacher --attributes teacherCode:string,faculty:string,academicDegree:string,userID:integer

npx sequelize-cli model:generate --name Announcement --attributes title:string,content:string,dateCreated:date,dateUpdated:date,isPublic:boolean

npx sequelize-cli model:generate --name Report --attributes title:string,content:string,dateCreated:date,dateUpdated:date,authorId:integer

npx sequelize-cli model:generate --name Project --attributes name:string,teacherID:integer,requirement:string,maxStudentNumber:integer,type:string,faculty:string,isPublic:boolean,isRegistered:boolean

npx sequelize-cli model:generate --name Implementation --attributes studentID:integer,projectID:integer,score:integer,status:string


#run this after all
npx sequelize-cli db:migrate

# generate seeder file - need data for seeder
npx sequelize-cli seed:generate --name demo-academic-affair

npx sequelize-cli seed:generate --name demo-account

npx sequelize-cli seed:generate --name demo-announcement

npx sequelize-cli seed:generate --name demo-implementation

npx sequelize-cli seed:generate --name demo-project

npx sequelize-cli seed:generate --name demo-report

npx sequelize-cli seed:generate --name demo-student

npx sequelize-cli seed:generate --name demo-teacher

npx sequelize-cli seed:generate --name demo-user



