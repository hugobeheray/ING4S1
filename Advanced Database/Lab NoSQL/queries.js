//
// Database: company.js
// 
// Write the MongoDB queries that return the information below:
//

// all the employees
company.emp.find();
// the number of employees
db.emp.count()
// one of the employees, with pretty printing (2 methods)
db.emp.find({_id: 7840}).pretty()
// --
db.emp.find({_id: 7840},{_id:0, manager:0, commission:0})
// all the information about employees, except their salary, commission and missions
db.emp.find({},{salary:0, missions:0, commission:0})
// the name and salary of all the employees (without the field _id)
db.emp.find({},{_id:0, name:1, salary:1})
// the name, salary and first mission (if any) of all the employees (without the field _id)
db.emp.find({},{_id:0, name:1, salary:1, missions:{ $slice:1}})
// --

// the name and salary of the employees with a salary in the range [1,000; 2,500[
db.emp.find({salary: {$gt: 1000, $lt:2500}},{_id:0, name:1, salary:1})
// the name and salary of the clerks with a salary in the range [1,000; 1,500[ (2 methods)
db.emp.find({salary: {$gt: 1000, $lt:1500}, job:"clerk"},{_id:0, name:1, salary:1})
// the employees whose manager is 7839 or whose salary is less than 1000
db.emp.find({salary: {$lt:1000}, manager:7839})
// the clerks and the analysts (2 methods)
db.emp.find({$or: [{job:"clerk"}, {job:"analyst"}]})
// --

// the name, job and salary of the employees, sorted first by job (ascending) and then by salary (descending)
db.emp.find({},{_id:0, name:1, salary:1, job:1}).sort({job:1, salary:-1})
// one of the employees with the highest salary
db.emp.find().sort({salary:-1}).limit(1)
// --

// the employee names that begin with 'S' and end with 't' (2 methods)
db.emp.find({name: {$regex: /^S/}, name: {$regex: /t$/}},{name:1, _id:0})
// the employee names that contain a double 'l'
db.emp.find({name : {$regex: /ll/}},{name:1, _id:0})
// the employee names that begins with 'S' and contains either 'o' or 'm' (2 methods)
db.emp.find({name: {$regex: /^S/}, $or: [{name: {$regex: /o/}},{name: {$regex: /m/}}]},{name:1, _id:0})
// --

// the name and the commission of the employees whose commission is not specified
// (the field "commission" does not exists or it has a null value)
db.emp.find({$or:[{commission:null},{commission:{$exists:false}}]},{name:1, _id:0, commission:1})

// the name and the commission of the employees whose commission is specified
// (the field "commission" does exist and it has a non-null value)
db.emp.find({commission:{$exists:true,$ne:null}},{name:1, _id:0, commission:1})
// the name and the commission of the employees with a field "commission"
// (regardless of its value)
db.emp.find({commission:{$type: 16}},{name:1, _id:0, commission:1})
// the name and the commission of the employees whose commission is null
// (the field "commission" does exist but it has a null value)
db.emp.find({$and:[{commission:{$exists:true}},{commission:null}]},{name:1, _id:0, commission:1})

// --

// the employees who work in Dallas
db.emp.find({"department.location": "Dallas"})
// the employees who don't work in Chicago (2 methods)
db.emp.find({"department.location": {$ne: "Chicago"}})
// the employees who did a mission in Chicago
db.emp.find({"missions.location": "Chicago"})
// the employees who did a mission in Chicago or Dallas  (2 methods)
db.emp.find({$or:[{"missions.location": "Chicago"},{"missions.location": "Dallas"}]})
// the employees who did a mission in Lyon and Paris (2 methods)
db.emp.find({$and:[{"missions.location": "Paris"},{"missions.location": "Lyon"}]})

// the employees who did all their missions in Chicago
db.emp.aggregate(
    { $unwind: "$missions"},
    { $group: { _id: "$_id",
                name:{ "$first": "$name" },
                job:{ "$first": "$job" },
                manager:{ "$first": "$manager" },
                hired:{ "$first": "$hired" },
                salary:{ "$first": "$salary" },
                department:{$push: "$department"}, 
                missions: { $push: "$missions" },
                fail: { $sum: {$cond: { if: { $eq:["$missions.location", 'Chicago'] },
                                        then: 1,
                                        else: 0 } } },
                aSize: { $sum: 1 } } },
    { $project:{ _id: 1, name:1, job:1, manager:1, hired:1, salary:1, department:1, missions: 1, test: { $cond: [{$eq:["$fail","$aSize"]}, 1, 0]} } },
    { $match: {test: 1}},
    { $project:{ _id: 1, name:1, job:1, manager:1, hired:1, salary:1, department:1,  missions: 1} },
).pretty()
// the employees who did a mission for IBM in Chicago
db.emp.aggregate(
    { $unwind: "$missions"},
    { $project:{ _id: 1, name:1, job:1, manager:1, hired:1, salary:1, department:1, missions: 1,
        test: { $cond: { if: { $and: [ { $eq:["$missions.location", "London"] },
                                    { $eq:["$missions.company", "IBM"] }]
                            },
                            then: 0,
                            else: 1 }} } },
    {$match:{test:0}},
    { $project:{ _id: 1, name:1, job:1, manager:1, hired:1, salary:1, department:1,  missions: 1} }
).pretty()
// the employees who did their first mission for IBM
db.emp.find({"missions.0.company":"IBM"})
// the employees who did exactly two missions
db.emp.aggregate(
    { $unwind: "$missions"},
    { $group: { _id: "$_id",
                name:{ "$first": "$name" },
                job:{ "$first": "$job" },
                manager:{ "$first": "$manager" },
                hired:{ "$first": "$hired" },
                salary:{ "$first": "$salary" },
                department:{$push: "$department"}, 
                missions: { $push: "$missions" },
                aSize: { $sum: 1 } } },
    { $match: {aSize:2}},
    { $project:{ _id: 1, name:1, job:1, manager:1, hired:1, salary:1, department:1,  missions: 1} },
).pretty()
// --

// the jobs in the company
db.emp.distinct('job')
// the name of the departments
db.emp.distinct('department.name')
// the cities in which the missions took place
db.emp.distinct('missions.location')

// --

// the employees with the same job as Jones'










