npx sequelize-cli model:generate --name Account --attributes username:string,password:string,role:string,status:string,userID:integer

npx sequelize-cli model:generate --name User --attributes email:string,name:string,dateOfBirth:string

npx sequelize-cli model:generate --name AcademicAffair --attributes academicAffairCode:string,faculty:string,position:string

npx sequelize-cli model:generate --name Student --attributes studentCode:string,class:string,major:string,status:string

npx sequelize-cli model:generate --name Teacher --attributes teacherCode:string,faculty:string,academicDegree:string

npx sequelize-cli model:generate --name Announcement --attributes title:string,content:string,dateCreated:date,dateUpdated:date,isPublic:boolean

npx sequelize-cli model:generate --name Report --attributes title:string,content:string,dateCreated:date,dateUpdated:date,authorId:integer

npx sequelize-cli model:generate --name Project --attributes name:string,teacherID:integer,requirement:string,maxStudentNumber:integer,type:string,faculty:string,isPublic:boolean,isRegistered:boolean

npx sequelize-cli model:generate --name Implementation --attributes studentID:integer,projectID:integer,score:integer,status:string
